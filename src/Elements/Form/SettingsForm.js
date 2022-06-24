import React, {useRef, useState, useTransition} from 'react';
import SettingsItem from "./Settings/SettingsItem";
import SettingsResearchItem from "./Research/SettingsResearchItem";
import parseNumber from "../../Main/helpers/parseNumber";
import getAllResearch from "../../Main/resources/researches";
import {calculateEggLayingRate, calculateSettings} from "../../Main/calculateSettings";
import SettingsResearchGroup from "./Research/SettingsResearchGroup";
import SettingsArtifactGroup from "./Artifacts/SettingsArtifactGroup";
import SettingsGroup from "./Settings/SettingsGroup";
import VehicleSelector from "./Vehicles/VehicleSelector";
import HabSelector from "./Habs/HabSelector";
import StoneSelector from "./Stones/StoneSelector";
import DailyEventSelector from "./Daily Events/DailyEventSelector";



function SettingsForm({appState, appSettings, setAppState}) {

    const [formState, setFormState] = useState(appState);
    console.log(formState)
    //const [isPending, startTransition] = useTransition();
    const interval = useRef(null);
    let changeForm = (newState,refreshTable, delay)=>{
        setFormState(newState)
        // clearTimeout(interval.current)//TODO: UNCOMMENT IMMEDIATELY
        // if(refreshTable) {
        //     interval.current = setTimeout(()=> {console.log("updated table");setSettings(newSettings)}, delay)
        // }
    }


    let updateForm = (delay, group, attr, influences, newValue)=>{

        updateMultipleForm(delay,[{group, attr, influences, newValue}])
    }

    let updateMultipleForm = (delay, newValues)=>{
        console.log("UPDATE MULTIPLE FORM",newValues)
        let newState = {...formState};
        let refreshTable=false;
        for(let v of newValues){
            let {group, attr, influences, newValue} = v;
            refreshTable = refreshTable || (!(Number.isNaN(parseNumber(newValue)) || parseNumber(appState[attr]) === parseNumber(newValue)))//TODO: also test if influenced value changed
            newState.setValue(attr,newValue)//TODO: VERY IMPORTANT LINE, SETS PROPER NUMERICAL VALUES
            calculateSettings(newState,appSettings, influences);
        }
        changeForm(newState, refreshTable, delay)

    }


    function handleSubmitButton(){
        setAppState(formState)
        console.log("updated table")
    }



    //TODO: Display options:   SHOW: Recommended boosts,                (optimal boosts)
    //                               all boosts that complete contract, (saladfork behavior)
    //                               all boosts                         (all possible combinations)

    //TODO: Give a title to each group of inputs

    //TODO: option to not display epic research within each group

    //TODO: once cash research calculation is implemented,
    // option to calculate each boost with and without a soul mirror, and see which is better

    //TODO: when contract time remaining is entered, start a countdown timer, with an "update time finished" button
    // that allows the user to update the time remaining to what it currently is, assuming an already started contract

    let     researchGroupBorderStyle = {display:"inline-block",verticalAlign:"top",    margin:"10px", textAlign:"center", borderCollapse:"collapse", border:"1px solid black"};
    let epicResearchGroupBorderStyle = {display:"inline-block",verticalAlign:"middle", margin:"10px", textAlign:"center", borderCollapse:"collapse", border:"1px solid black"};
    let     settingsGroupBorderStyle = {display:"inline-block",verticalAlign:"middle", margin:"10px", textAlign:"center"}
    let     artifactGroupBorderStyle = epicResearchGroupBorderStyle;



    return (
        <div style={{margin:"10px"}}>
            <div style={{display:"inline-block",verticalAlign:"top", marginRight:"2em"}}>

                <div>
                    <HabSelector  formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={artifactGroupBorderStyle}/>
                    <SettingsResearchGroup groupName={"internal_hatchery_rate"} formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={researchGroupBorderStyle}/>
                    <SettingsResearchGroup groupName={"hab_capacity"}           formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={researchGroupBorderStyle}/>
                </div>
                <div>
                    <VehicleSelector  formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={artifactGroupBorderStyle}/>
                    <SettingsResearchGroup groupName={"egg_laying_rate"}        formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={researchGroupBorderStyle}/>
                    <SettingsResearchGroup groupName={"shipping_capacity"}      formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={researchGroupBorderStyle}/>
                    <SettingsResearchGroup groupName={"fleet_size"}             formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={researchGroupBorderStyle}/>
                    {/*TODO: research for fleet_size, also add code for number of habs*/}
                </div>
                <div>
                    <SettingsResearchGroup groupName={"epic"}      formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={epicResearchGroupBorderStyle}/>
                    <SettingsArtifactGroup groupName={"artifacts"} formState={formState} appSettings={appSettings} updateForm={updateForm} borderStyle={artifactGroupBorderStyle} />
                    <StoneSelector  formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={artifactGroupBorderStyle}/>
                    <DailyEventSelector  formState={formState} appSettings={appSettings} updateForm={updateForm} updateMultipleForm={updateMultipleForm} borderStyle={artifactGroupBorderStyle}/>
                    {/*TODO: ADD STONES INPUT*/}
                </div>



                <div style={{border:"1px solid black", width:"fit-content", margin: "10px"}}>
                    <div>
                        <div style={{display:"inline"}}><h2 style={{display:"inline"}}>Required values:</h2></div>
                        <h6 style={{display:"inline"}}>&nbsp;&nbsp;&nbsp;(Required values can be manually entered, or calculated using the inputs above. Blank values are assumed to be zero)</h6>
                        <div>Note: <i>Currently</i>, Hab capacity assumes 4 Universe Habs, Shipping capacity assumes 17 hyperloops with 5 cars each</div>
                    </div>

                    <SettingsGroup groupName={"calculated"} title={"Farm Stats"} formState={formState} appSettings={appSettings} updateForm={updateForm} borderStyle={settingsGroupBorderStyle}/>
                    <SettingsGroup groupName={"contractSettings"} title={"Contract Settings"} formState={formState} appSettings={appSettings} updateForm={updateForm} borderStyle={settingsGroupBorderStyle}/>

                </div>

                <button style={{marginLeft:"10px", fontSize:"2em"}} onClick={handleSubmitButton}>Submit</button>

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

