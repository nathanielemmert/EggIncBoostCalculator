import DailyEventSelectorItem from "./DailyEventSelectorItem";


let dailyEvents = {
    boost_time: {
        "id": "boost_time",
        "name": "Boost time 2x",
        "categories": "boost_duration",
        "description": "Increases Boost Duration",
        "effect_type": "multiplicative",
        "levels_compound": "multiplicative",
        per_level:100
    }
}

function DailyEventSelector({ formState, appSettings, updateForm, updateMultipleForm, borderStyle}) {
    function underscoreToCamelCase(a){
        let capitalize = (a) => a.charAt(0).toUpperCase() + a.substring(1)
        return a.split("_").map((b,i)=>(i>0)?capitalize(b):b).join("")
    }
    function influences(v){
        v = appSettings[v]
        return v.categories.split(",").map(underscoreToCamelCase)
    }

    function handleChangeSelectedDailyEvent(dailyEvent,e){
        console.log("CHANGE SELECTED",dailyEvent,e)
        let id = e.target.id

        let newDailyEvent=e.target.value


        if(dailyEvent===""){updateMultipleForm(1000,[{group:"dailyEvents", attr:newDailyEvent, influences:influences(newDailyEvent), newValue:1}]);return}
        if(newDailyEvent===""){updateMultipleForm(1000,[{group:"dailyEvents", attr:dailyEvent, influences:influences(dailyEvent), newValue:0}]);return}

        //if changing the dailyEvent, set the current dailyEvent to 0, set new dailyEvent to values
        let newValues = [
            {group:"dailyEvents", attr:newDailyEvent, influences:influences(newDailyEvent), newValue:formState[dailyEvent]},
            {group:"dailyEvents", attr:dailyEvent, influences:influences(dailyEvent), newValue:0}
        ]
        updateMultipleForm(1000, newValues)
    }

    let maxDailyEvents = 9999

    let numDailyEventsUsed=0
    let dailyEventList = formState.dailyEvents.filter((dailyEventName)=>{
        numDailyEventsUsed+=formState.values[dailyEventName]
        return (formState[dailyEventName] > 0)
    })
    if(dailyEventList.length<formState.dailyEvents.length)dailyEventList.push("")
    dailyEventList=dailyEventList.map(dailyEventName =>{
        let dailyEventID= (dailyEventName==="")?"":appSettings[dailyEventName].id
        return <DailyEventSelectorItem key={dailyEventName}
                                dailyEvent={dailyEventID}
                                formState={formState}
                                handleChange={handleChangeSelectedDailyEvent.bind(this,dailyEventName)}
                                appSettings={appSettings} />

    })



    return(
        <div style={borderStyle}>{/*TODO: make sure last dailyEvent cant be removed*/}
            <b style={{display:"inline"}}>Select Daily Events:</b>
            {!(numDailyEventsUsed===maxDailyEvents)?null:<div>MAX DailyEventS</div>}
            {(numDailyEventsUsed<=maxDailyEvents)?null:<div style={{color:"red"}}>TOO MANY DailyEventS SELECTED</div>}
            {dailyEventList}
        </div>
    )


}

export default DailyEventSelector;