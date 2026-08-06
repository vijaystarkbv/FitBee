# FitBee Master Rig Specification
Version: 1.0

---

# PURPOSE

This file defines the ONLY character rig used throughout the FitBee project.

Every Blender Python script MUST follow this specification.

Never rename bones.
Never create duplicate armatures.
Never replace the skeleton.

All generated animations MUST use this exact rig.

---

# MASTER MODEL

Filename:

Human_Base.glb
At 
"E:\BackUp data\Some_New_Shitty_thing_Which_I'm_Trying\FitBee\public\assets\models\base"

The master model contains:

- One Mesh
- One Armature
- Mixamo Skeleton
- No Animation
- No Constraints
- No Shape Keys

This file should NEVER be modified directly.

Always create a copy before generating animations.

---

# ARMATURE

Object Name:

Armature

Mesh Name:

Char_Mlp

Only ONE armature exists.

---

# TRANSFORMS

Location

X = 0
Y = 0
Z = 0

Rotation

Quaternion

W = 1
X = 0
Y = 0
Z = 0

Scale

X = 1
Y = 1
Z = 1

Never change these values.

---

# REST POSE

Rest Pose:

A-Pose

Always return the armature to the original A-Pose before generating a new animation.

Never modify the rest pose.

---

# COORDINATE SYSTEM

Character faces:

Negative Y (-Y)

Feet touch:

Ground Plane (Z = 0)

Do NOT rotate the entire character.

Do NOT move the root object.

Only rotate bones.

---

# ROOT BONE

mixamorig:Hips

This is the root animation bone.

Whole body movement should originate from this bone.

---

# SPINE

mixamorig:Spine

mixamorig:Spine1

mixamorig:Spine2

mixamorig:Neck

mixamorig:Head

---

# LEFT ARM

mixamorig:LeftShoulder

mixamorig:LeftArm

mixamorig:LeftForeArm

mixamorig:LeftHand

---

# RIGHT ARM

mixamorig:RightShoulder

mixamorig:RightArm

mixamorig:RightForeArm

mixamorig:RightHand

---

# LEFT LEG

mixamorig:LeftUpLeg

mixamorig:LeftLeg

mixamorig:LeftFoot

mixamorig:LeftToeBase

mixamorig:LeftToe_End

---

# RIGHT LEG

mixamorig:RightUpLeg

mixamorig:RightLeg

mixamorig:RightFoot

mixamorig:RightToeBase

mixamorig:RightToe_End

---

# FINGER BONES

The rig includes complete finger chains.

These may be animated when necessary.

Default behavior:

Leave fingers unchanged unless the exercise explicitly requires gripping.

Thumb:

mixamorig:LeftHandThumb1
mixamorig:LeftHandThumb2
mixamorig:LeftHandThumb3
mixamorig:LeftHandThumb4

Index:

mixamorig:LeftHandIndex1
mixamorig:LeftHandIndex2
mixamorig:LeftHandIndex3
mixamorig:LeftHandIndex4

Middle:

mixamorig:LeftHandMiddle1
mixamorig:LeftHandMiddle2
mixamorig:LeftHandMiddle3
mixamorig:LeftHandMiddle4

Ring:

mixamorig:LeftHandRing1
mixamorig:LeftHandRing2
mixamorig:LeftHandRing3
mixamorig:LeftHandRing4

Pinky:

mixamorig:LeftHandPinky1
mixamorig:LeftHandPinky2
mixamorig:LeftHandPinky3
mixamorig:LeftHandPinky4

The right hand follows the same naming convention.

---

# VERTEX GROUPS

Every vertex group matches the corresponding bone name exactly.

Never rename any vertex group.

---

# CONSTRAINTS

No Bone Constraints.

Do not add IK.

Do not add Copy Rotation.

Do not add Child Of.

Animations must be produced using direct bone rotations.

---

# SHAPE KEYS

None.

Do not create Shape Keys.

---

# ANIMATION RULES

Every generated animation must:

- Animate ONLY the armature.
- Never deform the mesh directly.
- Never modify the mesh topology.
- Never modify vertex groups.
- Never modify armature hierarchy.
- Never rename bones.
- Never change the rest pose.
- Never change object transforms.
- Never add or remove bones.
- Never delete existing bones.

---

# EXPORT RULES

Export Format:

glTF Binary (.glb)

Export only:

- Mesh
- Armature
- Animation
- lights (which ever was made for that animation)
= camara (if modfied or used)

Do not export:


Unused Objects

---

# PYTHON SCRIPT RULES

Python scripts must:

Locate the existing Armature.

Locate the existing Mesh.

Create animation keyframes ONLY on Pose Bones.

Never create a second armature.

Never import another character.

Never replace the skeleton.

Never regenerate the rig.

Never modify the base file.

---

# GOAL

The Human_Base.glb file is the permanent master character for FitBee.

Every exercise animation in the project must be generated using this exact rig.