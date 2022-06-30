import React from 'react';

function DurationDisplay({value,unit}) {
    return (
        <div style={{textAlign:"center", display:"inline-block", margin:"5px"}}>
            {value}
            <br/>
            <div style={{fontSize:"75%"}}>{(value === 1 ? unit : unit+"s")}</div>
        </div>
    );
}

export default DurationDisplay;