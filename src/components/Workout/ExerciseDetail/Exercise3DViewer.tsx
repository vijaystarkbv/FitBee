import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface Exercise3DViewerProps {
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  animationKey?: string;
  category?: string;
  cameraFocusBone?: string;
  cameraOffsetY?: number;
}

// Reusable mapping from Muscle Groups to Skeleton Bone Names
const MUSCLE_BONE_MAPPING: Record<string, string[]> = {
  neck: ['mixamorig:Neck', 'mixamorig:Head'],
  head: ['mixamorig:Head'],
  chest: ['mixamorig:Spine1', 'mixamorig:Spine2'],
  abs: ['mixamorig:Spine'],
  back: ['mixamorig:Spine', 'mixamorig:Spine1', 'mixamorig:Spine2'],
  shoulders: ['mixamorig:LeftShoulder', 'mixamorig:RightShoulder'],
  deltoids: ['mixamorig:LeftShoulder', 'mixamorig:RightShoulder'],
  biceps: ['mixamorig:LeftForeArm', 'mixamorig:RightForeArm'],
  triceps: ['mixamorig:LeftArm', 'mixamorig:RightArm'],
  quads: ['mixamorig:LeftUpLeg', 'mixamorig:RightUpLeg'],
  hamstrings: ['mixamorig:LeftUpLeg', 'mixamorig:RightUpLeg'],
  calves: ['mixamorig:LeftLeg', 'mixamorig:RightLeg'],
};

