import bpy

print("=" * 60)
print("INSPECTING ACTIONS & FCURVES IN FitBee_Base_Rig.blend")
print("=" * 60)

armature_obj = bpy.data.objects.get("Armature")

if armature_obj and armature_obj.animation_data:
    action = armature_obj.animation_data.action
    print(f"Active Action: {action.name if action else 'None'}")

    print("\nAll Actions in Blender:")
    for a in bpy.data.actions:
        print(f" - Action Name: {a.name}, FCurves Count: {len(a.fcurves)}")

    if action:
        print(f"\nFCurves in Active Action '{action.name}':")
        for fc in action.fcurves:
            print(f"  • {fc.data_path}")
else:
    print("Armature object or animation_data not found.")

print("=" * 60)
