import React from 'react';
import SettingsItem from "./SettingsItem";
import parseNumber from "../../../Main/helpers/parseNumber";
import {calculateSettings} from "../../../Main/calculateSettings";
import DurationPicker from "../Duration/DurationPicker";

function SettingsGroup({groupName, title, formState, appSettings, updateForm, borderStyle}) {

    function underscoreToCamelCase(a){
        let capitalize = (a) => a.charAt(0).toUpperCase() + a.substring(1)
        return a.split("_").map((b,i)=>(i>0)?capitalize(b):b).join("")
    }





    function handleChangeSetting( group, attr, attrValues, e){
        updateForm(1000, group, attr, appSettings[attr].influences, e.target.value)
    }

    return <div style={borderStyle}>
        <b>{title}</b>
        <form >
            <div>
                {Object.entries(appSettings.getGroup(groupName)).filter(([settingName,settings]) => !settings.hidden).map(([settingName,settings]) => {
                    settings.value = formState[settingName]
                    if(settingName==='timeRemaining')return (
                        <div style={{display:"table-row"}}>
                            <label htmlFor={settingName} style={{display:"table-cell", textAlign:"right"}}>{"Time Remaining:"}</label>
                            <div style={{display:"table-cell"}}>
                                <DurationPicker formState={formState} updateForm={updateForm} id={"timeRemaining"}/>
                            </div>
                        </div>
                        )
                    return <SettingsItem key={settingName}
                                         id={settingName}
                                         props={settings}
                                         handleChange = {handleChangeSetting.bind(this, groupName, settingName,settings)}/>
                })}
            </div>
        </form>
    </div>



}

export default SettingsGroup;