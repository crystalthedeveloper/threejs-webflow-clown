// Three.js Initialization and Rendering Code
let scene, camera, renderer, controls, clown, mixer, clock, isWalking = false;
const animations = {};
const cameraFollowOffset = new THREE.Vector3(0, 1, 5);
let currentAnimation = null;
let modelLoaded = false; // Flag to check if the model has been loaded

function init() {
    // Get the container element
    const container = document.getElementById('threejs-container');
    if (!container) return;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -1, 5);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000);

    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(2000, 0.1, 2000),
        new THREE.MeshStandardMaterial({ color: 0x1f2022, roughness: 0.8, metalness: 0.8 })
    );
    floor.receiveShadow = true;
    scene.add(floor);

    clock = new THREE.Clock();

    // Load the clown model lazily
    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    loader.load('https://threejs-webflow-clown.vercel.app/public/clownV.glb', (gltf) => {
        clown = gltf.scene;
        clown.position.set(0, 0.02, 0);
        clown.scale.set(1.5, 1.5, 1.5);

        clown.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                if (child.material && child.material.isMeshStandardMaterial) {
                    child.material.roughness = 0.6;
                    child.material.metalness = 0.2;
                }
            }
        });

        mixer = new THREE.AnimationMixer(clown);
        gltf.animations.forEach((clip) => {
            const animationName = clip.name.toLowerCase();
            animations[animationName] = mixer.clipAction(clip);
        });

        // Mark that the model is loaded
        modelLoaded = true;

        // Start the default animation
        playAnimation('idle');
        scene.add(clown);
        controls.target.set(0, 1.5, 0);
        controls.update();

        // Start observing sections after the model is loaded
        observeSections();
    });

    // OrbitControls setup
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.minDistance = 4;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0);
    directionalLight.position.set(5, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    scene.add(directionalLight);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.8));

    const rectLight = new THREE.RectAreaLight(0xffffff, 2.5, 5, 5);
    rectLight.position.set(0, 5, 10);
    rectLight.rotation.y = Math.PI;
    scene.add(rectLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    animate();
    window.addEventListener('resize', onWindowResize);
}

// Function to follow the clown character with the camera
function cameraFollow(target) {
    const modelPos = target.position;
    camera.position.set(
        modelPos.x + cameraFollowOffset.x,
        modelPos.y + cameraFollowOffset.y,
        modelPos.z + cameraFollowOffset.z
    );
    camera.lookAt(modelPos);
}

function playAnimation(name) {
    if (!mixer || !animations[name]) return;

    if (currentAnimation === name) return;

    mixer.stopAllAction();
    currentAnimation = name;
    animations[name].reset().play();
    isWalking = name === 'walk';
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    if (isWalking && clown) cameraFollow(clown);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('threejs-container');
    if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

// Function to observe sections only after model is loaded
function observeSections() {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && modelLoaded) {
                const sectionId = entry.target.id;

                switch (sectionId) {
                    case 'hero':
                        playAnimation('idle');
                        break;
                    case 'hello':
                        playAnimation('hello');
                        break;
                    case 'dance-wrapper':
                        playAnimation('break');
                        break;
                    case 'capabilities-wrapper':
                        playAnimation('walk');
                        break;
                    case 'services-wrapper':
                        playAnimation('pose');
                        break;
                    case 'testimonials':
                        playAnimation('thanks');
                        break;
                    case 'contactForm':
                        playAnimation('phone');
                        break;
                }
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

init();