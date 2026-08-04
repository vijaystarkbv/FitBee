import bpy
import math

def rad(deg):
    return math.radians(deg)

def apply_master_idle_pose(armature_obj):
    """
    Applies FitBee's master relaxed standing idle pose to the armature.
    - Hands down beside thighs
    - Elbows naturally bent (~15°)
    - Shoulders relaxed down
    - Feet in shoulder-width stance, knees slightly unlocked
    """
    if not armature_obj:
        return

    left_arm = armature_obj.pose.bones.get("mixamorig:LeftArm")
    right_arm = armature_obj.pose.bones.get("mixamorig:RightArm")
    left_forearm = armature_obj.pose.bones.get("mixamorig:LeftForeArm")
    right_forearm = armature_obj.pose.bones.get("mixamorig:RightForeArm")
    left_hand = armature_obj.pose.bones.get("mixamorig:LeftHand")
    right_hand = armature_obj.pose.bones.get("mixamorig:RightHand")
    left_shoulder = armature_obj.pose.bones.get("mixamorig:LeftShoulder")
    right_shoulder = armature_obj.pose.bones.get("mixamorig:RightShoulder")
    left_leg = armature_obj.pose.bones.get("mixamorig:LeftUpLeg")
    right_leg = armature_obj.pose.bones.get("mixamorig:RightUpLeg")
    left_knee = armature_obj.pose.bones.get("mixamorig:LeftLeg")
    right_knee = armature_obj.pose.bones.get("mixamorig:RightLeg")

    # Lower arms beside body so hands touch the thighs
    if left_arm:
        left_arm.rotation_mode = 'XYZ'
        left_arm.rotation_euler = (rad(5), 0, rad(-82))
    if right_arm:
        right_arm.rotation_mode = 'XYZ'
        right_arm.rotation_euler = (rad(5), 0, rad(82))

    if left_forearm:
        left_forearm.rotation_mode = 'XYZ'
        left_forearm.rotation_euler = (0, rad(15), 0)
    if right_forearm:
        right_forearm.rotation_mode = 'XYZ'
        right_forearm.rotation_euler = (0, rad(-15), 0)

    if left_hand:
        left_hand.rotation_mode = 'XYZ'
        left_hand.rotation_euler = (0, 0, rad(-5))
    if right_hand:
        right_hand.rotation_mode = 'XYZ'
        right_hand.rotation_euler = (0, 0, rad(5))

    if left_shoulder:
        left_shoulder.rotation_mode = 'XYZ'
        left_shoulder.rotation_euler = (0, 0, rad(-5))
    if right_shoulder:
        right_shoulder.rotation_mode = 'XYZ'
        right_shoulder.rotation_euler = (0, 0, rad(5))

    if left_leg:
        left_leg.rotation_mode = 'XYZ'
        left_leg.rotation_euler = (rad(-2), 0, rad(-3))
    if right_leg:
        right_leg.rotation_mode = 'XYZ'
        right_leg.rotation_euler = (rad(-2), 0, rad(3))

    if left_knee:
        left_knee.rotation_mode = 'XYZ'
        left_knee.rotation_euler = (rad(4), 0, 0)
    if right_knee:
        right_knee.rotation_mode = 'XYZ'
        right_knee.rotation_euler = (rad(4), 0, 0)

    bpy.context.view_layer.update()
