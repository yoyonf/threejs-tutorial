import React, { useState, useEffect, useRef, Component } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader';

import styled from 'styled-components';
import { Colours } from '../Components/Global/Global.styles';

import { ITEM_LIST } from '../Utility/Data/ItemList';
import Overlay from '../Components/Overlay/Overlay';

import AstronautGLB from '../Assets/Models/Astronaut.glb'
import Chair from '../Assets/Models/Chair.glb'
import Car from '../Assets/Models/car.glb'
import { OverlayItem } from '../Utility/Models/OverlayItem';

const CubeEnvironmentWrapper = styled.div`height: 100vh;`;

/**
 * CubeEnvironment.js
 * 
 * This class contains all the logic to generate/render a scene in THREEjs
 *
 */
class CubeEnvironment extends Component {
	//
	width;
	height;

	scene;
	controls;
	camera;
	renderer;
	composer;

	animationID;

	mount;

	cube;
	model;

	clock;
	raycaster;
	mouse;

	composer;

	clickableObjects = [];

	overlayItem;

    
    constructor(props) {
        super(props);
        this.state = {
          hasLoaded: false,
          itemsLoaded: 0,
		  itemsTotal: 0,
		  showOverlay: false,
		  overlayProject: null,
		  pause: false
		};
		
		this.overlayItem = new OverlayItem(
			"Soy Cuba", 
			"VIDEO", 
			"https://www.youtube.com/embed/BwEabZrGFfI"
		)
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
		this.addEventListeners()
	}

	/**
     * This is a React Lifecycle method.
     *
     * @memberof CubeEnvironment
     */
	componentWillUnmount() {
		this.removeEventListeners();
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
		// ADD CONTROLS
		// this.setupControls();
		this.setupRenderer();
		
		// ADD MODELS
		// this.setupLoadingManager();

		// MAKE INTERACTIVE
		// this.setupRayCaster()
		// this.setupMouse()

		// ADD POST PROCESSING
		// this.setupPostProcessing();

		this.mount.appendChild(this.renderer.domElement); // mount using React ref
	};

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	populateScene = () => {
		this.addHelpers();
		this.addLights();
		this.addCube( new THREE.Vector3(0,0,0),this.overlayItem);
		// this.addModel(Car, new THREE.Vector3(0,0,0), this.overlayItem);
		// this.setupFog();
	};

	/**
     *
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
		this.setupOrbitControls();
	};

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
		this.controls.autoRotateSpeed = 2.0;
		this.controls.keyPanSpeed = 7.0;
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
	};

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	setupRenderer = () => {
		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.renderer.setClearColor(new THREE.Color('rgb(240, 235, 255)'));
		this.renderer.setSize(this.width, this.height);
	};

	setupPostProcessing = () => {
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));


		let pixelPass = new ShaderPass( PixelShader );
		 pixelPass.uniforms[ 'resolution' ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
		 pixelPass.uniforms[ 'resolution' ].value.multiplyScalar( window.devicePixelRatio );
		 pixelPass.uniforms[ 'pixelSize' ].value = 4; // Between 2 and 32
		this.composer.addPass(pixelPass);

	};

		/**
	 * This adds fog to the scene
	 *
	 * @memberof PortfolioEnvironment
	 */
	setupFog = () => {
		this.scene.fog = new THREE.FogExp2(new THREE.Color('white'), 0.1); // Color, Density
	};

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
	 * Instatiate the mouse property
	 *
	 * @memberof PortfolioEnvironment
	 */
	setupMouse = () => {
		this.mouse = new THREE.Vector2();
	};

