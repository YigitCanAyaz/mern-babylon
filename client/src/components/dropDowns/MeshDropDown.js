export const MeshDropDown = () => {
    return (
        <div>
            <select className="form-select position-absolute top-0 end-0 w-auto me-5 mt-5 border border-primary" aria-label="Default select example" id="meshDropDown" defaultValue={'DEFAULT'}>
                <option value="DEFAULT">Select a mesh:</option>
            </select>
        </div>
    )
}