export const Exercise3DViewer: React.FC<Exercise3DViewerProps> = ({
  primaryMuscles = ['Neck'],
  secondaryMuscles = [],
  animationKey = 'neck_flexion',
  category = 'neck',
  cameraOffsetY = 0.15,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);
  const [assetStatusMsg, setAssetStatusMsg] = useState<string>('Loading 3D Exercise Model...');

  // Playback State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);

  // Update Animation Mixer speed when pause or speed state changes
  useEffect(() => {
    if (mixerRef.current) {
      mixerRef.current.timeScale = isPaused ? 0 : playbackSpeed;
    }
  }, [isPaused, playbackSpeed]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const width = canvas.parentElement?.clientWidth || 400;
    const height = canvas.parentElement?.clientHeight || 420;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Pure Black

    // --- 2. CAMERA FRAMING (Centered, Framing Knees to Head) ---
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.25 + cameraOffsetY, 1.95);

    // --- 3. RENDERER (REACT-OWNED CANVAS) ---
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // --- 4. LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(2.5, 4.5, 3.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x89b0ae, 0.8);
    fillLight.position.set(-3, 2.5, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
    rimLight.position.set(0, 3.5, -3.5);
    scene.add(rimLight);

    // --- 5. PEDESTAL / FLOOR ---
    const floorGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.04, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1A1A20,
      roughness: 0.85,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.02, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // --- 6. ORBIT CONTROLS (Perfect Horizontal Centering) ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.05 + cameraOffsetY * 0.5, 0);
    controls.minDistance = 1.0;
    controls.maxDistance = 4.5;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.enablePan = false;

    // --- 7. DYNAMIC ASSET LOADING & RUNTIME MUSCLE HIGHLIGHTING ---
    const loader = new GLTFLoader();
    const glbAssetUrl = `/assets/models/animations/${category}/${animationKey}.glb`;

    loader.load(
      glbAssetUrl,
      // onLoad Callback
      (gltf) => {
        if (gltf && gltf.scene) {
          const model = gltf.scene;

          // Auto-frame character model
          const bbox = new THREE.Box3().setFromObject(model);
          const size = bbox.getSize(new THREE.Vector3());
          const center = bbox.getCenter(new THREE.Vector3());

          const targetHeight = 1.8;
          const scaleFactor = targetHeight / (size.y || 1.8);

          model.scale.set(scaleFactor, scaleFactor, scaleFactor);
          model.position.x = -center.x * scaleFactor;
          model.position.y = -bbox.min.y * scaleFactor + 0.02;
          model.position.z = -center.z * scaleFactor;

          // RUNTIME ANATOMICAL MUSCLE HIGHLIGHTING VIA VERTEX BONE WEIGHTS
          model.traverse((child) => {
            if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
              const mesh = child as THREE.SkinnedMesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              const geometry = mesh.geometry.clone();
              const skeleton = mesh.skeleton;

              if (geometry.attributes.skinIndex && geometry.attributes.skinWeight && skeleton) {
                const skinIndex = geometry.attributes.skinIndex;
                const skinWeight = geometry.attributes.skinWeight;
                const vertexCount = geometry.attributes.position.count;

                // Resolve primary and secondary bone names from muscle lists
                const primaryBoneNames = primaryMuscles.flatMap(m => MUSCLE_BONE_MAPPING[m.toLowerCase()] || []);
                const secondaryBoneNames = secondaryMuscles.flatMap(m => MUSCLE_BONE_MAPPING[m.toLowerCase()] || []);

                const primaryBoneIndices = skeleton.bones
                  .map((b, idx) => (primaryBoneNames.includes(b.name) ? idx : -1))
                  .filter(idx => idx !== -1);

                const secondaryBoneIndices = skeleton.bones
                  .map((b, idx) => (secondaryBoneNames.includes(b.name) ? idx : -1))
                  .filter(idx => idx !== -1);

                const colors = new Float32Array(vertexCount * 3);

                for (let i = 0; i < vertexCount; i++) {
                  const ix = skinIndex.getX(i);
                  const iy = skinIndex.getY(i);
                  const iz = skinIndex.getZ(i);
                  const iw = skinIndex.getW(i);

                  const wx = skinWeight.getX(i);
                  const wy = skinWeight.getY(i);
                  const wz = skinWeight.getZ(i);
                  const ww = skinWeight.getW(i);

                  let priWeight = 0;
                  let secWeight = 0;

                  [ [ix, wx], [iy, wy], [iz, wz], [iw, ww] ].forEach(([bIdx, bW]) => {
                    if (primaryBoneIndices.includes(bIdx as number)) priWeight += bW as number;
                    if (secondaryBoneIndices.includes(bIdx as number)) secWeight += bW as number;
                  });

                  if (priWeight > 0.12) {
                    // Primary Muscle: Bright Red #FF3B30
                    colors[i * 3 + 0] = 1.0;
                    colors[i * 3 + 1] = 0.23;
                    colors[i * 3 + 2] = 0.19;
                  } else if (secWeight > 0.12) {
                    // Secondary Muscle: Bright Yellow #FFCC00
                    colors[i * 3 + 0] = 1.0;
                    colors[i * 3 + 1] = 0.8;
                    colors[i * 3 + 2] = 0.0;
                  } else {
                    // Neutral Body: Neutral Gray #8E8E96
                    colors[i * 3 + 0] = 0.55;
                    colors[i * 3 + 1] = 0.55;
                    colors[i * 3 + 2] = 0.59;
                  }
                }

                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                mesh.geometry = geometry;

                mesh.material = new THREE.MeshStandardMaterial({
                  vertexColors: true,
                  roughness: 0.45,
                  metalness: 0.1,
                });
              }
            }
          });

          scene.add(model);
          setIsAssetLoaded(true);

          // Setup Keyframe Animation Mixer
          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            mixer.timeScale = isPaused ? 0 : playbackSpeed;
            const action = mixer.clipAction(gltf.animations[0]);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
            mixerRef.current = mixer;
          }
        }
      },
      // onProgress Callback
      undefined,
      // onError Callback
      (err) => {
        setAssetStatusMsg(`Awaiting Blender Export: public/assets/models/animations/${category}/${animationKey}.glb`);
        console.warn(`FitBee GLTFLoader Notice: Could not load '${glbAssetUrl}'. Place Blender-exported GLB in assets directory.`, err);
      }
    );

    // --- 8. ANIMATION RENDER LOOP ---
    let animFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // --- 9. RESIZE & CLEANUP ---
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight || 420;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      floorGeo.dispose();
      floorMat.dispose();
      renderer.dispose();
    };
  }, [primaryMuscles, secondaryMuscles, animationKey, category, cameraOffsetY]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const selectSpeed = (spd: number) => {
    setPlaybackSpeed(spd);
    setShowSpeedMenu(false);
  };

  const primaryLabel = primaryMuscles.length > 0 ? primaryMuscles.join(', ') : 'None';
  const secondaryLabel = secondaryMuscles.length > 0 ? secondaryMuscles.join(', ') : 'None';

  return (
    <div className="fitbee-3d-wrapper">
      <div className="fitbee-3d-container" style={{ position: 'relative', width: '100%', height: '420px', backgroundColor: '#000000' }}>
        {/* React-owned canvas */}
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* TOP-RIGHT PLAYBACK CONTROLS OVERLAY (Pause & Speed) */}
        <div className="fitbee-3d-controls-overlay">
          {/* Pause / Play Button */}
          <button
            className="fitbee-ctrl-btn"
            onClick={togglePause}
            title={isPaused ? 'Resume Animation' : 'Pause Animation'}
          >
            {isPaused ? (
              <>
                <svg className="fitbee-ctrl-icon" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Play</span>
              </>
            ) : (
              <>
                <svg className="fitbee-ctrl-icon" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="fitbee-speed-wrapper">
            <button
              className="fitbee-ctrl-btn"
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              title="Change Speed"
            >
              <span>{playbackSpeed}×</span>
              <svg className="fitbee-ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Speed Dropdown Menu */}
            {showSpeedMenu && (
              <div className="fitbee-speed-menu">
                {[0.5, 0.75, 1.0, 1.5].map((spd) => (
                  <button
                    key={spd}
                    className={`fitbee-speed-option ${playbackSpeed === spd ? 'active' : ''}`}
                    onClick={() => selectSpeed(spd)}
                  >
                    {spd}×
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status notice overlay when pending Blender export */}
        {!isAssetLoaded && (
          <div className="fitbee-3d-loading" style={{ padding: '0 20px', textAlign: 'center' }}>
            <div className="fitbee-spinner"></div>
            <span style={{ fontSize: 13, lineHeight: 1.4 }}>{assetStatusMsg}</span>
          </div>
        )}

        {/* Instruction Badge */}
        <div className="fitbee-3d-hint">
          <span>Drag to Rotate • Pinch to Zoom</span>
        </div>
      </div>

      {/* Reusable Dynamic Legend below 3D Viewer */}
      <div className="fitbee-legend-bar">
        <div className="fitbee-legend-item">
          <span className="fitbee-legend-dot primary"></span>
          <span className="fitbee-legend-label">Primary Muscle ({primaryLabel})</span>
        </div>
        <div className="fitbee-legend-item">
          <span className="fitbee-legend-dot secondary"></span>
          <span className="fitbee-legend-label">Secondary Muscle ({secondaryLabel})</span>
        </div>
        <div className="fitbee-legend-item">
          <span className="fitbee-legend-dot neutral"></span>
          <span className="fitbee-legend-label">Neutral</span>
        </div>
      </div>
    </div>
  );
};
