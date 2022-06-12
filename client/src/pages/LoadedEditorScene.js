import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { Link, useParams } from 'react-router-dom';
import * as BABYLON from "@babylonjs/core";
import "babylonjs-inspector";
import SceneComponent from "../components/SceneComponent";
import { GLTFFileLoader } from "@babylonjs/loaders/glTF";
import { BackToDashboardButton } from '../components/buttons/BackToDashboardButton';
import { ModelHandler } from '../components/inputs/ModelHandler';
import { TextureHandler } from '../components/inputs/TextureHandler';
import { FirstAnimationButton } from '../components/buttons/FirstAnimationButton';
import { SecondAnimationButton } from '../components/buttons/SecondAnimationButton';
import { ThirdAnimationButton } from '../components/buttons/ThirdAnimationButton';
import { PlayAnimationButton } from '../components/buttons/PlayAnimationButton';
import { MeshHiddenButton } from '../components/buttons/MeshHiddenButton';
import { SaveSceneButton } from '../components/buttons/SaveSceneButton';
import { ColorPickerHandler } from '../components/inputs/ColorPickerHandler';
import { MeshDropDown } from '../components/dropDowns/MeshDropDown';
import { SaveSameSceneButton } from '../components/buttons/SaveSameSceneButton';

var url;
var fileBabylonName;
var blob;
var file;
var filePath;
var camera;
var light;
var colorMaterial;
var flag = false;
var count = 2;
var gizmo;
var utilLayer;
var myScene;
var colorPicker;
var renderer;
var depthMap;
var buffer;
var ray;
var rayHelper;
var objectUrl;
var rayFlag = false;
var date;
var currentMeshParent;
var cameraFollow;
var currentMesh;
var serializedScene;
var strScene;
var serializedAnimationSceneFlag = false;
var newModel = false;

export const LoadedEditorScene = (props) => {

    document.body.style.overflow = "hidden";

    let { _id } = useParams();
    let [scene, setScene] = useState(null);
    let [content, setContent] = useState(null);


    useEffect(() => {
        getScene();
    }, [_id]); // any time id changes then go head and fire of useEffects


    let getScene = async () => {
        Axios.get(`http://localhost:3001/getScenes/${_id}`).then((response) => {
            setScene(response.data.result);
            console.log('result', response.data.result)
            console.log('content', response.data.content)
            setContent(response.data.content);
            blob = new Blob([response.data.content]);
            file = new File([blob], response.data.result.name)
            filePath = response.data.result.filePath;
            console.log(blob);
            console.log(file);
            console.log('filePath', filePath);
            url = URL.createObjectURL(file)
            console.log('url', url)
            fileBabylonName = response.data.result.name;
            console.log('fileBabylonName', fileBabylonName)
        }).then(() => {
            BABYLON.SceneLoader.Append(
                url,
                "",
                myScene,
                function (scene) {
                    let mesh = myScene.meshes[count];
                    var gltfMesh = mesh.parent;
                    var boundingBox =
                        BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh);

                    // Create bounding box gizmo
                    utilLayer = new BABYLON.UtilityLayerRenderer(scene);
                    utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
                    gizmo = new BABYLON.GizmoManager(scene);
                    gizmo.boundingBoxGizmoEnabled = true;
                    gizmo.positionGizmoEnabled = true;
                    gizmo.gizmos.boundingBoxGizmo.fixedDragMeshScreenSize = true;

                    gizmo.attachedMesh = boundingBox;
                    var dragobserver = new BABYLON.PointerDragBehavior();
                    boundingBox.addBehavior(dragobserver);

                    boundingBox.rotationQuaternion = new BABYLON.Quaternion();
                }
            );
        })

    }

    let getDate = async () => {
        const date = new Date(scene.date);
        const day = date.toLocaleDateString();
        const time = date.toLocaleTimeString();
        return day + " " + time;
    }

    let getName = async () => {
        const fileName = scene.name;
        const name = fileName.split(".")[0];
        return name;
    }

    let getFilePath = async () => {
        return scene.filePath;
    }

    return (
        <div className="d-flex" id="wrapper">
            <div className="border-end bg-white" id="sidebar-wrapper"></div>
            <div className="border-end bg-white" id="sidebar-wrapper">
                <div className="sidebar-heading border-bottom bg-light text-center">Options:</div>
                <div className="list-group list-group-flush">
                    <a className="list-group-item list-group-item-action list-group-item-light p-3"><ModelHandler modelHandler={handleModelSelect} /></a>
                    <a className="list-group-item list-group-item-action list-group-item-light p-3"><TextureHandler textureHandler={handleTextureSelect} /></a>
                    <a className="list-group-item list-group-item-action list-group-item-light p-3"><FirstAnimationButton firstAnimationButton={toggleFirstAnimationButton}
                    /></a>
                    <a className="list-group-item list-group-item-action list-group-item-light p-3"><SecondAnimationButton secondAnimationButton={toggleSecondAnimationButton}
                    /></a>
                    <a className="list-group-item list-group-item-action list-group-item-light p-3"><ThirdAnimationButton thirdAnimationButton={toggleThirdAnimationButton}
                    /></a>
                    <a className="list-group-item list-group-item-action list-group-item-light p-3"><PlayAnimationButton playAnimationButton={makeAnimation} /></a>
                    <a className="list-group-item list-group-item-action list-group-item-light p-3"><MeshHiddenButton meshHiddenButton={meshHiddenButton} /></a>
                    <a className="list-group-item list-group-item-action list-group-item-light p-3 mt-2"><SaveSameSceneButton saveSameSceneButton={saveSameSceneButton} /></a>
                </div>
            </div>
            <div>
                <SceneComponent
                    antialias
                    onSceneReady={onSceneReady}
                    onRender={onRender}
                    id="my-canvas"
                    style={{
                        width: window.innerWidth,
                        height: window.innerHeight,
                        outline: "none",
                    }}
                />

                <ColorPickerHandler colorPickerHandler={changeColorOfMesh} />

                <MeshDropDown />
            </div>
        </div>
    );
}

