/**
 * Created by bblumberg on 1/28/15.
 */
/**
 * JointNode is the ThreeJS representation of a revolute joint. It is composed of 2 Object3Ds. The parent Object3D
 * represents the fixed pose of the joint relative to its
 *
 * @constructor
 * @param options - object with following keys:
 *
 *  * name - the name of the joint
 *  * origin - this is the fixed pose of the joint relative to its parent joint
 *  * limit - can be empty, but conatins the limit information from the urdf (effort, lower, upper, velocity)
 *  * axis - this is the axis of rotation of the joint
 *  * object - the THREE 3D object to be rendered
 */

ROS3D.RtJointNode = function(options) {
  options = options || {};
  THREE.Object3D.call(this);
  this.origin = options.origin || new ROSLIB.Pose();

  this.activeJoint = new THREE.Object3D();
  // set the axis
  this.axis = new THREE.Vector3();
  this.axis.set(options.axis.x,options.axis.y,options.axis.z );
  if(this.axis.length)
  {
    this.axis.normalize();
  }

  this.name = options.name;

  // add the active joint
  this.add(this.activeJoint);

  // set the initial pose
  this.updatePose(this.origin);

};
ROS3D.RtJointNode.prototype.__proto__ = THREE.Object3D.prototype;

/**
 * Set the pose of the associated model.
 *
 * @param pose - the pose to update with
 */
ROS3D.RtJointNode.prototype.updatePose = function(pose) {
  this.position.x = pose.position.x;
  this.position.y = pose.position.y;
  this.position.z = pose.position.z;
  this.quaternion = new THREE.Quaternion(pose.orientation.x, pose.orientation.y,
    pose.orientation.z, pose.orientation.w);
  this.updateMatrixWorld(true);
};

ROS3D.RtJointNode.prototype.addLink = function(linkNode)
{
  this.activeJoint.add(linkNode);
};

ROS3D.RtJointNode.prototype.addChildJoint = function(jointNode)
{
  this.activeJoint.add(jointNode);
};

ROS3D.RtJointNode.prototype.updateJoint = function(ang)
{
  if(this.axis.length() === 1)
  {
    this.activeJoint.quaternion.setFromAxisAngle(this.axis, ang);
  }
};