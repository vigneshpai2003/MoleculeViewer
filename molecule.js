import * as THREE from 'three';

import { RoomEnvironment } from '../node_modules/three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

function displayMolecule(canvas, molecule) {
    let camera, scene, renderer;

    init();
    render();
    onWindowResize();

    function init() {
        renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;


        camera = new THREE.PerspectiveCamera(45, 1, 0.25, 40);
        camera.position.set(-3, 10, -10);

        const environment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator(renderer);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x808080);
        scene.environment = pmremGenerator.fromScene(environment).texture;

        // const grid = new THREE.GridHelper(20, 10, 0xffffff, 0xffffff);
        // grid.material.opacity = 0.5;
        // grid.material.depthWrite = false;
        // grid.material.transparent = true;
        // scene.add(grid);

        const loader = new GLTFLoader();
        loader.load(molecule, function (gltf) {
            scene.add(gltf.scene);
            render();
        });

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);
        controls.minDistance = 2;
        controls.maxDistance = 25;
        controls.target.set(0, 0, 0);
        controls.update();

        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        // camera.aspect = window.innerWidth / window.innerHeight;
        // camera.updateProjectionMatrix();

        // renderer.setSize(window.innerWidth, window.innerHeight);

        // render();

        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        if (canvas.width !== width ||canvas.height !== height) {
          // you must pass false here or three.js sadly fights the browser
          renderer.setSize(width, height, false);

          render();
        }
    }

    function render() {
        renderer.render(scene, camera);
    }
}

export {displayMolecule}

