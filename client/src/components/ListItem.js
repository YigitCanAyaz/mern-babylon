import React from 'react'
import { Link } from 'react-router-dom'

let getDate = (scene) => {
    const date = new Date(scene.date);
    const day = date.toLocaleDateString();
    const time = date.toLocaleTimeString();
    return day + " " + time;
}

let getName = (scene) => {
    const fileName = scene.name;
    const name = fileName.split(".")[0];
    return name;
}

let getFilePath = (scene) => {
    return scene.filePath;
}

const ListItem = ({ scene }) => {
    return (
        <div className="col text-center mt-5">
            <div className="card">
                <div className="card-header">{getName(scene)}</div>
                <img src={require("../assets/babylon-small-img.png")} className="card-img-top" alt="..." style={{ "height": "200px" }} />
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <button type="button" className="btn btn-primary">
                                <Link to={`/scene/${scene._id}`} style={{ textDecoration: "none" }} target="_blank">
                                    <p className="card-title text-light">Viewer</p>
                                </Link>
                            </button>
                        </div>
                        <div className="col">
                            <button type="button" className="btn btn-danger">
                                <Link to={`/scene/editor/${scene._id}`} style={{ textDecoration: "none" }} target="_blank">
                                    <p className="card-title text-light">Editor</p>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Uploaded on: {getDate(scene)}</small>
                </div>
            </div>
        </div>
    )
}

export default ListItem