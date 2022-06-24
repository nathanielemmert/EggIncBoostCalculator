import React from 'react';
import SettingsResearchItem from "./SettingsResearchItem";

function SettingsResearchGroup({groupName, formState, appSettings, updateForm, updateMultipleForm, borderStyle}) {

    function underscoreToCamelCase(a){
        let capitalize = (a) => a.charAt(0).toUpperCase() + a.substring(1)
        return a.split("_").map((b,i)=>(i>0)?capitalize(b):b).join("")
    }

    function influences(v){
        return v.categories.split(",").map(underscoreToCamelCase)
    }

    function handleChangeResearch( group, attr, attrValues, newValue){
        updateForm(1000, group, attr, influences(attrValues), newValue)
    }

    function maxAllResearchInGroup(){
        let group = appSettings.research.map(r => appSettings[r]).filter(r =>displayResearch(r));

        let newValues = group.map((v)=>{
            return {
                group:"research",
                attr:v.id,
                influences:v.categories.split(",").map(underscoreToCamelCase),
                newValue:(v.levels_compound=== "multiplicative") ? v.per_level**v.levels : ((v.effect_type==='multiplicative')?100:1)*v.per_level*v.levels
            }
        })
        updateMultipleForm(500, newValues)
    }

    const epicResearchCategories = ["egg_laying_rate", "internal_hatchery_rate", "hab_capacity","shipping_capacity", "fleet_size"]
    function displayResearch(v){
        //console.log(v)
        if(groupName==='epic'){
            return v.categories.split(",").some(c => epicResearchCategories.includes(c))
                && v.type ==="epic"
                && v.id!=="int_hatch_calm"//TODO: UNCOMMENT IMMEDIATELY, PROPERLY IMPLEMENT INTERNAL HATCHERY CALM
        }
        else{
            return v.categories.split(",").includes(groupName)
                && v.type ==="common"
        }
    }


    let researchItems =  appSettings.research.map(r => appSettings[r])
                        .filter(r =>displayResearch(r))
                        .map((r)=> {
                            r.value = formState[r.id]
                            return <SettingsResearchItem  key = {r.id} props ={r} handleChange = {handleChangeResearch.bind(this, "research", r.id,r)}/>
                        })


    const researchGroupTitle = groupName.split("_").map(a => a.charAt(0).toUpperCase() + a.substring(1)).join(" ")+" Research"

    return <div style={borderStyle}>
        <b style={{display:"inline"}}>{researchGroupTitle}</b> <button onClick={maxAllResearchInGroup} style={{padding:"5px"}}>Max All</button>
        <form style={{display:"table", borderCollapse:"collapse"}}>
            {researchItems}
        </form>
    </div>

}

export default SettingsResearchGroup;