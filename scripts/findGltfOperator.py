import bpy

print("=" * 60)
print("FINDING GLTF EXPORT OPERATOR IN BLENDER 5.2")
print("=" * 60)

ops = []
for category in dir(bpy.ops):
    cat_obj = getattr(bpy.ops, category)
    for op in dir(cat_obj):
        if 'gltf' in op.lower() or 'export' in op.lower():
            ops.append(f"bpy.ops.{category}.{op}")

for op in ops:
    print(f"Found operator: {op}")

print("=" * 60)
