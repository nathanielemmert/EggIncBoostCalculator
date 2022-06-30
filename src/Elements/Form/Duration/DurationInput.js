import React from 'react';

function DurationInput({value,unit, handleChange}) {
    function onClick2(e){
        e.stopPropagation()

    }
    return (
        <div style={{textAlign:"left", display:"block", margin:"5px", width:"fit-content"}}>
            <input type={"number"} style={{width:"4em"}} onMouseDown={onClick2} value={value} onChange={handleChange} min={0}/> {(value === 1 ? unit : unit+"s") }
        </div>
    );
}

export default DurationInput;