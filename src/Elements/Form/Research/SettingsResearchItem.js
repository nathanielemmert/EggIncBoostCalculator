import React, {startTransition, useEffect, useRef, useState, useTransition} from 'react';
import {calculateEggLayingRate} from "../../../Main/calculateSettings";

function SettingsResearchItem({ props, handleChange}) {
    let {value, serial_id, id, name, type, tier, categories, description, effect_type, levels, per_level, levels_compound, prices} = props

    //TODO: SLIDER CANNOT HANDLE RESEARCHES THAT COMPOUND PER LEVEL

    function changeResearch(e){
        let newValue=0
        if(e.target.type==="range") {//slider
            newValue=e.target.value*per_level
        }
        if(e.target.type==="number") {//box
            console.log(e.target.value)
            newValue=e.target.value
        }
        handleChange(roundFloat(newValue))
    }


    function roundFloat(f){
        f=Number(f)
        return parseFloat(f.toFixed(12)).toPrecision()
    }

    let leftLabel=''
    let rightLabel=''




    if(categories.indexOf("egg_laying_rate")>-1){
        if(effect_type==="multiplicative"){
            per_level*=100
            leftLabel='+'
            rightLabel='%'
        }
    }
    if(categories.indexOf("internal_hatchery_rate")>-1){
        if(effect_type==="additive"){
            leftLabel='+'
            rightLabel='/Hab/min'
        }
        if(effect_type==="multiplicative"){
            per_level*=100
            leftLabel='+'
            rightLabel='%'
        }
    }

    if(categories.indexOf("hab_capacity")>-1){
        if(effect_type==="multiplicative"){
            per_level*=100
            leftLabel='+'
            rightLabel='%'
        }
    }
    if(categories.indexOf("shipping_capacity")>-1){
        if(effect_type==="additive"){
            leftLabel='+'
            rightLabel='/HAB/MIN'
        }
        if(effect_type==="multiplicative"){
            per_level*=100
            leftLabel='+'
            rightLabel='%'
        }
    }








    let label = name + ": \u00A0"



    let sliderValue = Math.round(value/per_level);
    let sliderMax = levels
    let sliderStep=1

    let boxValue = value
    let boxMax=levels*per_level
    let boxStep = per_level



    //if(label==="") label = id + ": \u00A0";


    // if(!(value>=0 && value<=max && Math.floor(value*1000)%Math.floor(step*1000)===0))
    //     sliderValue=0

/*    return (
        <div style={{display:"table-row"}}>

            <label htmlFor={id} style={{display:"table-cell", float:"left"}}>{label}</label>
            <input type="range" value={sliderValue} id={id} min={0} max={sliderMax} step={sliderStep} style={{display:"inline-block", float:"left"}} onChange={changeResearch}/>

            <label htmlFor={id+"percent"} style={{display:"table-cell", float:"left"}}>{leftLabel}</label>
            <input type="number" value={boxValue} id={id+"percent"}  min="0" max={boxMax} step={boxStep} style={{display:"table-cell", float:"left",width: "4em"}} onChange={changeResearch}/>
            <label htmlFor={id+"percent"} style={{display:"table-cell", float:"left"}}>{rightLabel}</label>

        </div>
    );*/



    return (
        <div style={{display:"table-row", marginTop:"2px", marginBottom:"2px"}}>

            <div style={{display:"table-cell", textAlign:"right"}}>
                <label htmlFor={id}>{label}</label>
            </div>

            <div style={{display:"table-cell", textAlign:"right"}}>
                <input type="range" value={sliderValue} id={id} min={0} max={sliderMax} step={sliderStep} style={{display:"table-cell"}} onChange={changeResearch}/>

                <div style={{display:"inline-block"}}>
                    <label htmlFor={id+"percent"} >{leftLabel}</label>
                    <input type="number" value={boxValue} id={id+"percent"}  min="0" max={boxMax} step={boxStep} style={{width: "4em"}} onChange={changeResearch}/>
                    <label htmlFor={id+"percent"} >{rightLabel}</label>
                </div>

            </div>

        </div>
    );

}

export default SettingsResearchItem;