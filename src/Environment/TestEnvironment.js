import React, { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import styled from 'styled-components';

const TestEnvironmentWrapper = styled.div`
    height: 100vh;
`

/**
 * TestEnvironment.js
 * 
 * This class contains all the logic to generate/render a scene in THREEjs
 *
 */
const TestEnvironment = () => {
    // Scene 
    const [scene, setScene] = useState(null);
    // Camera
    const [camera, setCamera] = useState(null);

    // Controls
    const [controls, setControls] = useState(null);

    // Renderer
    const [renderer, setRenderer] = useState(null);

    // Animation
    const [animationID, setAnimationID] = useState(null);

    // Cube
    const [cube, setCube] = useState(null);

    // Mount
    const mount = useRef(null);

    // Dimensions
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    
    // LIFECYCLE METHODS

    // ComponentDidMount
    useEffect(() => {
        setupScene();
        setCameraPosition();
        setBackgroundColour();
        populateEnvironment();
        startAnimationLoop();
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
            window.cancelAnimationFrame(animationID);
            controls.dispose();
        }
    }, [])

    // METHODS
    const setupScene = () => {
        setWidth(mount.current.clientWidth);
        setHeight(mount.current.clientHeight);

        setScene(new THREE.Scene());
        setCamera(
            new THREE.PerspectiveCamera(
                75, // fov = field of view
                width/height,  // aspect ratio
                0.1, // near plane
                1000 // far plane
                )
        );


        // OrbitControls allow a camera to orbit around the object
        // https://threejs.org/docs/#examples/controls/OrbitControls
        console.log(mount);
        setControls(new OrbitControls(camera, mount));
        setRenderer(new THREE.WebGLRenderer());
    }

    const setCameraPosition = () => {
        camera.position.z = 0; // is used here to set some distance from a cube that is located at z = 0
    }

    const setBackgroundColour = () => {
        renderer.setClearColor("#a841f4");

    }
    
    const populateEnvironment = () => {
        addCube();
        addLights();
    }

    const addCube = () => {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: true
        } );

        setCube(new THREE.Mesh(geometry, material));
        cube.position.set(0,2.5, 0);
        scene.add(cube);
    }

    const addLights = () => {
        let lights  = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[ 0 ].position.set( 0, 200, 0 );
        lights[ 1 ].position.set( 100, 200, 100 );
        lights[ 2 ].position.set( - 100, - 200, - 100 );

        scene.add(lights[ 0 ] );
        scene.add( lights[ 1 ] );
        scene.add( lights[ 2 ] );
    }

    const startAnimationLoop = () => {
        // Rotate cube at X and Y axis
        if(cube){
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01
        }

        renderer.render(scene, camera);
        setAnimationID(window.requestAnimationFrame(startAnimationLoop));
    }

    const handleWindowResize = () => {
        setWidth(mount.current.clientWidth);
        setHeight(mount.current.clientHeight);

        renderer.setSize(width, height);
        camera.aspect = width/height;

        camera.updateProjectionMatrix();
    }



    return (
        <TestEnvironmentWrapper  ref={mount} />
    )
}

export default TestEnvironment;
