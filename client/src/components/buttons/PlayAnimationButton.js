export const PlayAnimationButton = (props) => {
    return (
        <div className='text-center'>
            <button style={{ "height": "60px", "width": "256px" }} type="button" className="bg-success text-light border border-success rounded" onClick={() => props.playAnimationButton()}>PLAY</button>
        </div>

    )
}