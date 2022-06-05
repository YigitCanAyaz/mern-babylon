export const FirstAnimationButton = (props) => {
    return (
        <div className='col-md'>
            <button style={{ "height": "60px", "width": "256px" }} type="button" className="bg-light text-dark border border-primary" onClick={() => props.firstAnimationButton()}>First Animation</button>
        </div>
    )
}