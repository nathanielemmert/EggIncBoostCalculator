import React, {useEffect, useRef, useState} from 'react';
import DurationDisplay from "./DurationDisplay";
import DurationInput from "./DurationInput";

function DurationPicker({id, formState, updateForm}) {


    // const [display, setDisplay] = useState(false);
   /* useEffect(() => {//TODO: update component state whenever props change
        changePanel(data);
    }, [data]);*/
    let timeMinutes = Number(formState[id])  || 0

    let minutes = Number(timeMinutes);
    let d = Math.floor(minutes / (60*24));
    let h = Math.floor(minutes % (60*24) / 60);
    let m = Math.floor(minutes % 60);
    let s = Math.round((minutes % 1)*60);
    console.log("MINUTES:",minutes)
    console.log(d,h,m,s)

    let stateValues = {
        day:d,
        hour:h,
        minute:m,
        second:s
    }

    function handleChangeValue(stateValues,unit,e){
        console.log("NEW FORM CHANGE",stateValues,unit,e.target.value)
        stateValues[unit]=Number(e.target.value)
        let {day, hour, minute, second} = stateValues
        console.log("DHMS",day,hour,minute,second)
        let newMinutes = 24*60*day + 60*hour  +minute + (1/60)*second
        updateForm(500, "group", id, [], newMinutes)
    }



    const ref = useRef();

    const isMenuOpen = !!formState["display_duration_picker_"+id]
    const setIsMenuOpen = (bool)=>updateForm(0, "group", "display_duration_picker_"+id, [], bool)

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", checkIfClickedOutside);

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className="wrapper" ref={ref} style={{display:"inline",width:"fit-content"}}>
            <div
                className="button"
                onClick={() => setIsMenuOpen((oldState) => !oldState)}
                style={{display:"block", width:"fit-content", border:"1px solid black", cursor:"pointer"}}
            >
                <DurationDisplay value={d} unit={"day"} />
                <DurationDisplay value={h} unit={"hour"}/>
                <DurationDisplay value={m} unit={"minute"}/>
                <DurationDisplay value={s} unit={"second"}/>
            </div>
            {isMenuOpen && (
                <div style={{display:"block", width:"fit-content", zIndex:1, position:"absolute", background:"white", border:"1px solid black"}}>
                    {Object.keys(stateValues).map(unit =><DurationInput key={unit} value={stateValues[unit]} unit={unit} handleChange={handleChangeValue.bind(this, {...stateValues},unit)}/>)}
                </div>
            )}
        </div>
    );



}

export default DurationPicker;