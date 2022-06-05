export const ThirdAnimationButton = (props) => {
    return (
        <div className='col-md'>
            <button style={{ "height": "60px", "width": "256px" }} type="button" className="bg-light text-dark border border-primary" onClick={() => props.thirdAnimationButton()}>Third Animation</button>
        </div>
    )
}