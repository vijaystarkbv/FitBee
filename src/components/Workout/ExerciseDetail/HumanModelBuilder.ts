import * as THREE from 'three';

export interface BuiltHumanModel {
  group: THREE.Group;
  bones: {
    hips: THREE.Bone;
    spine: THREE.Bone;
    chest: THREE.Bone;
    neck: THREE.Bone;
    head: THREE.Bone;
    leftShoulder: THREE.Bone;
    rightShoulder: THREE.Bone;
  };
  muscleMeshes: Map<string, THREE.Mesh>;
  updateAnimation: (timeSec: number, animationKey: string) => void;
}

export function createHumanBaseModel(): BuiltHumanModel {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'FitBee_Human_Base_Model';

  const muscleMeshes = new Map<string, THREE.Mesh>();

  // Crisp Matte Silver-Gray Base Material
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x8E8E96,
    roughness: 0.55,
    metalness: 0.08,
    flatShading: false,
  });

  const createMesh = (
    name: string,
    geometry: THREE.BufferGeometry,
    position: THREE.Vector3,
    rotation: THREE.Euler = new THREE.Euler(),
    scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1),
    parent: THREE.Object3D = rootGroup
  ): THREE.Mesh => {
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, baseMaterial.clone());
    mesh.name = name;
    mesh.position.copy(position);
    mesh.rotation.copy(rotation);
    mesh.scale.copy(scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    muscleMeshes.set(name.toLowerCase(), mesh);
    return mesh;
  };

  const createTaperedProfile = (
    radiusTop: number,
    radiusBottom: number,
    height: number,
    radialSegments = 24,
    heightSegments = 16,
    curveFactor = 0.06
  ): THREE.BufferGeometry => {
    const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const normalizedY = y / height;
      const bulge = Math.cos(normalizedY * Math.PI) * curveFactor;
      pos.setX(i, pos.getX(i) * (1 + bulge));
      pos.setZ(i, pos.getZ(i) * (1 + bulge * 0.9));
    }
    geo.computeVertexNormals();
    return geo;
  };

  // Bones Hierarchy
  const hips = new THREE.Bone();
  hips.position.set(0, 0.96, 0);

  const spine = new THREE.Bone();
  spine.position.set(0, 0.24, 0);
  hips.add(spine);

  const chest = new THREE.Bone();
  chest.position.set(0, 0.28, 0);
  spine.add(chest);

  const neck = new THREE.Bone();
  neck.position.set(0, 0.22, 0);
  chest.add(neck);

  const head = new THREE.Bone();
  head.position.set(0, 0.14, 0);
  neck.add(head);

  const leftShoulder = new THREE.Bone();
  leftShoulder.position.set(-0.21, 0.18, 0);
  chest.add(leftShoulder);

  const rightShoulder = new THREE.Bone();
  rightShoulder.position.set(0.21, 0.18, 0);
  chest.add(rightShoulder);

  rootGroup.add(hips);

  // 1. Head & Jaw
  const headGeo = new THREE.SphereGeometry(0.105, 24, 20);
  const headPos = headGeo.attributes.position;
  for (let i = 0; i < headPos.count; i++) {
    let x = headPos.getX(i);
    let y = headPos.getY(i);
    let z = headPos.getZ(i);
    if (y < 0) {
      z *= (1 + y * 0.8);
      x *= (1 + y * 0.4);
    }
    x *= 0.92;
    headPos.setXYZ(i, x, y, z);
  }
  createMesh('head_mesh', headGeo, new THREE.Vector3(0, 0.08, 0.01), new THREE.Euler(), new THREE.Vector3(1, 1.1, 1), head);

  // 2. Neck (Primary Target Muscle for Neck Flexion)
  const neckGeo = createTaperedProfile(0.068, 0.085, 0.16, 24, 16, 0.08);
  const neckMesh = createMesh('neck', neckGeo, new THREE.Vector3(0, 0.07, 0), new THREE.Euler(), new THREE.Vector3(1, 1, 1), neck);
  muscleMeshes.set('sternocleidomastoid', neckMesh);

  // 3. Trapezius & Chest
  const trapeziusGeo = createTaperedProfile(0.09, 0.22, 0.14, 24, 12, 0.12);
  createMesh('trapezius', trapeziusGeo, new THREE.Vector3(0, -0.01, -0.01), new THREE.Euler(0.1, 0, 0), new THREE.Vector3(1.1, 1, 0.9), chest);

  const chestGeo = new THREE.SphereGeometry(0.2, 24, 20);
  const chestPos = chestGeo.attributes.position;
  for (let i = 0; i < chestPos.count; i++) {
    let x = chestPos.getX(i);
    let y = chestPos.getY(i);
    let z = chestPos.getZ(i);
    if (z > 0) z *= 1.25;
    if (Math.abs(x) < 0.03 && z > 0) z *= 0.7;
    chestPos.setXYZ(i, x * 1.1, y * 0.65, z * 0.75);
  }
  createMesh('chest', chestGeo, new THREE.Vector3(0, 0.1, 0.04), new THREE.Euler(), new THREE.Vector3(1, 1, 1), chest);

  // 4. Shoulders
  const deltGeo = new THREE.SphereGeometry(0.105, 20, 18);
  createMesh('shoulders_left', deltGeo, new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, -0.15), new THREE.Vector3(1, 1.1, 1), leftShoulder);
  createMesh('shoulders_right', deltGeo, new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, 0.15), new THREE.Vector3(1, 1.1, 1), rightShoulder);

  // 5. Arms & Forearms
  const bicepGeo = createTaperedProfile(0.052, 0.042, 0.24, 20, 14, 0.15);
  createMesh('biceps_left', bicepGeo, new THREE.Vector3(-0.25, -0.06, 0.01), new THREE.Euler(0, 0, 0.08), new THREE.Vector3(1, 1, 1), chest);
  createMesh('biceps_right', bicepGeo, new THREE.Vector3(0.25, -0.06, 0.01), new THREE.Euler(0, 0, -0.08), new THREE.Vector3(1, 1, 1), chest);

  const forearmGeo = createTaperedProfile(0.046, 0.028, 0.26, 20, 16, 0.18);
  createMesh('forearms', forearmGeo, new THREE.Vector3(-0.27, -0.29, 0.01), new THREE.Euler(0, 0, 0.06), new THREE.Vector3(1, 1, 1), chest);

  // 6. Core & Torso
  const absGeo = createTaperedProfile(0.14, 0.125, 0.26, 20, 16, 0.06);
  createMesh('abs', absGeo, new THREE.Vector3(0, 0.12, 0.02), new THREE.Euler(), new THREE.Vector3(1, 1, 1), spine);

  const obliquesGeo = createTaperedProfile(0.155, 0.135, 0.22, 20, 14, 0.08);
  createMesh('obliques', obliquesGeo, new THREE.Vector3(0, 0.01, 0), new THREE.Euler(), new THREE.Vector3(1, 1, 1), spine);

  const latsGeo = createTaperedProfile(0.22, 0.14, 0.3, 24, 16, 0.14);
  createMesh('lats', latsGeo, new THREE.Vector3(0, 0.12, -0.03), new THREE.Euler(), new THREE.Vector3(1, 1, 1), chest);

  // 7. Legs & Calves
  const quadGeo = createTaperedProfile(0.098, 0.062, 0.44, 24, 18, 0.16);
  createMesh('quads_left', quadGeo, new THREE.Vector3(-0.12, -0.26, 0.02), new THREE.Euler(0, 0, -0.03), new THREE.Vector3(1, 1, 1), hips);
  createMesh('quads_right', quadGeo, new THREE.Vector3(0.12, -0.26, 0.02), new THREE.Euler(0, 0, 0.03), new THREE.Vector3(1, 1, 1), hips);

  const calfGeo = createTaperedProfile(0.068, 0.032, 0.38, 20, 16, 0.22);
  createMesh('calves_left', calfGeo, new THREE.Vector3(-0.12, -0.67, 0.01), new THREE.Euler(), new THREE.Vector3(1, 1, 1), hips);
  createMesh('calves_right', calfGeo, new THREE.Vector3(0.12, -0.67, 0.01), new THREE.Euler(), new THREE.Vector3(1, 1, 1), hips);

  const updateAnimation = (timeSec: number, animationKey: string) => {
    if (animationKey === 'neck_flexion') {
      const cycle = (Math.sin(timeSec * 1.8) + 1) / 2;
      const angle = cycle * 0.65; // Max 0.65 rad forward bend
      neck.rotation.x = angle * 0.7;
      head.rotation.x = angle * 0.3;
    } else {
      const breath = Math.sin(timeSec * 1.5) * 0.012;
      chest.position.y = 0.28 + breath;
    }
  };

  return {
    group: rootGroup,
    bones: { hips, spine, chest, neck, head, leftShoulder, rightShoulder },
    muscleMeshes,
    updateAnimation,
  };
}