const onRender = (scene) => {
    // if (box !== undefined) {
    //   var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    //   const rpm = 10;
    //   box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    // }
};

let firstAnimationPosition, firstAnimationRotation;
let secondAnimationPosition, secondAnimationRotation;
let thirdAnimationPosition, thirdAnimationRotation;

const handleModelSelect = (evt) => {
    if (flag === false) {
        flag = true;
    } else {
        const dropDownList = document.getElementById("meshDropDown");
        while (dropDownList.options.length > 0) {
            dropDownList.remove(0);
        }
    }
    console.log(evt.target.files);
    var files = evt.target.files;
    console.log(files[0]);
    const url = URL.createObjectURL(files[0]);
    console.log(url);

    BABYLON.SceneLoader.Append(
        url,
        "",
        myScene,
        function (scene) {
            console.log('scene', scene);
            let mesh = myScene.meshes[count];
            scene.stopAnimation(mesh);
            count = myScene.meshes.length + 1;
            console.log('count', count);
            console.log('mesh', mesh);
            // let meshParent = mesh.getChildMeshes()[0];
            var gltfMesh = mesh;
            var boundingBox =
                BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh);

            // Create bounding box gizmo
            utilLayer = new BABYLON.UtilityLayerRenderer(scene);
            utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
            gizmo = new BABYLON.GizmoManager(scene);
            gizmo.boundingBoxGizmoEnabled = true;
            gizmo.positionGizmoEnabled = true;
            gizmo.gizmos.boundingBoxGizmo.fixedDragMeshScreenSize = true;

            gizmo.attachedMesh = boundingBox;
            var dragobserver = new BABYLON.PointerDragBehavior();
            boundingBox.addBehavior(dragobserver);

            boundingBox.rotationQuaternion = new BABYLON.Quaternion();
            camera.setPosition(mesh.position);
        },
        null,
        null,
        ".glb"
    );
};

