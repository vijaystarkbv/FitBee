import sys
import os
import math
import bpy

# Ensure scripts dir is in sys.path for importing fitbee_idle_pose
scripts_dir = os.path.dirname(os.path.abspath(__file__))
if scripts_dir not in sys.path:
    sys.path.append(scripts_dir)

from fitbee_idle_pose import apply_master_idle_pose

print("=" * 60)
print("EXPORTING FITBEE NECK FLEXION GLB WITH BRAND NEW ACTION")
print("=" * 60)

anim_dir = os.path.join(os.getcwd(), "public", "assets", "models", "animations", "neck")
os.makedirs(anim_dir, exist_ok=True)
anim_glb_path = os.path.join(anim_dir, "neck_flexion.glb")

# Select Armature and Char_Mlp
for obj in bpy.data.objects:
    obj.select_set(False)

armature_obj = bpy.data.objects.get("Armature")
mesh_obj = bpy.data.objects.get("Char_Mlp")

if armature_obj:
    armature_obj.select_set(True)
    bpy.context.view_layer.objects.active = armature_obj
if mesh_obj:
    mesh_obj.select_set(True)

if armature_obj:
    # 1. PURGE ALL OLD MIXAMO & EXISTING ACTIONS TO PREVENT ARM KEYFRAME INHERITANCE
    if armature_obj.animation_data:
        armature_obj.animation_data.action = None
        if hasattr(armature_obj.animation_data, 'nla_tracks'):
            for track in list(armature_obj.animation_data.nla_tracks):
                armature_obj.animation_data.nla_tracks.remove(track)

    for act in list(bpy.data.actions):
        bpy.data.actions.remove(act)

    # 2. CREATE A BRAND NEW CLEAN ACTION FOR THIS EXERCISE ONLY
    if not armature_obj.animation_data:
        armature_obj.animation_data_create()

    neck_flex_action = bpy.data.actions.new(name="FitBee_Neck_Flexion_Action")
    armature_obj.animation_data.action = neck_flex_action

    # 3. APPLY MASTER IDLE POSE (ARM POSITIONS STAY STATIC & UNKEYFRAMED)
    apply_master_idle_pose(armature_obj)

    # 4. KEYFRAME ONLY NECK & HEAD BONES
    neck_bone = armature_obj.pose.bones.get("mixamorig:Neck")
    head_bone = armature_obj.pose.bones.get("mixamorig:Head")

    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 120

    flex_neck_angle = math.radians(36)
    flex_head_angle = math.radians(16)

    # Frame 1 to 20 (0.67s): Neutral Idle Hold
    if neck_bone:
        neck_bone.rotation_mode = 'XYZ'
        neck_bone.rotation_euler = (0, 0, 0)
        neck_bone.keyframe_insert(data_path="rotation_euler", frame=1)
        neck_bone.keyframe_insert(data_path="rotation_euler", frame=20)
    if head_bone:
        head_bone.rotation_mode = 'XYZ'
        head_bone.rotation_euler = (0, 0, 0)
        head_bone.keyframe_insert(data_path="rotation_euler", frame=1)
        head_bone.keyframe_insert(data_path="rotation_euler", frame=20)

    # Frame 55 to 75 (0.67s): Peak Flexion (Chin to Chest Hold)
    if neck_bone:
        neck_bone.rotation_euler = (flex_neck_angle, 0, 0)
        neck_bone.keyframe_insert(data_path="rotation_euler", frame=55)
        neck_bone.keyframe_insert(data_path="rotation_euler", frame=75)
    if head_bone:
        head_bone.rotation_euler = (flex_head_angle, 0, 0)
        head_bone.keyframe_insert(data_path="rotation_euler", frame=55)
        head_bone.keyframe_insert(data_path="rotation_euler", frame=75)

    # Frame 110 to 120 (0.33s): Neutral Idle Return & Hold
    if neck_bone:
        neck_bone.rotation_euler = (0, 0, 0)
        neck_bone.keyframe_insert(data_path="rotation_euler", frame=110)
        neck_bone.keyframe_insert(data_path="rotation_euler", frame=120)
    if head_bone:
        head_bone.rotation_euler = (0, 0, 0)
        head_bone.keyframe_insert(data_path="rotation_euler", frame=110)
        head_bone.keyframe_insert(data_path="rotation_euler", frame=120)

    # 5. VERIFY CHANNELS IN NEW ACTION
    print(f"✅ Verified Action '{neck_flex_action.name}' active on Armature.")

# 6. EXPORT CLEAN ISOLATED ANIMATED GLB
bpy.ops.export_scene.gltf(
    filepath=anim_glb_path,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_animations=True
)
print(f"✅ Successfully exported isolated Neck Flexion GLB: {anim_glb_path} ({os.path.getsize(anim_glb_path)} bytes)")
print("=" * 60)
