import React, {useRef, useState, useTransition} from 'react';
import SettingsItem from "./SettingsItem";
import SettingsResearchItem from "./SettingsResearchItem";
import parseNumber from "../Main/helpers/parseNumber";
import getAllResearch from "../Main/resources/researches";
import {calculateEggLayingRate, calculateSettings} from "../Main/helpers/calculateSettings";



function SettingsForm({settings, setSettings}) {

    const [formState, setFormState] = useState(settings);
    //const [isPending, startTransition] = useTransition();
    const interval = useRef(null);
    let changeForm = (newSettings,refreshTable, delay)=>{
        setFormState(newSettings)
        clearTimeout(interval.current)
        if(refreshTable) {
            //console.log(newSettings)
            interval.current = setTimeout(()=> {console.log("updated table");setSettings(newSettings)}, delay)
        }
    }



    function handleChangeSetting(group,attr,e){//TODO: add support for number formats with suffixes
        let newValue = e.target.value;
        //dont update the table for invalid or unchanged values
        console.log(parseNumber(settings[group][attr].value) , parseNumber(newValue),parseNumber(settings[group][attr].value) === parseNumber(newValue))
        let refreshTable = !(Number.isNaN(parseNumber(newValue)) || parseNumber(settings[group][attr].value) === parseNumber(newValue))//TODO: also test if influenced value changed
        let newSettings = {...formState};  newSettings[group]={...formState[group]}; newSettings[group][attr]={...formState[group][attr]};
        newSettings[group][attr].value= newValue;
        calculateSettings(newSettings, newSettings[group][attr].influences, formState);
        changeForm(newSettings,refreshTable,500);
    }
    let settingsGroup = (groupName) => Object.entries(formState[groupName]).filter(([k,v])=>typeof v !=="function").map(([key,value])=> {
        return <SettingsItem key={key} id={key} props = {value} handleChange = {handleChangeSetting.bind(this, groupName, key)}/>
    })


    function handleChangeResearch(group, attr, e){
        let newValue = e.target.value;
        //dont update the table for invalid or unchanged values
        let refreshTable = !(Number.isNaN(parseNumber(newValue)) || parseNumber(settings[group][attr].value) === parseNumber(newValue))
        let newSettings = {...formState};  newSettings[group]={...formState[group]}; newSettings[group][attr]={...formState[group][attr]};
        newSettings[group][attr].value= newValue;
        calculateSettings(newSettings, newSettings[group][attr].influences, formState);
        changeForm(newSettings,refreshTable,1000);
    }
    let researchGroup = (groupName) => Object.entries(formState[groupName]).filter(([k,v])=>typeof v !=="function").map(([key,value])=> {
        return <SettingsResearchItem key={key} id={key} props = {value} handleChange = {handleChangeResearch.bind(this, groupName, key)}/>
    })

    function handleChangeCalculated(group, attr, e){
        let newValue = e.target.value;
        //dont update the table for invalid or unchanged values
        let refreshTable = !(Number.isNaN(parseNumber(newValue)) || parseNumber(settings[group][attr].value) === parseNumber(newValue))
        let newSettings = {...formState};  newSettings[group]={...formState[group]}; newSettings[group][attr]={...formState[group][attr]};
        newSettings[group][attr].value= newValue;
        //calculateSettings(newSettings, newSettings[group][attr].influences, formState);//TODO: if you want to uncomment this line, make sure the list of dependencies for each calcsetting doesnt include itself
        changeForm(newSettings,refreshTable,500);
    }
    let calculatedGroup = (groupName) => Object.entries(formState[groupName]).filter(([k,v])=>typeof v !=="function").map(([key,value])=> {
        return <SettingsItem key={key} id={key} props = {value} handleChange = {handleChangeCalculated.bind(this, groupName, key)}/>
    })

    // return(
    //   <div>
    //       <form style={{display:"table"}}>
    //           {getAllResearch().map((research)=> {
    //               return <SettingsResearchItem key={research["id"]} id={research["id"]} props ={{value:0, step:research["per_level"]*100, max:research["per_level"]*100*research["levels"], label:research["name"]}} handleChangeSetting = {console.log}/>
    //           })}
    //       </form>
    //   </div>
    // );//TODO: this code shows all research from researches.json on screen with a slider.



    return (
        <div>
            <div style={{display:"inline-block",verticalAlign:"top", marginRight:"2em"}}>
                <form >
                    {settingsGroup("artifacts")}
                    {settingsGroup("stones")}
                    {/*{settingsGroup("manualSettings")}*/}
                </form>
                <div>
                    <form style={{display:"table"}}>
                        {researchGroup("research")}
                    </form>
                </div>
                <form style={{display:"table"}}>
                    {calculatedGroup("calculated")}
                </form>
            </div>

            <div style={{display:"inline-block",verticalAlign:"top"}}>
                <form style={{display:"table"}}>
                    {settingsGroup("contractSettings")}
                </form>
            </div>
        </div>
    );
}

export default SettingsForm;