const handleTextureSelect = (evt) => {
    let files = evt.target.files;
    let url = URL.createObjectURL(files[0]);
    var textureMaterial = new BABYLON.StandardMaterial(
        "textureMaterial",
        myScene
    );
    textureMaterial.diffuseTexture = new BABYLON.Texture(url);
    var selectList = document.getElementById("meshDropDown");
    var childMesh = myScene.getMeshByName(selectList.value);
    childMesh.material = textureMaterial;
};

const saveSameSceneButton = () => {
    if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
    }

    if (serializedAnimationSceneFlag === false) {
        serializedScene = BABYLON.SceneSerializer.Serialize(myScene);

        strScene = JSON.stringify(serializedScene);
    }

    var newBlob = new Blob([strScene], { type: "octet/stream" });

    // turn blob into an object URL; saved as a member, so can be cleaned out later
    objectUrl = (window.webkitURL || window.URL).createObjectURL(newBlob);

    console.log('objecturl', objectUrl)

    date = new Date();

    const name = fileBabylonName;

    Axios.post("http://localhost:3001/createScene", { name, filePath, date }).then((result) => {
        console.log('result', result);
        var link = window.document.createElement("a");
        console.log('objecturl', objectUrl);
        link.href = objectUrl;
        link.download = result.data.name;
        var click = document.createEvent("MouseEvents");
        click.initEvent("click", true, false);
        link.dispatchEvent(click);
    });
}

const changeColorOfMesh = () => {
    const selectedColor = BABYLON.Color3.FromHexString(colorPicker.value);
    var color = colorMaterial.diffuseColor.copyFrom(selectedColor);
    var colorMat = new BABYLON.StandardMaterial("colorMat", myScene);
    colorMat.diffuseColor.copyFrom(color);
    var selectList = document.getElementById("meshDropDown");
    var childMesh = myScene.getMeshByName(selectList.value);
    childMesh.material = colorMat;
};

const toggleFirstAnimationButton = () => {
    console.log('currentMeshParent', currentMeshParent);
    let mesh = currentMeshParent;
    var eular = currentMeshParent.rotationQuaternion.toEulerAngles();
    firstAnimationPosition = new BABYLON.Vector3(
        mesh.position.x,
        mesh.position.y,
        mesh.position.z
    );
    firstAnimationRotation = new BABYLON.Vector3(eular.x, eular.y, eular.z);
    console.log(firstAnimationPosition);
    console.log(firstAnimationRotation);
};

const toggleSecondAnimationButton = () => {
    console.log('currentMeshParent', currentMeshParent);
    let mesh = currentMeshParent;
    var eular = currentMeshParent.rotationQuaternion.toEulerAngles();
    secondAnimationPosition = new BABYLON.Vector3(
        mesh.position.x,
        mesh.position.y,
        mesh.position.z
    );
    secondAnimationRotation = new BABYLON.Vector3(eular.x, eular.y, eular.z);
    console.log(secondAnimationPosition);
    console.log(secondAnimationRotation);
};

const toggleThirdAnimationButton = () => {
    console.log('currentMeshParent', currentMeshParent);
    let mesh = currentMeshParent;
    var eular = currentMeshParent.rotationQuaternion.toEulerAngles();
    thirdAnimationPosition = new BABYLON.Vector3(
        mesh.position.x,
        mesh.position.y,
        mesh.position.z
    );
    thirdAnimationRotation = new BABYLON.Vector3(eular.x, eular.y, eular.z);
    console.log(thirdAnimationPosition);
    console.log(thirdAnimationRotation);
};

