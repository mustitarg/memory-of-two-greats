const scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(170,170,170)');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

const container = document.getElementById('scene');
container.appendChild(renderer.domElement);

const aljawahri = document.getElementById("jawahri");
const drwish = document.getElementById("drwish");

const divWidth = container.offsetWidth;
const divHeight = container.offsetHeight;
scene.width = divWidth;
scene.height = divHeight;
renderer.setSize(divWidth, divHeight);

const camera = new THREE.PerspectiveCamera(75, divWidth / divHeight, 0.1, 1000);
camera.position.set(-0.8,0.8,1);

window.addEventListener('resize', () => {  
  const divWidth = container.offsetWidth;
  const divHeight = container.offsetHeight;
  renderer.setSize(divWidth, divHeight);
  camera.aspect = divWidth / divHeight;
  camera.updateProjectionMatrix();
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.maxPolarAngle = Math.PI/1.9;
controls.rotateSpeed = 0.7;
controls.enableDamping = true;
controls.dampingFactor = 0.09; 
controls.target.set(0, 1, 0);
controls.maxDistance = 5;

const cubeGeo = new THREE.BoxGeometry(5, 3.5, 0.1);
const cubeMat = new THREE.MeshPhongMaterial({color: 'rgb(255, 255, 255)', shininess: 150});
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.position.set(0, 4, -5);
scene.add(cube);
cube.castShadow = true;

const screengeo = new THREE.PlaneGeometry(0.41,0.261);
const screenmat = new THREE.MeshBasicMaterial({color:'#fff'});
screen = new THREE.Mesh(screengeo,screenmat);
scene.add(screen);
screen.position.set(0.17,0.92,0.11);
screen.rotation.set(0,-Math.PI/1.16,0);

let currentVideo;
let currentScreen = screen;
let currentTexture = null;
let anotherCube = null;

const video = document.createElement("video");
const video2 = document.createElement("video");

aljawahri.addEventListener("click", () => {
  if (currentVideo && currentVideo.src.endsWith("jawahri.mp4")) {
    return;
  }
  
  if (currentVideo) {
    currentVideo.pause();
    currentVideo.currentTime = 0;
  }
  
  if (currentScreen) {
    scene.remove(currentScreen);
  }


  video.src = "./assets/sources/videos/jawahri.mp4";
  video.autoplay = true;
  video.loop = false;

  const videoTexture = new THREE.VideoTexture(video);
  const screenmat = new THREE.MeshBasicMaterial({ map: videoTexture });
  const screen = new THREE.Mesh(screengeo, screenmat);
  screen.position.set(0.17,0.92,0.11);
  screen.rotation.set(0,-Math.PI/1.16,0);
  scene.add(screen);
  
  const newTexture = new THREE.VideoTexture(video);
  const newMaterial = new THREE.MeshBasicMaterial({ map: newTexture });
  if (anotherCube) {
    anotherCube.material = newMaterial;
  }
  
  currentVideo = video;
  currentScreen = screen;
  currentTexture = videoTexture;
});

drwish.addEventListener("click", () => {
  if (currentVideo && currentVideo.src.endsWith("drwish.mp4")) {
    return;
  }
  
  if (currentVideo) {
    currentVideo.pause();
    currentVideo.currentTime = 0;
  }
  

  video2.src = "./assets/sources/videos/drwish.mp4";
  video2.autoplay = true;
  video2.loop = false;

  const videoTexture = new THREE.VideoTexture(video2);
  const screenmat = new THREE.MeshBasicMaterial({ map: videoTexture });
  currentScreen.material = screenmat;
  
  const newTexture = new THREE.VideoTexture(video2);
  const newMaterial = new THREE.MeshBasicMaterial({ map: newTexture });
  if (anotherCube) {
    anotherCube.material = newMaterial;
  }
  
  currentVideo = video2;
  currentTexture = videoTexture;
});

anotherCube = cube;

const enviornmentGeo = new THREE.BoxGeometry(10,10,10);
const enviornmentMat = new THREE.MeshPhongMaterial({color: 'rgb(36, 16, 54)', side: THREE.DoubleSide, shininess: 50});
enivornment = new THREE.Mesh(enviornmentGeo, enviornmentMat);
enivornment.position.set(0,5,0);
scene.add(enivornment);
enivornment.receiveShadow = true;
function loadModel(modelPath, position, rotation) {
  const loader = new THREE.GLTFLoader();
  const progressBar = document.querySelector('#loading-bar-progress');
  const progressMain = document.getElementById('loading-bar');
  const overlay = document.querySelector('.overlay');
  let loadedObjects = 0;
  let totalObjects = 1;

  progressBar.style.width = '0%';

  loader.load(modelPath, function(gltf) {
    addShadowProperties(gltf.scene);
    gltf.scene.castShadow = true;
    gltf.scene.position.copy(position);
    gltf.scene.rotation.copy(rotation);
    scene.add(gltf.scene);

    loadedObjects++;

    if (loadedObjects === totalObjects) {
      setTimeout(() => {
        overlay.style.display = 'none';
        progressMain.style.display = 'none';
      }, 2000);
    }
  }, function (xhr) {
    const progress = (xhr.loaded / xhr.total) * 100;
    progressBar.style.width = progress + '%';
  });
  function addShadowProperties(obj) {
    obj.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
}
loadModel('./assets/sources/models/booksPadHolderClips.glb', new THREE.Vector3(0, 0, 0), new THREE.Euler(0,0, 0));
loadModel('./assets/sources/models/chairLampBin.glb', new THREE.Vector3(0, 0, 0), new THREE.Euler(0,0, 0));
loadModel('./assets/sources/models/table.glb', new THREE.Vector3(0, 0, 0), new THREE.Euler(0,0, 0));
loadModel('./assets/sources/models/laptop.glb', new THREE.Vector3(0, 0, 0), new THREE.Euler(0,0, 0));
loadModel('./assets/sources/models/origamyOBook.glb', new THREE.Vector3(0, 0, 0), new THREE.Euler(0,0, 0));

const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
  const textGeometry = new THREE.TextGeometry("Mustafa Saad's Project", {
    font: font,
    size: 0.2,
    height: 0.01,
    curveSegments: 12,
    bevelEnabled: false,
  });
  const textMaterial = new THREE.MeshPhongMaterial({color:"#f2f2f2", shininess:150});
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(-4.95,3,0.5);
  textMesh.rotation.y = Math.PI/2
  textMesh.castShadow = true;
  textMesh.receiveShadow = true;
  scene.add(textMesh);
});


const screenLight = new THREE.SpotLight({color: '#fff'}, 0.6);
screenLight.position.set(0.17,0.92,0.05);
screenLight.distance = 1;
screenLight.angle = Math.PI/2.5;
screenLight.castShadow = true;
scene.add(screenLight);

const screenLightTarget = new THREE.Object3D();
scene.add(screenLightTarget);
screenLightTarget.position.set(0,0.7,-0.3)
screenLight.target = screenLightTarget;

const environmentLight = new THREE.PointLight( '#fff', 0 );
environmentLight.position.set(3,6,3);
scene.add( environmentLight );
environmentLight.castShadow = true;
environmentLight.shadow.mapSize.width = 2048;
environmentLight.shadow.mapSize.height = 2048;

const lampLight = new THREE.SpotLight( 'rgb(255,255,255)', 5 );
lampLight.position.set(1.2,1.2,0.35);
scene.add( lampLight );
lampLight.castShadow = true;
lampLight.shadow.mapSize.width = 2048;
lampLight.shadow.mapSize.height = 2048;
lampLight.distance = 9;
lampLight.angle = Math.PI/4;
lampLight.decay = 3;

const lampLightTarget = new THREE.Object3D();
scene.add(lampLightTarget);
lampLightTarget.position.set(-1,1.2,-0.1);
lampLight.target = lampLightTarget;

var clicks = 0;
var button = document.getElementById('turn-btn');
var tween = null;

button.addEventListener('click', function() {
  clicks++;
  if (tween !== null) {
    tween.stop();
  }
  if (clicks === 1) {
      tween = new TWEEN.Tween(environmentLight)
          .to({ intensity: 0.5 }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
      button.textContent = "أغلق الانوار";
  } else {
    tween = new TWEEN.Tween(environmentLight)
        .to({ intensity: 0 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    button.textContent = "إفتح الانوار";
    clicks = 0;
  }
});


function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();  
    renderer.render(scene, camera);
  }
  

animate();



