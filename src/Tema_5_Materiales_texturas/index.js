import * as BABYLON from "babylonjs";
import SceneComponent from "../Babylon_components/SceneComponent";
import * as Materials_Module from "../Tema_5_Materiales_texturas/Materials_Module"

import fire from "../Tema_5_Materiales_texturas/fire.png"
import water from "../Tema_5_Materiales_texturas/water.jpg"
import grass from "../Tema_5_Materiales_texturas/grass.jpg"

import earth from "../Tema_5_Materiales_texturas/solar_system_textures/2k_earth_daymap.jpg"
import sun from "../Tema_5_Materiales_texturas/solar_system_textures/2k_sun.jpg"

import * as Lights_Module from "../Tema_4_Iluminacion/Lights_Module"
const onSceneReady = (e = { engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement }) => {

  const { canvas, scene, engine } = e;
  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  //const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  //light.intensity = 0.7;

  //scene.ambientColor = new BABYLON.Color3(1,1,1);
  //light.diffuse = new BABYLON.Color3(1, 1, 1);
	//light.specular = new BABYLON.Color3(0, 1, 0);
	//ight.groundColor = new BABYLON.Color3(0, 0, 0);


 
  var sun_light =  Lights_Module.PointLight(scene);




  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  sphere.position = new BABYLON.Vector3(3, 1, 0);

  sun_light.position = sphere.position;
  sun_light.intensity=10;

  var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position.y = 1;

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);

  var box_material = Materials_Module.MaterialRandom(scene);
  box.material = box_material;

  //var sphere_material = Materials_Module.MaterialFromRGB_Hex("sphere_mat", { diffuseColor_hex: "#0000ff" }, scene)
  var sphere_material = Materials_Module.MaterialFromTexture("sphere_mat", { diffuseTexture:sun,emisissiveTexture:sun }, scene)
  sphere.material = sphere_material;
  sphere.rotation.z = Math.PI


  var ground_material = Materials_Module.MaterialFromTexture("ground_mat", { diffuseTexture: grass }, scene)
  ground_material.diffuseTexture.uScale = 10;
  ground_material.diffuseTexture.vScale = 10;
  ground.material = ground_material;
  

  //box_material.wireframe=true;
  //sphere_material.alpha=0.5;


  scene.onBeforeRenderObservable.add(() => {
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 30
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }

  });


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
