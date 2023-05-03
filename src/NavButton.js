const NavButtons = ({start, end, next, previous, onpage})=>{
    return(
    <div className="d-flex justify-content-center my-2">
        {
            previous &&(
                <button className="btn mx-1 btn-sm btn-primary bi bi-arrow-left"
                onClick={()=> onpage("last", 'before "'+ start+' "')}></button>
            )
        }
        {
            next &&(
                <button className="btn mx-1 btn-sm btn-primary bi bi-arrow-right"
                onClick={()=> onpage("first", 'after "'+end+' "')}></button>
            )
        }
       
        
        </div> 
    )

}
export default NavButtons;