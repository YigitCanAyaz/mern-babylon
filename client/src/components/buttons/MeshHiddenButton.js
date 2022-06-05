export const MeshHiddenButton = (props) => {
    return (
        <div className='text-center'>
            <button style={{ "height": "60px", "width": "256px" }} type="button" className="bg-danger text-light border border-danger rounded" onClick={() => props.meshHiddenButton()}>Is Mesh Hidden?</button>
        </div>

    )
}