const makeAnimation = () => {

    serializedScene = BABYLON.SceneSerializer.Serialize(myScene);

    strScene = JSON.stringify(serializedScene);

    serializedAnimationSceneFlag = true;

    const frameRate = 10;

    var animationPosition = new BABYLON.Animation(
        "animationPosition",
        "position",
        frameRate,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    var animationRotation = new BABYLON.Animation(
        "animationRotation",
        "rotation",
        frameRate,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    var keyFramesPosition = [];
    let keyFramesRotation = [];

    // for position

    keyFramesPosition.push({
        frame: 0,
        value: 0,
    });

    keyFramesPosition.push({
        frame: frameRate,
        value: firstAnimationPosition,
    });

    keyFramesPosition.push({
        frame: frameRate * 2,
        value: secondAnimationPosition,
    });

    keyFramesPosition.push({
        frame: frameRate * 3,
        value: thirdAnimationPosition,
    });

    animationPosition.setKeys(keyFramesPosition);

    // for rotation

    keyFramesRotation.push({
        frame: 0,
        value: 0,
    });

    keyFramesRotation.push({
        frame: frameRate,
        value: firstAnimationRotation,
    });

    keyFramesRotation.push({
        frame: frameRate * 2,
        value: secondAnimationRotation,
    });

    keyFramesRotation.push({
        frame: frameRate * 3,
        value: thirdAnimationRotation,
    });

    animationRotation.setKeys(keyFramesRotation);

    let mesh = currentMeshParent;

    mesh.animations = [];
    mesh.animations.push(animationPosition);
    mesh.animations.push(animationRotation);

    myScene.beginAnimation(mesh, 0, 3 * frameRate, false);

    // mesh.position = new BABYLON.Vector3(-6, 0, 0);
};

const meshHiddenButton = () => {
    if (rayFlag === true) {
        rayHelper.hide();
    }
    let mesh = myScene.meshes[count];
    console.log(mesh);
    console.log(mesh.position);
    ray = BABYLON.Ray.CreateNewFromTo(camera.position, mesh.parent.position);
    rayHelper = new BABYLON.RayHelper(ray);
    rayHelper.show(myScene, new BABYLON.Color3(0, 1, 0));
    // console.log(ray);
    const picked = myScene.pickWithRay(ray);
    // console.log(picked);
    // alert(picked.hit ? "önünde mesh var" : "önünde mesh yok");
    alert(picked.pickedMesh?.name);
    rayFlag = true;
};

const onSceneReady = async (scene) => {
    myScene = scene;

    GLTFFileLoader.IncrementalLoading = false;

    myScene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        "https://playground.babylonjs.com//textures/country.env",
        myScene
    );
    myScene.createDefaultSkybox(myScene.environmentTexture);

    camera = new BABYLON.ArcRotateCamera(
        "camera1",
        0,
        Math.PI / 2,
        10,
        BABYLON.Vector3(-6, 0, 0),
        myScene
    );
    const canvas = myScene.getEngine().getRenderingCanvas();

    camera.attachControl(canvas, true);

    camera.wheelPrecision = 15; //Mouse wheel speed
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 50;

    light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        myScene
    );

    light.intensity = 0.7;
    colorMaterial = new BABYLON.StandardMaterial("colorMaterial", myScene);
    colorPicker = document.getElementById("colorPicker");
    colorPicker.value = colorMaterial.diffuseColor;

    renderer = myScene.enableDepthRenderer(camera, false);
    depthMap = renderer.getDepthMap();
    buffer = new Float32Array(
        4 * depthMap.getSize().width * depthMap.getSize().height
    );

    myScene.onPointerDown = (evt, pickResult) => {
        if (pickResult.hit) {
            const dropDownList = document.getElementById("meshDropDown");

            while (dropDownList.options.length > 0) {
                dropDownList.remove(0);
            }

            console.log('pickedMesh', pickResult.pickedMesh);

            currentMesh = pickResult.pickedMesh;

            console.log('currentMesh', currentMesh);

            while (currentMesh.parent !== null) {
                currentMesh = currentMesh.parent;
                console.log('going to parent...', currentMesh)
            }
            currentMeshParent = currentMesh;
            currentMesh = currentMesh.getChildMeshes()[0];
            console.log('currentMeshName', currentMesh);
            console.log('currentMeshParentName', currentMeshParent);

            currentMeshParent.getChildMeshes().forEach((childMeshes) => {
                var option = document.createElement("option");
                option.value = childMeshes.id;
                option.text =
                    childMeshes.id.charAt(0).toUpperCase() + childMeshes.id.slice(1);
                dropDownList.appendChild(option);
            });
        }
    }
};