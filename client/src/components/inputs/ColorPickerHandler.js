export const ColorPickerHandler = (props) => {
    return (

        <div className='position-absolute bottom-0 end-0 mb-5 me-5'>
            <input type="color" style={{ "height": "100px", "width": "100px" }} id="colorPicker" onInput={() => props.colorPickerHandler()} />
        </div>
    )
}