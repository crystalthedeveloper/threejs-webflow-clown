import * as THREE from 'three';

let scene, camera, renderer, controls, clown, mixer, clock, isWalking = false;
const animations = {};
const cameraFollowOffset = new THREE.Vector3(0, 1, 5);

function init() {
    // Get the container div from the DOM
    const container = document.getElementById('threejs-container');

    // Set up the renderer and append it to the container div
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

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
    import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
        const loader = new GLTFLoader();
        import('three/examples/jsm/loaders/DRACOLoader.js').then(({ DRACOLoader }) => {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
            loader.setDRACOLoader(dracoLoader);

            loader.load('/public/clownV.glb', (gltf) => {
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
                    console.log(`Loaded animation: ${animationName}`);
                });

                playAnimation('idle'); // Ensure the first animation starts after loading the model
                scene.add(clown);
                controls.target.set(0, 1.5, 0);
                controls.update();
            });
        });
    });

    // Load OrbitControls lazily
    import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.minDistance = 4;
        controls.maxDistance = 20;
        controls.maxPolarAngle = Math.PI / 2;
    });

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
    console.log(`Trying to play animation: ${name}`);
    mixer.stopAllAction();
    if (animations[name]) {
        console.log(`Playing animation: ${name}`);
        animations[name].play();
        isWalking = name === 'walk';
    } else if (name !== 'idle') { // Avoid recursion for 'idle'
        console.log(`Animation '${name}' not found, playing 'idle' instead.`);
        playAnimation('idle');
    } else {
        console.log(`'idle' animation not found.`);
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    if (isWalking && clown) cameraFollow(clown);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('threejs-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
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

                // Check if the section ID exists and play the corresponding animation
                switch (sectionId) {
                    case 'hello':
                        console.log('Playing animation: hello');
                        playAnimation('hello');
                        break;
                    case 'giveaway':
                        console.log('Playing animation: break');
                        playAnimation('break');
                        break;
                    case 'capabilities':
                        console.log('Playing animation: pose');
                        playAnimation('pose');
                        break;
                    case 'store':
                        console.log('Playing animation: walk');
                        playAnimation('walk');
                        break;
                    case 'thanks':
                        console.log('Playing animation: thanks');
                        playAnimation('thanks');
                        break;
                    case 'contactForm':
                        console.log('Playing animation: phone');
                        playAnimation('phone');
                        break;
                    default:
                        console.log(`No animation for section: ${sectionId}`);
                }
            } else {
                console.log(`Section ${entry.target.id} is not visible`);
            }
        });
    });

    sections.forEach(section => {
        console.log(`Adding observer to section with ID: ${section.id}`);
        observer.observe(section);
    });
});