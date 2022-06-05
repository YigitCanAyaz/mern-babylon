import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { Link, useParams } from 'react-router-dom';
import * as BABYLON from "@babylonjs/core";
import "babylonjs-inspector";
import SceneComponent from "../components/SceneComponent";
import { GLTFFileLoader } from "@babylonjs/loaders/glTF";
import { BackToDashboardButton } from '../components/buttons/BackToDashboardButton';

var url;
var fileBabylonName;
var blob;
var file;

export const LoadedScene = (props) => {

    let { _id } = useParams();
    let [scene, setScene] = useState(null);
    let [content, setContent] = useState(null);


    useEffect(() => {
        getScene();
    }, [_id]); // any time id changes then go head and fire of useEffects


    let getScene = async () => {
        Axios.get(`http://localhost:3001/getScenes/${_id}`).then((response) => {
            setScene(response.data.result);
            setContent(response.data.content);
            blob = new Blob([response.data.content]);
            file = new File([blob], response.data.result.name)
            console.log(blob);
            console.log(file);
            url = URL.createObjectURL(file)
            console.log(url)
            fileBabylonName = response.data.result.name;
            console.log(fileBabylonName)
        }).then(() => {
            BABYLON.SceneLoader.Append(
                url,
                "",
                myScene,
                function (scene) {
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
        <div className="position-relative">
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
            {/* <Link to="/dashboard">
                <BackToDashboardButton />
            </Link> */}
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

let box;
var camera;
var light;
var colorMaterial;
var flag = false;
var count = 1;
var gizmo;
var utilLayer;
var boundingBox;
var myScene;
var colorPicker;
var renderer;
var depthMap;
var buffer;
var ray;
var rayHelper;
var objectUrl;
var filePath;
var rayFlag = false;
var date;

let firstAnimationPosition, firstAnimationRotation;
let secondAnimationPosition, secondAnimationRotation;
let thirdAnimationPosition, thirdAnimationRotation;

const onSceneReady = async (scene) => {
    myScene = scene;

    GLTFFileLoader.IncrementalLoading = false;

    myScene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        "https://playground.babylonjs.com/textures/country.env",
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
};