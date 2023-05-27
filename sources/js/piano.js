

const scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(50,50,50)');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

const container = document.getElementById('canvas');
container.appendChild(renderer.domElement);

const divWidth = container.offsetWidth;
const divHeight = container.offsetHeight;
scene.width = divWidth;
scene.height = divHeight;
renderer.setSize(divWidth, divHeight);

const camera = new THREE.PerspectiveCamera(75, divWidth / divHeight, 0.1, 1000);
camera.position.set(0,3,0);
  

window.addEventListener('resize', () => {  
    const divWidth = container.offsetWidth;
    const divHeight = container.offsetHeight;
    renderer.setSize(divWidth, divHeight);
    camera.aspect = divWidth / divHeight;
    camera.updateProjectionMatrix();
  });
  


const controls = new THREE.OrbitControls(camera, renderer.domElement);

// controls.maxPolarAngle = Math.PI/1.9;
controls.rotateSpeed = 0.7;
controls.enableDamping = true;
controls.dampingFactor = 0.09; 
controls.target.set(0,0,0);
// controls.maxDistance = 5;




const planeGeometry = new THREE.BoxGeometry(7,0.1,4);
const planeMaterial = new THREE.MeshPhongMaterial({shininess: 150});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
// plane.rotation.set(-Math.PI/2,0,0);
plane.position.set(0.275,-0.2,0);

// Load textures
const textureLoader = new THREE.TextureLoader();
const aoTexture = textureLoader.load('sources/textures/ao.jpg');
const diffuseTexture = textureLoader.load('sources/textures/diff.jpg');
// const displacementTexture = textureLoader.load('sources/textures/disp.jpg');
const normalDxTexture = textureLoader.load('sources/textures/dx.jpg');
const normalGlTexture = textureLoader.load('sources/textures/gl.jpg');
const roughTexture = textureLoader.load('sources/textures/ro.jpg');

planeMaterial.map = diffuseTexture;
planeMaterial.aoMap = aoTexture;
// planeMaterial.displacementMap = displacementTexture;
planeMaterial.normalMap = normalDxTexture;
planeMaterial.normalMapType = THREE.TangentSpaceNormalMap;
planeMaterial.bumpMap = normalGlTexture;
planeMaterial.roughnessMap = roughTexture;

planeMaterial.needsUpdate = true;




// sources/textures/ro.jpg



const keysLight = new THREE.MeshPhongMaterial({shininess: 250, color: 'rgb(250,250,250)'});

const textureLoader1 = new THREE.TextureLoader();
const aoTexture1 = textureLoader.load('sources/textures/ao1.jpg');
const diffuseTexture1 = textureLoader.load('sources/textures/diff1.jpg');
// const displacementTexture = textureLoader.load('sources/textures/disp.jpg');
const normalDxTexture1 = textureLoader.load('sources/textures/dx1.jpg');
const normalGlTexture1 = textureLoader.load('sources/textures/gl1.jpg');
const roughTexture1 = textureLoader.load('sources/textures/ro1.jpg');

keysLight.map = diffuseTexture1;
keysLight.aoMap = aoTexture1;
// planeMaterial.displacementMap = displacementTexture;
keysLight.normalMap = normalDxTexture1;
keysLight.normalMapType = THREE.TangentSpaceNormalMap1;
keysLight.bumpMap = normalGlTexture1;
keysLight.roughnessMap = roughTexture1;

keysLight.needsUpdate = true;









const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
directionalLight.position.set(5, 5, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024; 

renderer.shadowMap.enabled = true;



const geometry1 = new THREE.BoxGeometry(0.5, 0.2, 3);
const material1 = new THREE.MeshPhongMaterial({ color: 'rgb(170,170,170)', shininess: 200 });
const material2 = new THREE.MeshPhongMaterial({ color: 'rgb(200,200,200)', shininess: 200 });

const boxes = [];

// Create and position the boxes
[-1.65, -1.1, -0.55, 0, 0.55, 1.1, 1.65, 2.2].forEach((positionX, index) => {
  const box = new THREE.Mesh(geometry1, index % 2 === 0 ? keysLight : material2);
  box.position.x = positionX;
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);
  boxes.push(box);
});








