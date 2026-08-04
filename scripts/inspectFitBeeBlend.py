import bpy

print("=" * 60)
print("INSPECTING FitBee_Base_Rig.blend")
print("=" * 60)

print(f"Blender Version: {bpy.app.version_string}")

print("\n--- OBJECTS IN SCENE ---")
for obj in bpy.data.objects:
    print(f"Object: '{obj.name}' | Type: {obj.type} | Parent: {obj.parent.name if obj.parent else 'None'}")

print("\n--- ARMATURES ---")
for arm in bpy.data.armatures:
    print(f"Armature: '{arm.name}' | Bones count: {len(arm.bones)}")
    for bone in arm.bones:
        print(f"   Bone: '{bone.name}' | Parent: {bone.parent.name if bone.parent else 'None'}")

print("\n--- ANIMATION ACTIONS ---")
for act in bpy.data.actions:
    print(f"Action: '{act.name}' | Frame range: {act.frame_range}")

print("=" * 60)
