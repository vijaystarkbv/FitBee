import bpy
import os

print("=" * 60)
print("INSPECTING Human_Base.glb IN BLENDER")
print("=" * 60)

master_glb_path = os.path.join(os.getcwd(), "public", "assets", "models", "base", "Human_Base.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=master_glb_path)

print(f"\nAll Objects in Human_Base.glb:")
for obj in bpy.data.objects:
    print(f" - Object: '{obj.name}' | Type: {obj.type} | Parent: {obj.parent.name if obj.parent else 'None'}")
    if obj.type == 'MESH':
        print(f"   Vertices: {len(obj.data.vertices)} | Modifiers: {[m.type for m in obj.modifiers]}")

print("=" * 60)
