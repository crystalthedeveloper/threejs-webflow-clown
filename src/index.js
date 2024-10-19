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
    // Instead of appending to body, append to the container div
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

            loader.load('/clownV.glb', (gltf) => {
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
                    animations[clip.name.toLowerCase()] = mixer.clipAction(clip);
                });

                playAnimation('idle');
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
    mixer.stopAllAction();
    if (animations[name]) {
        animations[name].play();
        isWalking = name === 'walk';
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
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                switch (sectionId) {
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
                        console.log(`No animation for section: ${sectionId}`);
                }
            }
        });
    });

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));
});