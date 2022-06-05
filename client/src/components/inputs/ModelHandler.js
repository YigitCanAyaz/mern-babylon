export const ModelHandler = (props) => {
    return (
        <div className='text-center bg-light border border-primary'>
            <label htmlFor="meshFile" className="form-label text-primary mt-1">Choose a model:</label>
            <input className="form-control mt-1" type="file" accept=".gltf, .glb, .obj" id="meshFile" onChange={(event) => props.modelHandler(event)} />
        </div>
    )
}