	/**
	 *
	 *
	 * @memberof PortfolioEnvironment
	 */
	setMouse = (event) => {
		this.mouse.x = event.clientX / this.mount.clientWidth * 2 - 1;
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
			color: new THREE.Color('rgb(54, 54, 82)'),
			emissive: new THREE.Color('rgb(54, 54, 82)'),
			side: THREE.DoubleSide,
			flatShading: true
		});
		// Create Cube using geometry and material
		this.cube = new THREE.Mesh(geometry, material);
		this.cube.position.set(position.x, position.y, position.z);

		
		// Add project to cube user data
		this.cube.userData.project = project;

		// Add clickable objects
		this.clickableObjects.push(this.cube);

		// Add cube to scene
		this.scene.add(this.cube);
	};

	/**
     * Creates THREE.PointLight
     *
     * @memberof CubeEnvironment
     */
	addLights = () => {
		const lights = [];
		lights[0] = new THREE.PointLight(new THREE.Color("white"), 1, 0);
		lights[1] = new THREE.PointLight(new THREE.Color("white"), 1, 0);
		lights[2] = new THREE.PointLight(new THREE.Color("white"), 1, 0);

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
	 * @memberof CubeEnvironment
	 */
	addModel = async (object, position, project) => {

		// Add manager to loader		
		const loader = new GLTFLoader(this.manager);
		// Instatiate new Object3D for the model		
		this.model = new THREE.Object3D();
		
		// Load the model using call back
        loader.load(object, gltf => {
			// Sets position of Model
			this.model = gltf.scene;
			// mesh.name = name;
			// Sets position of Model		
			this.model.position.set(position.x, position.y, position.z)
			
			// Assign project data
			this.model.traverse((object) => {
				object.userData.project = project;
			});

			// Add to clickable objects
			this.clickableObjects.push(this.model);

			// Add model to scene
            this.scene.add(this.model);
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

	setupLoadingManager = () => {
		this.manager = new THREE.LoadingManager();
		this.manager.onStart = this.loadStart;
		this.manager.onProgress = this.loadProgressing;
		this.manager.onLoad = this.loadFinished;
		this.manager.onError = this.loadError;
	};
	
	loadStart = (url, itemsLoaded, itemsTotal) => {
		this.setState({
			itemsLoaded: itemsLoaded,
			itemsTotal: itemsTotal
		});
	};

	loadProgressing = (url, itemsLoaded, itemsTotal) => {
		this.setState({
			itemsLoaded: itemsLoaded,
			itemsTotal: itemsTotal
		});
	};

	loadFinished = () => {
		this.setState({
			hasLoaded: true
		});
		console.log('HAS LOADED');
		// this.onWindowResize();
	};

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	startAnimationLoop = () => {
		if (this.cube) {
			this.cube.rotation.x += 0.01;
			this.cube.rotation.y += 0.01;
		}

		if (this.model) {
			this.model.rotation.x += 0.01;
			this.model.rotation.y += 0.01;
		}

		if(this.composer){
			this.composer.render();
		} else {
			this.renderer.render(this.scene, this.camera);
		}

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
			showOverlay: false,
			pause: false
		});
	};


	// Interactions

	/**
     * EventListeners
     *
     * @memberof CubeEnvironment
     */
	addEventListeners = () => {
		// MAKE INTERACTIVE
		// document.addEventListener("dblclick", this.onDocumentDoubleClick, false);
		window.addEventListener('resize', this.handleWindowResize, false);
	};

	/**
	 * EventListeners
	 *
	 * @memberof PortfolioEnvironment
	 */
	removeEventListeners = () => {
		// MAKE INTERACTIVE
		// document.removeEventListener("dblclick", this.onDocumentDoubleClick);
		window.removeEventListener('resize', this.handleWindowResize);
	};

	/**
     *
     *
     * @memberof CubeEnvironment
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
	onDocumentDoubleClick = (event) => {
		// Check if environment is not in pause state
		if (!this.state.pause) {
			this.setMouse(event);

			// Update the ray with a new origin and direction.
			this.raycaster.setFromCamera(this.mouse, this.camera);

			//Checks all intersection between the ray and the objects with or without the descendants.
			// Intersections are returned sorted by distance, closest first.
			let intersects = this.raycaster.intersectObjects(this.clickableObjects);
			if (intersects.length > 0) {
				let mesh = intersects[0];
				console.log("YOUR MODEL WAS SELECTED");

				// MAKE INTERACTIVE
				// Set the overlay and project
				// this.setState({
				// 	pause: true,
				// 	showOverlay: true,
				// 	overlayProject: mesh.object.userData.project
				// });
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

				<CubeEnvironmentWrapper ref={(ref) => (this.mount = ref)} />;
			</React.Fragment>
		)
		
	}
}

export default CubeEnvironment;
