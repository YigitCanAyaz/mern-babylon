import React, { useState, useEffect } from 'react';
import Axios from "axios";
import ListItem from "../components/ListItem";
import { BackToSceneButton } from '../components/buttons/BackToSceneButton';
import { Link } from 'react-router-dom';

export const Dashboard = () => {

    document.body.style.removeProperty('overflow');

    let [scenes, setScenes] = useState([]);

    useEffect(() => {
        getScenes();
    }, []);

    let getScenes = async () => {
        Axios.get("http://localhost:3001/getScenes").then((response) => {
            setScenes(response.data);
        });
    }

    return (
        <div>
            <h1 className="display-3 text-center mt-5 mb-5">Dashboard</h1>
            <div className="container mt-5">
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {scenes.map((scene, index) => (
                        <ListItem key={index} scene={scene} />
                    ))}
                </div>
                <Link to="/scene">
                    <BackToSceneButton />
                </Link>
            </div >
        </div>
    );
};
