import React, { useState, useEffect, useRef, Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import styled from 'styled-components';
import { Colours } from '../Components/Global/Global.styles';
import { GLTFLoader } from '../Utility/Loader/GLTFLoader';
import AstronautGLB from '../Assets/Models/Astronaut.glb';
import Overlay from '../Components/Overlay/Overlay';
import { ITEM_LIST } from '../Utility/Data/ItemList';
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
			overlayProject: null,
			pause: false,
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
     * This function setup the THREE.Scene
	 * and calls other setup function
     *
     * @memberof CubeEnvironment
     */
	setupScene = () => {
		this.scene = new THREE.Scene();
		this.setDimensions();
		this.setupCamera();
		this.setupControls();
		this.setupRenderer();
		// this.setupLoadingManager();
		// this.setupRayCaster()
		// this.setupMouse()
		this.mount.appendChild(this.renderer.domElement); // mount using React ref
	};

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	populateScene = () => {
		this.addHelpers()
		this.addCube(new THREE.Vector3(0,0,0), ITEM_LIST.ITEM_ONE);
		this.addCube( new THREE.Vector3(-20,5,-30), ITEM_LIST.ITEM_TWO);
		this.addCube(new THREE.Vector3(20,5,-26), ITEM_LIST.ITEM_THREE);
		this.addLights();
		// this.addModel(AstronautGLB, new THREE.Vector3(0,0,0), ITEM_LIST.ITEM_ONE);
		// this.addModel(AstronautGLB, new THREE.Vector3(-20,5,-30), ITEM_LIST.ITEM_TWO);
		// this.addModel(AstronautGLB, new THREE.Vector3(20,5,-26), ITEM_LIST.ITEM_THREE);
		// this.setupFog();

	};
	/**
	 * This adds fog to the scene
	 *
	 * @memberof PortfolioEnvironment
	 */
	setupFog = () => {
		this.scene.fog = new THREE.FogExp2(new THREE.Color("white"), 0.1); // Color, Density
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
     * 
     * @memberof CubeEnvironment
     */
	setupControls = () => {
		this.setupOrbitControls();
		// this.setupFlyControls();
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
	 * OrbitControls allow a camera to orbit around the object
     * https://threejs.org/docs/#examples/controls/OrbitControls
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
	addCube = (position, project) => {
		// Create geometry
		const geometry = new THREE.BoxGeometry(2, 2, 2);
		// Create Material
		const material = new THREE.MeshPhongMaterial({
			color: 'rgb(54, 54, 82)',
			emissive: 'rgb(54, 54, 82)',
			side: THREE.DoubleSide,
			flatShading: true
		});
		// Create Cube using geometry and material
		let cube = new THREE.Mesh(geometry, material);

		// Set cube position
		cube.position.set(position.x, position.y, position.z);

		// Add project to cube user data
		cube.userData.project = project;

		// Add clickable objects
		this.clickableObjects.push(cube);

		// Add cube to scene
		this.scene.add(cube);
	};

	/**
     * Creates THREE.PointLight
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

	/**
	 * Loads model and adds to the scene
	 * 
	 * Requires Object url, THREE.Vector3 and project name
	 *
	 * @memberof PortfolioEnvironment
	 */
	addModel = (object, position, project) => {
		// Add manager to loader
		const loader = new GLTFLoader(this.manager);
		// Instatiate new Object3D for the model
		let model = new THREE.Object3D();
		// console.log("OBJ", object)

		// Load the model using call back
		loader.load(object, (gltf) => {
			model = gltf.scene;
			
			// Sets position of Model
			model.position.set(position.x, position.y, position.z);
			
			// Assign project data
			model.userData.project = project;
			model.traverse((object) => {
				object.userData.project = project
			})

			this.clickableObjects.push(model);
			this.scene.add(model);
		});
	};

	/**
	 *
	 *
	 * @memberof PortfolioEnvironment
	 */
	addHelpers = () => {
		this.addAxesHelper();
        this.addGridHelper();
	};

	/**
	 * 
	 *
	 * @memberof PortfolioEnvironment
	 */
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
		// Create Gridhelper with size and divisions
		const gridHelper = new THREE.GridHelper(size, divisions);
		this.scene.add(gridHelper);
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


	/**
	 *
	 *
	 * @memberof PortfolioEnvironment
	 */
	hideOverlay = () => {
		this.setState({
			showOverlay: false
		})
	}

	// Interactions

	/**
     * EventListeners
     *
     * @memberof CubeEnvironment
     */
	addEventListeners = () => {
		// document.addEventListener("dblclick", this.onDocumentDoubleClick, false);
		window.addEventListener("resize", this.handleWindowResize, false);
	};

	/**
	 * EventListeners
	 *
	 * @memberof PortfolioEnvironment
	 */
	removeEventListeners = () => {
		// document.removeEventListener("dblclick", this.onDocumentDoubleClick);
		window.removeEventListener("resize", this.onWindowResize);
	};

	/**
	 * This is calleed when the resize event is triggered
	 *
	 * @memberof PortfolioEnvironment
	 */
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
	 * This is calleed when the dblclick event is triggered
	 *
	 * @memberof PortfolioEnvironment
	 */
	onDocumentDoubleClick = event => {
		// Check if environment is not in pause state
		if (!this.state.pause) {
		  this.setMouse(event);

		  // Update the ray with a new origin and direction.
		  this.raycaster.setFromCamera(this.mouse, this.camera);

		  //Checks all intersection between the ray and the objects with or without the descendants. 
		  // Intersections are returned sorted by distance, closest first. 
		  let intersects = this.raycaster.intersectObjects(this.clickableObjects);
		  console.log("clickableObjects", this.clickableObjects)
		  if (intersects.length > 0) {
			let mesh = intersects[0];
			console.log(mesh.object);
			// Set the overlay and project
			this.setState({
				showOverlay: true,
				overlayProject: mesh.object.userData.project
			})
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
		return (
			<React.Fragment>
				<Overlay project={this.state.overlayProject} show={this.state.showOverlay} hide={this.hideOverlay} />
				<TestEnvironmentWrapper ref={(ref) => (this.mount = ref)} />

			</React.Fragment>
		)
		;
	}
}

export default PortfolioEnvironment;
