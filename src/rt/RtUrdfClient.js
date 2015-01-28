/**
 * Created by bblumberg on 1/28/15.
 */
/**
 * A URDF client can be used to load a URDF and its associated models into a 3D object from the ROS
 * parameter server.
 *
 * Emits the following events:
 *
 * * 'change' - emited after the URDF and its meshes have been loaded into the root object
 *
 * @constructor
 * @param options - object with following keys:
 *
 *   * ros - the ROSLIB.Ros connection handle
 *   * param (optional) - the paramter to load the URDF from, like 'robot_description'
 *   * path (optional) - the base path to the associated Collada models that will be loaded
 *   * rootObject (optional) - the root object to add this marker to
  *   * loader (optional) - the Collada loader to use (e.g., an instance of ROS3D.COLLADA_LOADER
 *                         ROS3D.COLLADA_LOADER_2) -- defaults to ROS3D.COLLADA_LOADER_2
 */
ROS3D.RtUrdfClient = function(options) {
  var that = this;
  options = options || {};
  var ros = options.ros;
  var param = options.param || 'robot_description';
  this.path = options.path || '/';
  this.rootObject = options.rootObject || new THREE.Object3D();
  var loader = options.loader || ROS3D.COLLADA_LOADER_2;

  // get the URDF value from ROS
  var getParam = new ROSLIB.Param({
    ros : ros,
    name : param
  });
  getParam.get(function(string) {
    // hand off the XML string to the URDF model
    var urdfModel = new ROSLIB.UrdfModel({
      string : string
    });

    that.rtUrdf = new ROS3D.RtUrdf({
      urdfModel : urdfModel,
      path : that.path,
      loader : loader
    });

    // load all models
    that.rootObject.add(that.rtUrdf);
  });
};

ROS3D.RtUrdfClient.prototype.initializeJointStateListener = function(ros)
{
  this.listener = new ROSLIB.Topic({
    ros : ros,
    name : '/robot/joint_states',
    messageType : 'sensor_msgs/JointState',
    throttle_rate: 30,
    queue_size: 1
  });

  this.listener.subscribe(function(message)
  {
//    var msgJson = JSON.stringify(message, null, ' ');
//    console.log('Received message on ' + this.listener.name + ': ' + msgJson);
    for(var j = 0; j < message.name.length; ++j)
    {
      this.rtUrdf.robot.joints[message.name[j]].updateJoint(message.position[j]);
    }

  }.bind(this));
};