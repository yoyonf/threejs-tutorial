## Setting up the website locally

1. Clone repository
Use git to clone the repository using the command below:



  - ```bash
git clone https://github.com/t-lawan/threejs-tutorial.git
``` or use github desktop
  - Fork the repository.

2. Go to directory of cloned repository using the command below:
```bash
cd threejs-tutorial
```

3. Install package dependencies using the command below

```bash
npm install
```
4. Run the app in the development mode using the command below:

```bash
npm run start
```

5. If the broswer did not open automatically, go to http://localhost:3000/ in a web browser

## Tutorial Plan

6. **Open the directory in a text editor (ideally visual studio code)**

- Look at the fundamental function that set up the environment: renderer, scene and camera
  - setupScene()
    - new THREE.Scene()
    - setupCamera()
    - setupRenderer()

7. **Replace Cube with model**
    - Copy model (glb) to src/Assets/Model folder
    - Go populateScene() in Cube Environment
    - Go through the addModel() function
    - Uncomment setupLoadingManager() in setupScene()

    **PUSH TO GIT**

8. **Make interactive**
    - Go to setupScene()
        - Uncomment setupRayCaster()
        - Uncomment setupMouse()
        - 
    - Go to addEventListener()
        - uncomment OnDocumentDoubleClick
9. **Uncomment addHelpers() in populateScene()**

    **PUSH TO GIT**
10. **Add controls**
    - Go to setupScene()
    - Uncomment setupControls()
    - Investigate setupControls()

11. **Update overlayItem property**

    **PUSH TO GIT**
12. Investigate <Overlay />

13. **Change the aesthetic**
    - Add Fog 
        - Go to populateScene()
        - Uncomment setupFog()
    - Change the colours in setupRenderer(), setupFog() and addLights()

    **PUSH TO GIT**


    - Add post processing 
        - Go to setupScene 
        - Uncomment setupPostProcessing()
        Investigate setupPostProcessing()

    **PUSH TO GIT**

14. **Connect to Netlify to publish website.**

## References
  - [Roadmap](https://roadmap.sh/)
  - [ThreeJS](https://threejs.org)
  - [React](https://reactjs.org/)


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)


