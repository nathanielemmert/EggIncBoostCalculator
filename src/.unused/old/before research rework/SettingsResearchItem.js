import React, {startTransition, useEffect, useRef, useState, useTransition} from 'react';
import {calculateEggLayingRate} from "../Main/helpers/calculateSettings";

function SettingsResearchItem({id, props, handleChange}) {
    let {value, step, max, label} = props

    console.log(id, props)





    //const researchState = {val:value};

    if(label==="") label = id + ": \u00A0";

    let sliderValue=value;
    // if(!(value>=0 && value<=max && Math.floor(value*1000)%Math.floor(step*1000)===0))
    //     sliderValue=0




    return (
        <div style={{display:"table-row"}}>

            <label htmlFor={id} style={{display:"table-cell", textAlign:"right"}}>{label}</label>
            <input type="range" value={sliderValue} id={id} min="0" max={max} step={step} style={{display:"table-cell"}} onChange={handleChange}/>

            <label htmlFor={id+"percent"} style={{display:"table-cell", textAlign:"right"}}>{"+"}</label>
            <input type="number" value={value} id={id+"percent"}  min="0" max={max} step={step} style={{width: "4em"}} onChange={handleChange}/>
            <label htmlFor={id+"percent"} style={{display:"table-cell", textAlign:"right"}}>{"%"}</label>

        </div>
    );

}

export default SettingsResearchItem;