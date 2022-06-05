import { useState } from "react";

export const SaveSceneButton = (props) => {
    const [name, setName] = useState("");
    return (
        <div className='text-center border-0 rounded'>
            <input className="border border-primary mb-3" type="text" style={{ "height": "60px", "width": "256px" }} placeholder="File Name" onChange={(event) => { setName(event.target.value); }} />
            <br />
            <button disabled={!name} style={{ "height": "60px", "width": "256px" }} type="button" className="bg-primary text-light border border-primary rounded" onClick={() => props.saveSceneButton(name)}>SAVE SCENE</button>
        </div>

    )
}