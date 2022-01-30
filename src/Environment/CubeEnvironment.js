import React, { useState, useEffect, useRef, Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styled from 'styled-components';
import { Colours } from '../Components/Global/Global.styles';
import { GLTFLoader } from '../Utility/Loader/GLTFLoader';
import AstronautGLB from '../Assets/Models/Astronaut.glb'
import Model from '../Assets/Models/Chair.glb'

const TestEnvironmentWrapper = styled.div`height: 100vh;`;

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
	animationID;
	mount;
	cube;
	model;
    
    constructor(props) {
        super(props);
        this.state = {
          hasLoaded: false,
          itemsLoaded: 0,
          itemsTotal: 0,
          showOverlay: false
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
		window.addEventListener('resize', this.handleWindowResize);
	}

	/**
     * This is a React Lifecycle method.
     *
     * @memberof CubeEnvironment
     */
	componentWillUnmount() {
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
		this.mount.appendChild(this.renderer.domElement); // mount using React ref
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
		this.controls = new OrbitControls(this.camera, this.mount);
	};

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	setupRenderer = () => {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(Colours.light_purple);
		this.renderer.setSize(this.width, this.height);
	};

	/**
     *
     *
     * @memberof CubeEnvironment
     */
	populateScene = () => {
		// this.addCube();
        this.addLights();
        // this.addModel(AstronautGLB);
        this.addModel(Model);
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
        this.model = new THREE.Object3D();
        // console.log("OBJ", object)

        loader.load(object, gltf => {
            this.model = gltf.scene;
            // mesh.name = name;
            this.model.position.z = 0;

            this.scene.add(this.model);
          });
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

		this.renderer.render(this.scene, this.camera);

		// The window.requestAnimationFrame() method tells the browser that you wish to perform
		// an animation and requests that the browser call a specified function
		// to update an animation before the next repaint
		this.animationID = window.requestAnimationFrame(this.startAnimationLoop);
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
     *
     *
     * @returns
     * @memberof CubeEnvironment
     */
	render() {
		return <TestEnvironmentWrapper ref={(ref) => (this.mount = ref)} />;
	}
}

export default CubeEnvironment;
