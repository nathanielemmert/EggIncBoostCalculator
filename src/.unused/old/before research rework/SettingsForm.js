import React, {useRef, useState, useTransition} from 'react';
import SettingsItem from "./SettingsItem";
import SettingsResearchItem from "./SettingsResearchItem";
import parseNumber from "../Main/helpers/parseNumber";
import getAllResearch from "../Main/resources/researches";
import {calculateEggLayingRate, calculateSettings} from "../Main/helpers/calculateSettings";



function SettingsForm({settings, setSettings}) {

    const [formState, setFormState] = useState(settings);
    console.log(formState)
    //const [isPending, startTransition] = useTransition();
    const interval = useRef(null);
    let changeForm = (newSettings,refreshTable, delay)=>{
        setFormState(newSettings)
        // clearTimeout(interval.current)//TODO: UNCOMMENT IMMEDIATELY
        // if(refreshTable) {
        //     interval.current = setTimeout(()=> {console.log("updated table");setSettings(newSettings)}, delay)
        // }
    }



    function handleChangeSetting(group,attr,e){//TODO: add support for number formats with suffixes
        let newValue = e.target.value;
        //dont update the table for invalid or unchanged values
        console.log(parseNumber(settings[group][attr].value) , parseNumber(newValue),parseNumber(settings[group][attr].value) === parseNumber(newValue))
        let refreshTable = !(Number.isNaN(parseNumber(newValue)) || parseNumber(settings[group][attr].value) === parseNumber(newValue))//TODO: also test if influenced value changed
        let newSettings = {...formState};  newSettings[group]={...formState[group]}; newSettings[group][attr]={...formState[group][attr]};
        newSettings[group][attr].value= newValue;
        calculateSettings(newSettings, newSettings[group][attr].influences, formState);
        changeForm(newSettings,refreshTable,1000);//TODO: delay should be 500
    }
    let settingsGroup = (groupName) => Object.entries(formState[groupName]).filter(([k,v])=>typeof v !=="function").map(([key,value])=> {
        return <SettingsItem key={key} id={key} props = {value} handleChange = {handleChangeSetting.bind(this, groupName, key)}/>
    })


    /*function handleChangeResearch(group, attr, e){
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
    })*/


    function handleChangeCalculated(group, attr, e){
        let newValue = e.target.value;
        //dont update the table for invalid or unchanged values
        let refreshTable = !(Number.isNaN(parseNumber(newValue)) || parseNumber(settings[group][attr].value) === parseNumber(newValue))
        let newSettings = {...formState};  newSettings[group]={...formState[group]}; newSettings[group][attr]={...formState[group][attr]};
        newSettings[group][attr].value= newValue;
        //calculateSettings(newSettings, newSettings[group][attr].influences, formState);//TODO: if you want to uncomment this line, make sure the list of dependencies for each calcsetting doesnt include itself
        changeForm(newSettings,refreshTable,500);
    }
    let calculatedGroup = (groupName) => Object.entries(formState[groupName]).filter(([k,v])=>(typeof v !=="function") && !v.hidden).map(([key,value])=> {
        return <SettingsItem key={key} id={key} props = {value} handleChange = {handleChangeCalculated.bind(this, groupName, key)}/>
    })

    function handleChangeResearch(group, attr, e){
        console.log(e.target.value)
        let newValue = e.target.value;

        let newSettings = {...formState};  newSettings[group]={...formState[group]}; newSettings[group][attr]={...formState[group][attr]};
        newSettings[group][attr].value= newValue;
        //calculateSettings(newSettings, newSettings[group][attr].influences, formState);
        setFormState(newSettings);
        console.log(newSettings)
    }
    let researchGroup = (groupName) => Object.entries(formState[groupName]).filter(([k,v])=>typeof v !=="function").map(([key,value])=> {
        return <SettingsResearchItem key={key} id={key} props = {value} handleChange = {handleChangeResearch.bind(this, groupName, key)}/>
    })

    return(
      <div>
          <form style={{display:"table"}}>
              ASDFASDDF
              {researchGroup("research")}
          </form>
      </div>
    );//TODO: this code shows all research from researches.json on screen with a slider.


    //TODO: Display options:   SHOW: Recommended boosts,                (optimal boosts)
    //                               all boosts that complete contract, (saladfork behavior)
    //                               all boosts                         (all possible combinations)

    //TODO: Give a title to each group of inputs

    //TODO: option to not display epic research within each group

    //TODO: once cash research calculation is implemented,
    // option to calculate each boost with and without a soul mirror, and see which is better

    //TODO: when contract time remaining is entered, start a countdown timer, with an "update time finished" button
    // that allows the user to update the time remaining to what it currently is, assuming an already started contract


    return (
        <div>
            <div style={{display:"inline-block",verticalAlign:"top", marginRight:"2em"}}>
                <div style={{display:"inline-block"}}>
                    <div style={{display:"inline-block",verticalAlign:"top"}}>
                        <form >
                            {settingsGroup("artifacts")}
                            {settingsGroup("stones")}
                            {/*{settingsGroup("manualSettings")}*/}
                        </form>
                    </div>
                    <div style={{display:"inline-block",verticalAlign:"top"}}>
                        <form >
                            {settingsGroup("contractSettings")}

                        </form>
                    </div>

                </div>

                <div>
                    <div style={{display:"inline-block"}}>
                        <form style={{display:"table"}}>
                            {researchGroup("research")}
                        </form>
                    </div>
                    <div style={{display:"inline-block",verticalAlign:"top"}}>
                        ______IHR RESEARCH_____
                    </div>
                    <div style={{display:"inline-block",verticalAlign:"top"}}>
                        ______HAB RESEARCH_____
                    </div>
                    <div style={{display:"inline-block",verticalAlign:"top"}}>
                        ______SHIPPING RESEARCH_____
                    </div>
                    <div style={{display:"inline-block",verticalAlign:"top"}}>
                        ______EPIC RESEARCH_____
                    </div>

                </div>

                <form style={{display:"table"}}>
                    {calculatedGroup("calculated")}
                </form>
            </div>




            <div>
                <div style={{display:"inline"}}><h1 style={{display:"inline"}}>Recommended Boosts:</h1></div>
                <h6 style={{display:"inline"}}>&nbsp;&nbsp;&nbsp;(Each boost combo is only shown if it is enough to complete the contract. Cheapest boosts are shown first, more expensive boosts are only shown if they complete the contract sooner than all cheaper boosts.)</h6>
            </div>
            {/*TODO:   Must include empty boost combo (no boosts used) for the calculator to be complete. */}
            {/*TODO:   e.g. if boosts wont help complete the contract sooner, show the empty boost instead of A*/}
            {/*TODO:   If no boosts are displayed, a detailed reason why must be displayed. */}
            {/*TODO:   Whether it is because boosts wont help finish sooner, or boosts arent enough because of hab limit, shipping limit, or egg laying rate isnt high enough, or cant get tokens quick enough*/}

        </div>
    );
}

export default SettingsForm;

