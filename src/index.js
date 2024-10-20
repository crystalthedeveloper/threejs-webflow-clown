// Three.js Initialization and Rendering Code
let scene, camera, renderer, controls, clown, mixer, clock, isWalking = false;
const animations = {};
const cameraFollowOffset = new THREE.Vector3(0, 1, 5);
let currentAnimation = null;

function init() {
    console.log('Initializing Three.js scene...');

    // Get the container element
    const container = document.getElementById('threejs-container');
    console.log('Container element:', container);

    if (!container) {
        console.error('Error: Container with ID "threejs-container" not found!');
        return; // Stop execution if the container is not found
    }

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: false });
    console.log('Renderer created.');
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -1, 5);
    console.log('Camera setup complete.');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000);
    console.log('Scene created.');

    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(2000, 0.1, 2000),
        new THREE.MeshStandardMaterial({ color: 0x1f2022, roughness: 0.8, metalness: 0.8 })
    );
    floor.receiveShadow = true;
    scene.add(floor);
    console.log('Floor added to scene.');

    clock = new THREE.Clock();
    console.log('Clock initialized.');

    // Load the clown model lazily
    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);
    console.log('GLTFLoader and DRACOLoader set up.');

    loader.load('https://threejs-webflow-clown.vercel.app/public/clownV.glb', (gltf) => {
        clown = gltf.scene;
        clown.position.set(0, 0.02, 0);
        clown.scale.set(1.5, 1.5, 1.5);
        console.log('Clown model loaded.');

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
            console.log(`Loaded animation: ${animationName}`);
        });

        playAnimation('idle');
        scene.add(clown);
        controls.target.set(0, 1.5, 0);
        controls.update();
    });

    // OrbitControls setup
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.minDistance = 4;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2;
    console.log('OrbitControls set up.');

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

    console.log('Lights added to scene.');
    animate();
    window.addEventListener('resize', onWindowResize);
}

function playAnimation(name) {
    if (!mixer || !animations[name]) {
        console.log(`Animation '${name}' is not initialized or found.`);
        return;
    }

    if (currentAnimation === name) {
        return;
    }

    mixer.stopAllAction();
    currentAnimation = name;
    animations[name].reset().play();
    isWalking = name === 'walk';
    console.log(`Playing animation: ${name}`);
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
    console.log('Window resized. Resizing renderer.');

    if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    } else {
        console.error('Container element not found during resize.');
    }
}

init();

// IntersectionObserver to trigger animations based on section scroll
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const sections = document.querySelectorAll('div[id]');
    if (sections.length === 0) {
        console.log('No sections with IDs found.');
    } else {
        console.log(`Found ${sections.length} sections with IDs.`);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log(`Observing section with ID: ${entry.target.id}, isIntersecting: ${entry.isIntersecting}`);
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                console.log(`Section ${sectionId} is visible`);

                switch (sectionId) {
                    case 'hero':
                        playAnimation('idle');
                        break;
                    case 'hello':
                        playAnimation('hello');
                        break;
                    case 'giveaway':
                        playAnimation('break');
                        break;
                    case 'capabilities':
                        playAnimation('pose');
                        break;
                    case 'store':
                        playAnimation('walk');
                        break;
                    case 'thanks':
                        playAnimation('thanks');
                        break;
                    case 'contactForm':
                        playAnimation('phone');
                        break;
                    default:
                        console.log(`No animation found for section: ${sectionId}`);
                }
            }
        });
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});
