import React, {useRef, useState} from 'react';


function SettingsItem({id, props, handleChange}) {
    //console.log(id,props)
    let {value, defaultValue, label, rightLabel} = props;

    const itemState = {val:value}


    if(label==="") {
        label = id + ": \u00A0";
        rightLabel="%"
    }
    if(typeof defaultValue!="string")defaultValue=''

    return (
        <div style={{display:"table-row"}}>
            <label htmlFor={id} style={{display:"table-cell", textAlign:"right"}}>{label}</label>
            <input id={id} value={itemState.val} type="text" autoComplete={"off"} style={{display:"table-cell"}}  onChange={handleChange} size={6}/>{/*USE ONBLUR TO ONLY UPDATE ON FOCUS LOSS*/}
            <label htmlFor={id} style={{display:"table-cell", textAlign:"left"}}>{rightLabel}</label>
        </div>

    );
}

export default SettingsItem;