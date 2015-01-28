/**
 * Created by bblumberg on 1/28/15.
 */
/**
 * A LinkNode holds the mesh representing a link.
 *
 * @constructor
 * @param options - object with following keys:
 *
 *  * frameID - the frame ID this object belongs to
 *  * pose (optional) - the pose associated with this object
 *  * object - the THREE 3D object to be rendered
 */
ROS3D.RtLinkNode = function(options) {
  options = options || {};
  THREE.Object3D.call(this);

  this.name = options.frameID;
  var object = options.object;
  this.pose = options.pose;

  this.updatePose(this.pose);

  // add the model
  this.add(object);
};
ROS3D.RtLinkNode.prototype.__proto__ = THREE.Object3D.prototype;

ROS3D.RtLinkNode.prototype.updatePose = function(pose) {
  this.position.x = pose.position.x;
  this.position.y = pose.position.y;
  this.position.z = pose.position.z;
  this.quaternion = new THREE.Quaternion(pose.orientation.x, pose.orientation.y,
    pose.orientation.z, pose.orientation.w);
  this.updateMatrixWorld(true);
};