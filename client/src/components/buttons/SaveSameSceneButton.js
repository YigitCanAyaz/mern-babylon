export const SaveSameSceneButton = (props) => {
    return (
        <div className='text-center border-0 rounded'>
            <button style={{ "height": "60px", "width": "256px" }} type="button" className="bg-primary text-light border border-primary rounded" onClick={() => props.saveSameSceneButton()}>SAVE SCENE</button>
        </div>

    )
}