const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', onDocumentClick);

const tweens = [];

const resetFunctions = [];


boxes.forEach((box, index) => {
  const rotationTween = new TWEEN.Tween(box.rotation)
    .to({ x: Math.PI * 0.01 }, 250)
    .easing(TWEEN.Easing.Quartic.InOut)
    .onComplete(resetRotation(index));

  const positionTween = new TWEEN.Tween(box.position)
    .to({ x: boxes[index].position.x, y: -0.05, z: 0 }, 250)
    .easing(TWEEN.Easing.Quartic.InOut)
    .onComplete(resetPosition(index));

  tweens.push({ rotationTween, positionTween });
});

function onDocumentClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    const index = boxes.indexOf(clickedObject);
    if (index !== -1) {
      const audio = new Audio(`./sources/notes/${index + 6}.mp3`);
      audio.play();

      tweens[index].rotationTween.start();
      tweens[index].positionTween.start();
    }
  }
}

function resetRotation(index) {
  return () => {
    new TWEEN.Tween(boxes[index].rotation)
      .to({ x: 0 }, 250)
      .easing(TWEEN.Easing.Quartic.InOut)
      .start();
  };
}

function resetPosition(index) {
  return () => {
    new TWEEN.Tween(boxes[index].position)
      .to({ x: boxes[index].position.x, y: 0, z: 0 }, 250)
      .easing(TWEEN.Easing.Quartic.InOut)
      .start();
  };
}






function resetRotation1(index) {
  return () => {
    new TWEEN.Tween(boxes1[index].rotation)
      .to({ x: 0 }, 250)
      .easing(TWEEN.Easing.Quartic.InOut)
      .start();
  };
}


function resetPosition1(index) {
  return () => {
    new TWEEN.Tween(boxes1[index].position)
      .to({ x: boxes1[index].position.x, y: 0.2, z: -0.75 }, 250)
      .easing(TWEEN.Easing.Quartic.InOut)
      .start();
  };
}











const geometry3 = new THREE.BoxGeometry(0.3, 0.2, 1.5);
const material3 = new THREE.MeshPhongMaterial({ color: 'rgb(40,40,40)', shininess: 200 });
const material4 = new THREE.MeshPhongMaterial({ color: 'rgb(40,40,40)', shininess: 200 });

const boxes1 = [];

[-1.375,-0.275,0.275,1.375,1.925].forEach((positionX, index) => {
  const box1 = new THREE.Mesh(geometry3, index % 2 === 0 ? material3 : material4);
  box1.position.set(positionX, 0.2, -0.75);
  box1.castShadow = true;
  box1.receiveShadow = true;
  scene.add(box1);
  boxes1.push(box1);

  // Set initial position and rotation values

  // Function to handle click on a box
  function handleClick() {
    // Animate the box's position and rotation
    const targetPosition = new THREE.Vector3(positionX, 0.1 ,-0.75);

    const tween = new TWEEN.Tween(box1.position)
      .to(targetPosition, 250) // Animation duration: 2.5 seconds
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(resetPosition1(index))

      .start();

    const rotationTween = new TWEEN.Tween(box1.rotation)
     .to({ x: Math.PI * 0.03 }, 250)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(resetRotation1(index))
      .start();
    }

  // Add event listener to the canvas
  renderer.domElement.addEventListener('mousedown', (event) => {
    // Calculate mouse coordinates in normalized device coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Create a raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Check for intersection with the box
    const intersects = raycaster.intersectObject(box1);

    // If the box was clicked, call the handleClick function
    if (intersects.length > 0) {
      handleClick();
      if (index !== -1) {
        const audio = new Audio(`./sources/notes/${index + 50}.mp3`);
        audio.play();}
    }
  });
});












































function animate() {
  requestAnimationFrame(animate);
  controls.update();  
  renderer.render(scene, camera);
  TWEEN.update()
    
}
  

animate();
