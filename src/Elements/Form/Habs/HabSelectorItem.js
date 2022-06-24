import React, {useState} from 'react';

function HabSelectorItem({ hab, lastHab, formState, appSettings, handleChange}) {


    let maxHabs = 4

    let habNameWidth = 0
    appSettings.habs.forEach(hab =>{
        habNameWidth=Math.max(habNameWidth,appSettings[hab].name.length)
    })



    let numHabsUsed=0
    let habOptions = [["",{name:""}],...Object.entries(appSettings.getGroup("habs")).reverse()].filter(([habName,{name}]) =>{
        if(habName==="")return true
        else numHabsUsed+=formState.values[habName]
        if(habName===hab)return true
        if(formState[habName]>0)return false
        return true
    }).map(([habName,]) =>{
        let hab= (habName!=="")?appSettings[habName] : {name:"",id:""}
        return <option key={hab.id} value={hab.id}>{hab.name}</option>
    })

    let habSelector = (
        <select name="hab" id="hab" style={{alignItems:"left", width:habNameWidth/2+2+"em"}} onChange={handleChange} value={hab}>
            {habOptions}
        </select>
    )



    let habQuantityOptions = null
    if(hab!=="") {
        habQuantityOptions = [...Array(Math.max(0, maxHabs - numHabsUsed+formState.values[hab]) + 1).keys()]
        if (!habQuantityOptions.includes(formState.values[hab])) habQuantityOptions = [...habQuantityOptions, formState[hab]]
        habQuantityOptions = habQuantityOptions.map((number) => <option key={number} value={number}>{number}</option>)
    }

    let habQuantitySelector = (
        (hab==="")?null:
            <div style={{display:"inline"}}>
                <label htmlFor={"hab_quantity"}>x</label>
                <select name={"hab_quantity"} id={"hab_quantity"} style={{alignItems:"left", width:"3em"}} onChange={handleChange} value={formState[hab]}>
                    {habQuantityOptions}
                </select>
            </div>
        // <input type="number" value={formState[hab]} id={"hab_quantity"}  min={lastHab?1:0} max={fleetSize} step={1} style={{width: "4em"}} onChange={handleChange}/>
    )



    return(
        <form style={{display:"table", borderCollapse:"collapse"}}>
            {habSelector}
            {habQuantitySelector}
        </form>
    );








    /*return  <form style={{display:"table-row", marginTop:"2px", marginBottom:"2px", textAlign:"left"}}>
         <label htmlFor={hab} style={{display:"table-cell", textAlign:"right"}}>{label}</label>
         <select name="tier" id="tier" style={{alignItems:"left"}} onChange={handleChangeSelectedArtifact}>
             <option key={""} value={""}>{""}</option>
             {artifacts[hab].tiers.map(tier =>
                 <option key={tier.name} value={tier.id}>{"T"+tier.id+" ("+tier.name+") "}</option>
             )}
         </select>
 
         {(artifacts[hab].tiers[state.tier-1]==null)?null:
             <select name="rarity" id="rarity" style={{alignItems:"left"}} onChange={handleChangeSelectedArtifact} value={selectedRarity}>
                 {artifacts[hab].tiers[state.tier-1].rarities.map(rarity =>
                     <option key={rarity.name} value={rarity.id}>{rarity.name}</option>
                 )}
             </select>
         }
         <label htmlFor={hab} style={{ textAlign:"left"}}>{effectLabel}</label>
     </form>*/
}

export default HabSelectorItem;