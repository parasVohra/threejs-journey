import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Debug
const gui = new GUI();
const params = {
    color: 0xff0000,
    spin: () => {
        gsap.to(mesh.rotation, { y: mesh.rotation.y + 8, duration: 2 });
    },
};

// Texture
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const doorTexture = textureLoader.load("/textures/door.jpg");
const alphaTexture = textureLoader.load("/textures/alpha.jpg");
const heightTexture = textureLoader.load("/textures/height.jpg");
const normalTexture = textureLoader.load("/textures/normal.jpg");
const metalnessTexture = textureLoader.load("/textures/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/roughness.jpg");
const ambientOcclusionTexture = textureLoader.load(
    "/textures/ambientOcclusion.jpg"
);

// Cursor
const cursor = {
    x: 0,
    y: 0,
};
window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: ambientOcclusionTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Debug
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
gui.add(mesh, "visible");
gui.add(material, "wireframe");
gui.addColor(params, "color").onChange(() => {
    material.color.set(params.color);
});
gui.add(params, "spin");

// Scale
mesh.scale.x = 2;

// Axes helper
const axeshelper = new THREE.AxesHelper();
//scene.add(axeshelper);

// Rotation
mesh.rotation.y = 0.5;

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen
window.addEventListener("dblclick", () => {
    const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    1,
    1000
);
camera.position.z = 5;
scene.add(camera);

camera.lookAt(mesh.position);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// Clock
//const clock = new THREE.Clock();

// Animations
const tick = () => {
    // Clock
    //const elapsedTime = clock.getElapsedTime();

    //update object
    //mesh.position.x = Math.sin(elapsedTime);
    //mesh.position.y = Math.cos(elapsedTime);

    // update camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(mesh.position);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};
tick();
