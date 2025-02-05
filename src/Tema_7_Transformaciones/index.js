import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import SceneComponent from "../Babylon_components/SceneComponent";
import { showWorldAxis, showLocalAxes } from "./Axes"


const onSceneReady = (e = { engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement }) => {

  const { canvas, scene, engine } = e;
  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  //const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(2, 3, 4), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  //camera.setPosition(new BABYLON.Vector3(10, 3, -10))

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  var ground = new BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene)

  var groundMaterial = new MATERIALS.GridMaterial("groundmaterial", scene)
  groundMaterial.majorUnitFrequency = 5;
  groundMaterial.minorUnitVisibility = 0.45;
  groundMaterial.gridRatio = 1;
  groundMaterial.backFaceCulling = false;
  groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
  groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
  groundMaterial.opacity = 0.9;

  ground.material = groundMaterial;



  /************Start Pilot*********************************/

  var body = BABYLON.MeshBuilder.CreateCylinder("body", { height: 0.75, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 6, subdivisions: 1 }, scene);
  var arm = BABYLON.MeshBuilder.CreateBox("arm", { height: 0.75, width: 0.3, depth: 0.1875 }, scene);
  arm.position.x = 0.125;

  var pilot_with_WORLD_translate = BABYLON.Mesh.MergeMeshes([body, arm], true);

  var pilot_with_LOCAL_translate = pilot_with_WORLD_translate.createInstance("pilot local");

  /*Create world and local axes */


  showWorldAxis(8, scene)

  var localOrigin_1 = showLocalAxes(2, scene);
  localOrigin_1.parent = pilot_with_WORLD_translate;
  pilot_with_WORLD_translate.rotation.y = Degrees_to_radians(120);


  var localOrigin_2 = showLocalAxes(2, scene);
  localOrigin_2.parent = pilot_with_LOCAL_translate;
  pilot_with_LOCAL_translate.rotation.y = Degrees_to_radians(120);


  var direction_traslation_vector = new BABYLON.Vector3(0, 0, 4);
  direction_traslation_vector.normalize();
  var distance_per_render = 0.01;
  var i = 0;


  var unit_per_secs = 1
  var distance_final = 10


  scene.onBeforeRenderObservable.add(() => {

    const deltaTimeInMillis = scene.getEngine().getDeltaTime();
    const deltaTimeInsecs = (scene.getEngine().getDeltaTime()) / 1000;

    //if (i++ < 500) pilot_with_WORLD_translate.translate(direction_traslation_vector, distance_per_render*deltaTimeInMillis, BABYLON.Space.WORLD); //eje Z azul del mundo
    //if (i++ < 500) pilot_with_LOCAL_translate.translate(direction_traslation_vector, distance_per_render*deltaTimeInMillis, BABYLON.Space.LOCAL); //eje z azul del pilot

    i = i + unit_per_secs * deltaTimeInsecs;
    if (i <= distance_final) pilot_with_WORLD_translate.translate(direction_traslation_vector, unit_per_secs * deltaTimeInsecs, BABYLON.Space.WORLD);

    ; //eje Z azul del mundo
    if (i <= distance_final) pilot_with_LOCAL_translate.translate(direction_traslation_vector, unit_per_secs * deltaTimeInsecs, BABYLON.Space.LOCAL); //eje z azul del pilot


  });



  /*Examples using boxes  */

  var faceColors = [];
  faceColors[0] = BABYLON.Color3.Blue();
  faceColors[1] = BABYLON.Color3.Red();
  faceColors[2] = BABYLON.Color3.Green();
  faceColors[3] = BABYLON.Color3.White();
  faceColors[4] = BABYLON.Color3.Yellow();
  faceColors[5] = BABYLON.Color3.Black();

  var options = {
    width: 0.7,
    height: 0.7,
    depth: 0.7,
    faceColors: faceColors
  };

  var mainbox = BABYLON.MeshBuilder.CreateBox("mainbox", options, scene, true);
  //Adding local axes for main box
  var localOriginBox = showLocalAxes(2, scene);
  localOriginBox.parent = mainbox;


  /**
   * funcion para convertir grados a radianes
   * @param {*} degrees 
   * @returns un mumero en radianes
   */
  function Degrees_to_radians(degrees) {

    var result_radians = degrees * (Math.PI / 180)

    return result_radians
  }


  var rot_x = Math.PI / 128;
  var rot_y = 0;
  var rot_z = 0;

  var rot_count = 0; // for oscillation (rotation)
  var rot_temp;

  var a = 0; // for oscillation (translation)

  scene.onBeforeRenderObservable.add(() => {

    if (rot_count == 128) {
      rot_count = 0;
      rot_temp = rot_z;
      rot_z = rot_y;
      rot_y = rot_x;
      rot_x = rot_temp;
    }
    mainbox.addRotation(rot_x, rot_y, rot_z); // for adding rotation
    rot_count++;

    a += 0.005;
    var sign = Math.cos(a) / Math.abs(Math.cos(a)); //signoidal function for movement
    //mainbox.locallyTranslate(new BABYLON.Vector3(0.02 * sign, 0, 0.02 * sign));

  });



  //Using Transformation Nodes for easing mesh trasformations.

  //create sphere to indicate position of Center of Transformation
  var node_sphere = BABYLON.MeshBuilder.CreateSphere("Sphere", { diameter: 0.1 }, scene, true);
  node_sphere.material = new BABYLON.StandardMaterial("mat", scene);
  node_sphere.material.diffuseColor = new BABYLON.Color3(1, 0, 1);

  // create axes for frame of reference of Center of Transformation
  var CoTAxis = showLocalAxes(2, scene);
  var CoT_2Axis = showLocalAxes(2, scene);
  var CoT_3Axis = showLocalAxes(1, scene);


  //create a Center of Transformation
  var CoT = new BABYLON.TransformNode("root", scene);
  var CoT_2 = new BABYLON.TransformNode("secondary", scene);
  var CoT_3 = new BABYLON.TransformNode("tertiary");

  //now parenting other elements
  node_sphere.parent = CoT;
  CoTAxis.parent = CoT;
  CoT.rotation.y = Math.PI / 4;
  CoT.position = new BABYLON.Vector3(5, 0, 5);

  CoT_2Axis.parent = CoT_2;
  CoT_2.parent = CoT;
  CoT_2.position.z = 4;

  CoT_3Axis.parent = CoT_3;
  CoT_3.parent = CoT_2;
  CoT_3.position.z = 2;


  //create box 
  var faceColors = [];
  faceColors[0] = BABYLON.Color3.Blue();
  faceColors[1] = BABYLON.Color3.Red();
  faceColors[2] = BABYLON.Color3.Green();
  faceColors[3] = BABYLON.Color3.White();
  faceColors[4] = BABYLON.Color3.Yellow();
  faceColors[5] = BABYLON.Color3.Black();

  var options = {
    faceColors: faceColors
  };


  var rotating_box = BABYLON.MeshBuilder.CreateBox("Box", options, scene, true);


  var rotating_box_mini = BABYLON.MeshBuilder.CreateBox("minibox", options, scene);
  rotating_box_mini.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);


  //Animation
  var angle_CoT = 0;
  var angle_CoT2 = 0;
  var angle_CoT3 = 0;

  var angle_box = 0;
  var angle_mini_box = 0;


  const Cot_angle_per_secs = Degrees_to_radians(15);
  const Cot2_angle_per_secs = Degrees_to_radians(30);
  const Cot3_angle_per_secs = Degrees_to_radians(0);

  const rotating_box_angle_per_secs = Degrees_to_radians(360)
  const mini_box_angle_per_secs = Degrees_to_radians(180);

  //rotating_box.parent = CoT_2;
  rotating_box.visibility=0.3


  scene.onBeforeRenderObservable.add(() => {

    var deltaTimeInsecs = (scene.getEngine().getDeltaTime()) / 1000;

    CoT.rotation.y = angle_CoT;
    CoT_2.rotation.y = angle_CoT2;
    CoT_3.rotation.y = angle_CoT3;

    rotating_box.position = CoT_2.absolutePosition;
    rotating_box.rotation.y = angle_box;
    rotating_box_mini.position = CoT_3.absolutePosition;
    rotating_box_mini.rotation.y = angle_mini_box;


    angle_CoT += Cot_angle_per_secs * deltaTimeInsecs;
    angle_CoT2 += Cot2_angle_per_secs * deltaTimeInsecs;
    angle_CoT3 += Cot3_angle_per_secs * deltaTimeInsecs;


    angle_box += rotating_box_angle_per_secs * deltaTimeInsecs;
    angle_mini_box += mini_box_angle_per_secs * deltaTimeInsecs;


  })



  //create two boxes that follow a path
  var box_follower1 = BABYLON.MeshBuilder.CreateBox("box_follower1", options, scene, true);
  box_follower1.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
  var box_follower2 = box_follower1.clone("box_follower2")

  // Create array of points to create a circle path (using CreateLines)

  var circle_points = [];
  var n = 500; // number of points
  var r = 10; //radius
  for (var total = 0; total < n; total++) {
    circle_points.push(new BABYLON.Vector3(
      0 + r * Math.cos(total * Math.PI * 2 / n),
      0,
      r * Math.sin(total * Math.PI * 2 / n)
    ));
  }

  circle_points.push(circle_points[0]); // push to close path
  var circle = BABYLON.MeshBuilder.CreateLines("circle", { points: circle_points }, scene);

  box_follower1.parent = circle;

  //create array of points to create a elliptical path (using CreateLines)

  var a = 2.5; // Z width
  var b = 5; // X width
  var totalPoints = 400; //number of points
  var ellipse_points = [];
  var deltaTheta = Math.PI / totalPoints;

  for (var theta = 0; theta < 2 * Math.PI; theta += deltaTheta) {
    ellipse_points.push(new BABYLON.Vector3(b * Math.sin(theta), 0, a * Math.cos(theta)));
  }

  var ellipse = BABYLON.MeshBuilder.CreateLines("ellipse", { points: ellipse_points }, scene);
  ellipse.color = BABYLON.Color3.Red();
  

  box_follower2.parent = ellipse;

  ellipse.position = new BABYLON.Vector3(15, 3, 10)

  var box_follower1_movement = 0;
  var box_follower2_movement = 0;

  var box_follower_rotation = 0
  var rotation_per_sec = Degrees_to_radians(180);

  scene.onBeforeRenderObservable.add(() => {

    var deltaTimeInsecs = (scene.getEngine().getDeltaTime()) / 1000;


    box_follower1.position.x = circle_points[box_follower1_movement].x
    box_follower1.position.z = circle_points[box_follower1_movement].z

    box_follower1_movement = (box_follower1_movement + 1) % (circle_points.length - 1)

  
    box_follower2.position.x = ellipse_points[box_follower2_movement].x
    box_follower2.position.z = ellipse_points[box_follower2_movement].z

    box_follower2_movement = (box_follower2_movement + 1) % (ellipse_points.length - 1)


    box_follower1.rotation.y = box_follower_rotation;
    box_follower2.rotation.y = box_follower_rotation;
    box_follower_rotation += rotation_per_sec * deltaTimeInsecs;


  })


  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
    }
  });



};


function Scene() {
  return (
    <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
  );
}

export default Scene;
