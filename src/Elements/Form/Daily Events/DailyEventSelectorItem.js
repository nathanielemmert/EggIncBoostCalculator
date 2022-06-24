import React, {useState} from 'react';



function DailyEventSelectorItem({ dailyEvent, lastDailyEvent, formState, appSettings, handleChange}) {


    let maxDailyEvents = 4

    let dailyEventNameWidth = 0
    appSettings.dailyEvents.forEach(dailyEvent =>{
        dailyEventNameWidth=Math.max(dailyEventNameWidth,appSettings[dailyEvent].name.length)
    })



    let numDailyEventsUsed=0
    let dailyEventOptions = [["",{name:""}],...Object.entries(appSettings.getGroup("dailyEvents")).reverse()].filter(([dailyEventName,{name}]) =>{
        if(dailyEventName==="")return true
        else numDailyEventsUsed+=formState.values[dailyEventName]
        if(dailyEventName===dailyEvent)return true
        if(formState[dailyEventName]>0)return false
        return true
    }).map(([dailyEventName,]) =>{
        let dailyEvent= (dailyEventName!=="")?appSettings[dailyEventName] : {name:"",id:""}
        return <option key={dailyEvent.id} value={dailyEvent.id}>{dailyEvent.name}</option>
    })

    let dailyEventSelector = (
        <select name="dailyEvent" id="dailyEvent" style={{alignItems:"left", width:dailyEventNameWidth/2+2+"em"}} onChange={handleChange} value={dailyEvent}>
            {dailyEventOptions}
        </select>
    )





    let dailyEventQuantitySelector = null



    return(
        <form style={{display:"table", borderCollapse:"collapse"}}>
            {dailyEventSelector}
            {dailyEventQuantitySelector}
        </form>
    );


}

export default DailyEventSelectorItem;