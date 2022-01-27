import React, { useState, useEffect, useRef, Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import styled from 'styled-components';
import { Colours } from '../Components/Global/Global.styles';
import { GLTFLoader } from '../Utility/Loader/GLTFLoader';
import AstronautGLB from '../Assets/Models/Astronaut.glb';
const TestEnvironmentWrapper = styled.div`height: 100vh;`;

/**
 * PortfolioEnvironment.js
 * 
 * This class contains all the logic to generate/render a scene in THREEjs
 *
 */
class PortfolioEnvironment extends Component {
	//Dimensions
	width;
	height;

	scene;
	controls;
	camera;
	renderer;
	animationID;
	mount;
	cube;
    model;
	clock;
	raycaster;
	mouse;

	clickableObjects = [];

	constructor(props) {
		super(props);
		this.state = {
			hasLoaded: false,
			itemsLoaded: 0,
			itemsTotal: 0,
			showOverlay: false,
			pause: false
		};
	}

	/**
     * This is a React Lifecycle method.
     *
     * @memberof CubeEnvironment
     */
	componentDidMount() {
		this.setupScene();
		this.populateScene();
		this.startAnimationLoop();
		this.addEventListeners();
		// window.addEventListener('resize', this.handleWindowResize);
	}

	/**
     * This is a React Lifecycle method.
     *
     * @memberof CubeEnvironment
     */
	componentWillUnmount() {
		this.removeEventListeners();
		window.removeEventListener('resize', this.handleWindowResize);
		window.cancelAnimationFrame(this.animationID);
		this.controls.dispose();
	}

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	setupScene = () => {
		this.scene = new THREE.Scene();
		this.setDimensions();
		this.setupCamera();
		this.setupControls();
		this.setupRenderer();
		this.setupLoadingManager();
		this.setupRayCaster()
		this.setupFog();
		this.mount.appendChild(this.renderer.domElement); // mount using React ref
	};

	/**
	 *
	 *
	 * @memberof PortfolioEnvironment
	 */
	setupFog = () => {
		this.scene.fog = new THREE.FogExp2(new THREE.Color("white"), 0.001);
	}

	/**
     * This function creates the PerspectiveCamera
	 * and settings
     *
     * @memberof CubeEnvironment
     */
	setupCamera = () => {
		this.camera = new THREE.PerspectiveCamera(
			75, // fov = field of view
			this.width / this.height, // aspect ratio
			0.1, // near plane
			1000 // far plane
		);
		this.camera.position.z = 9; // is used here to set some distance from a cube that is located at z = 0
	};

	/**
     * Set width and height using Wrapper client dimensions
     *
     * @memberof CubeEnvironment
     */
	setDimensions = () => {
		this.width = this.mount.clientWidth;
		this.height = this.mount.clientHeight;
	};

	/**
     * OrbitControls allow a camera to orbit around the object
     * https://threejs.org/docs/#examples/controls/OrbitControls
     * @memberof CubeEnvironment
     */
	setupControls = () => {
		// this.setupOrbitControls();
		this.setupFlyControls();
	};

	/**
	 *
	 *
	 * @memberof PortfolioEnvironment
	 */
	setupFlyControls = () => {
        this.controls = new FlyControls(this.camera, this.mount);
		this.controls.dragToLook = true;
		this.controls.movementSpeed = 10;
		this.controls.rollSpeed = 0.1;
		this.controls.update(1);
        this.clock = new THREE.Clock();
	}

	/**
	 *
	 *
	 * @memberof PortfolioEnvironment
	 */
	setupOrbitControls = () => {
		this.controls = new OrbitControls(this.camera, this.mount);
		this.controls.enableKeys = true;
		this.controls.enablePan = true;
        this.clock = new THREE.Clock();
		this.controls.update();
	}

	/**
	 *
     * Instatiate the renderer
	 *
	 * @memberof PortfolioEnvironment
	 */
	setupRayCaster = () => {
		this.raycaster = new THREE.Raycaster();
	};

	/**
     * Instatiate the renderer
     *
     * @memberof CubeEnvironment
     */
	setupRenderer = () => {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(Colours.light_purple);
		this.renderer.setSize(this.width, this.height);
	};

	/**
	 * Instatiate the mouse property
	 *
	 * @memberof PortfolioEnvironment
	 */
	setupMouse = () => {
		this.mouse = new THREE.Vector2();
	}

	/**
	 *
	 *
	 * @memberof PortfolioEnvironment
	 */
	setMouse = event => {
		this.mouse.x = (event.clientX / this.mount.clientWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / this.mount.clientHeight) * 2 + 1;
	};

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	populateScene = () => {
		// this.addCube();
		this.addLights();
		this.addModel(AstronautGLB);
		this.addHelpers();
	};

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	addCube = () => {
		const geometry = new THREE.BoxGeometry(2, 2, 2);
		const material = new THREE.MeshPhongMaterial({
			color: 'rgb(54, 54, 82)',
			emissive: 'rgb(54, 54, 82)',
			side: THREE.DoubleSide,
			flatShading: true
		});
		this.cube = new THREE.Mesh(geometry, material);
		this.cube.position.set(0, 2.5, 0);
		this.scene.add(this.cube);
	};

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	addLights = () => {
		const lights = [];
		lights[0] = new THREE.PointLight(0xffffff, 1, 0);
		lights[1] = new THREE.PointLight(0xffffff, 1, 0);
		lights[2] = new THREE.PointLight(0xffffff, 1, 0);

		lights[0].position.set(0, 200, 0);
		lights[1].position.set(100, 200, 100);
		lights[2].position.set(-100, -200, -100);

		this.scene.add(lights[0]);
		this.scene.add(lights[1]);
		this.scene.add(lights[2]);
	};

	addModel = async (object) => {
		const loader = new GLTFLoader(this.manager);
		let model = new THREE.Object3D();
		// console.log("OBJ", object)

		loader.load(object, (gltf) => {
			model = gltf.scene;
			// mesh.name = name;
			model.position.x = 0;
			model.position.y = 0;
			model.position.z = 0;

			this.clickableObjects.push(model);
			this.scene.add(model);
		});
	};

	addHelpers = () => {
		this.addAxesHelper();
        this.addGridHelper();
        this.addArrowHelper();
	};

	addAxesHelper = () => {
		const axesHelper = new THREE.AxesHelper(5);
		this.scene.add(axesHelper);
	};

	/**
	 * This is helper function to render a grid
	 *
	 * @memberof PortfolioEnvironment
	 */
	addGridHelper = () => {
		const size = 100;
		const divisions = 100;

		const gridHelper = new THREE.GridHelper(size, divisions);
		this.scene.add(gridHelper);
	};

	addArrowHelper = () => {
		const dir = new THREE.Vector3(1, 2, 0);

		//normalize the direction vector (convert to vector of length 1)
		dir.normalize();

		const origin = new THREE.Vector3(0, 0, 0);
		const length = 1;
		const hex = 0xffff00;

		const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
		this.scene.add(arrowHelper);
	};


	// Loading Logic
	
	/**
	 * This is setting up the Loading manager
	 * and assigning onStart, onProgress, onLoad
	 * onError
	 *
	 * @memberof PortfolioEnvironment
	 */
	setupLoadingManager = () => {
		this.manager = new THREE.LoadingManager();
		this.manager.onStart = this.loadStart;
		this.manager.onProgress = this.loadProgressing;
		this.manager.onLoad = this.loadFinished;
		this.manager.onError = this.loadError;
	};

	/**
	 * This function is called once the loading process
	 * has started
	 *
	 * @memberof PortfolioEnvironment
	 */
	loadStart = (url, itemsLoaded, itemsTotal) => {
		this.setState({
			itemsLoaded: itemsLoaded,
			itemsTotal: itemsTotal
		});
	};

	/**
	 * This function is called every time there's an update 
	 * on the loading process
	 *
	 * @memberof PortfolioEnvironment
	 */
	loadProgressing = (url, itemsLoaded, itemsTotal) => {
		this.setState({
			itemsLoaded: itemsLoaded,
			itemsTotal: itemsTotal
		});
	};

	/**
	 * This function is called every time loading is finished
	 *
	 * @memberof PortfolioEnvironment
	 */
	loadFinished = () => {
		this.setState({
			hasLoaded: true
		});
	};

	/**
     * This is the function that is running the environment.
     * The window.requestAnimationFrame() method tells the browser
	 * that you wish to perform an animation and requests that the 
	 * browser calls a specified function to update an animation 
	 * before the next repaint
     * @memberof CubeEnvironment
     */
	startAnimationLoop = () => {
		if (this.cube) {
			this.cube.rotation.x += 0.01;
			this.cube.rotation.y += 0.01;
		}

		// if (this.model) {
		// 	this.model.rotation.x += 0.01;
		// 	this.model.rotation.y += 0.01;
		// }

		// This is required the FlyControls to work
		if(this.clock){
			let delta = this.clock.getDelta();
			this.controls.update( delta );
		}

		
		this.renderer.render(this.scene, this.camera);
		// The window.requestAnimationFrame() method tells the browser that you wish to perform
		// an animation and requests that the browser call a specified function
		// to update an animation before the next repaint
		this.animationID = window.requestAnimationFrame(this.startAnimationLoop);
	};


	// Interactions

	/**
     *
     *
     * @memberof CubeEnvironment
     */

	addEventListeners = () => {
		document.addEventListener("dblclick", this.onDocumentDoubleClick, false);
		window.addEventListener("resize", this.handleWindowResize, false);
	};

	removeEventListeners = () => {
		document.removeEventListener("dblclick", this.onDocumentDoubleClick);
		window.removeEventListener("resize", this.onWindowResize);
	};

	handleWindowResize = () => {
		const width = this.mount.clientWidth;
		const height = this.mount.clientHeight;

		this.renderer.setSize(width, height);
		this.camera.aspect = width / height;

		// Note that after making changes to most of camera properties you have to call
		// .updateProjectionMatrix for the changes to take effect.
		this.camera.updateProjectionMatrix();
	};


	/**
	 * 
	 *
	 * @memberof PortfolioEnvironment
	 */
	onDocumentDoubleClick = event => {
		if (!this.state.pause) {
		  this.setMouse(event);
		  this.raycaster.setFromCamera(this.mouse, this.camera);
		  let intersects = this.raycaster.intersectObjects(this.clickableObjects);
		  if (intersects.length > 0) {
			let mesh = this.intersects[0];
			console.log("MESH")
			// if (mesh.object.callback && mesh.object.model_id && this.canOpen(mesh.object)) {
			//   mesh.object.callback(mesh.object.model_id, mesh.object.model_type);
			// }
		  }
		}
	  };

	/**
     *
     *
     * @returns
     * @memberof CubeEnvironment
     */
	render() {
		return <TestEnvironmentWrapper ref={(ref) => (this.mount = ref)} />;
	}
}

export default PortfolioEnvironment;
