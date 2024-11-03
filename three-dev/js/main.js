import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

let container, camera, scene, renderer, cube, torusKnot, cylinder, controls;

init();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
  });

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const torusKnotGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
  const torusKnotMaterial = new THREE.MeshPhongMaterial({
    color: 0xffff00,
  });

  torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
  scene.add(torusKnot);

  const cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32);
  const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff });

  cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  scene.add(cylinder);

  camera.position.set(2, 2, 2);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  camera.lookAt(axesHelper.position);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);

  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  cube.position.set(0, 3, 0);
  torusKnot.position.set(3, 0, 0);
  cylinder.position.set(-3, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.screenSpacePanning = false;

  controls.minDistance = 1;
  controls.maxDistance = 8;

  loadmodels();
}

function loadmodels() {
  new RGBELoader()
    .setPath("/hdri/")
    .load("goegap_road_1k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      const loader = new GLTFLoader().setPath("/suzanne/");
      loader.load("eka.gltf", async function (gltf) {
        const model = gltf.scene;

        await renderer.compileAsync(model, camera, scene);

        scene.add(model);
      });

      const loader2 = new GLTFLoader().setPath("/barrel/");
      loader2.load("tynnyri.glb", async function (gltf) {
        const model2 = gltf.scene;

        await renderer.compileAsync(model2, camera, scene);

        scene.add(model2);
      });

      const loader3 = new GLTFLoader().setPath("/shoe/");
      loader3.load("kenka.gltf", async function (gltf) {
        const model3 = gltf.scene;

        await renderer.compileAsync(model3, camera, scene);

        scene.add(model3);
      });
    });
}

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  torusKnot.rotation.x += 0.02;
  torusKnot.rotation.y += 0.02;

  cylinder.rotation.x += 0.04;
  cylinder.rotation.y += 0.04;

  controls.update();

  renderer.render(scene, camera);
}

window.addEventListener("resize", resize, false);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
