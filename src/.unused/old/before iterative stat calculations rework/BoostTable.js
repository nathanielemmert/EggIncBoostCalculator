import React from 'react';
import BoostCombo from "./BoostCombo";
import boostImages from "../Main/resources/BoostImages";
import {calculateAllBoostStats, getAllBoostCombos} from "../Main/calculateBoostStats";
import sortAndFilterBoosts from "../Main/sortAndFilterBoosts";





function BoostTable({settings}) {
    //TODO: Memoize functions
    //TODO: include empty boost combo ""
    let boostCombos = getAllBoostCombos()//.filter(boostCombo => boostCombo.combo_id==='E X'||boostCombo.combo_id==='E W W W W')//.filter(boostCombo => boostCombo.combo_id==='A E W X X');//TODO: REMOVE DEBUG FILTER

    calculateAllBoostStats(boostCombos, settings)

    /*//Only show sufficient boosts in the table
    let {eggsRemaining} = settings.contractSettings.getValues();
    boostCombos = boostCombos.filter(boostCombo => {if(boostCombo.stats.eggs_layed>eggsRemaining && boostCombo.stats.timeFinished===undefined) console.warn("TIME FINISHED NOT CALCULATED PROPERLY",boostCombo.combo_id);return boostCombo.stats.eggs_layed>=eggsRemaining})

    sortAndFilterBoosts(boostCombos, settings)

    for(let boostCombo of boostCombos){
        console.log(boostCombo)
    }*/



    let boostImgs = boostImages();
    let topPx = "0px"//"165px"
    return (
        <table>
            <thead>
            <tr style={{}}>
                <th style={{position: "sticky", top: topPx, background: "white"}}/>
                <th style={{position:"sticky", top:topPx, background:"white"}}>
                    Boost Combo
                </th>

                <th style={{position:"sticky", top:topPx, background:"white"}}>
                    Chickens Hatched {/*Number of Chickens hatched during the boost. If your habs fill during the boost, this number is limited by the hab capacity.*/}
                </th>

                <th style={{"paddingLeft": "50px",position:"sticky", top:topPx, background:"white"}}>
                    Token Cost {/*Number of tokens required to use all of the boosts*/}
                </th>

                <th style={{"paddingLeft": "50px",position:"sticky", top:topPx, background:"white"}}>
                    GE Cost {/*Number of Golden Eggs required to purchase each boost. Doesnt include any discounts*/}
                </th>

                <th style={{"paddingLeft": "50px",position:"sticky", top:topPx, background:"white"}}>
                    Eggs Laid {/*Total number of eggs laid by the end of the contract TODO: shouldnt include initial eggs laid?*/}
                </th>

                <th style={{"paddingLeft": "50px", position:"sticky", top:topPx, background:"white"}}>
                    Time Finished {/*How long it will take to complete the contract using these boosts, including the time it takes to earn enough tokens, if you dont already have enough*/}
                </th>

                <th style={{"paddingLeft": "50px", position:"sticky", top:topPx, background:"white"}}>
                    Boost Duration {/*Length of the longest boost in each boost combo*/}
                </th>

            </tr>
            </thead>

            <tbody>{boostCombos.map(boostCombo => {return <BoostCombo key = {boostCombo.combo_id} boostCombo={boostCombo} boostImages={boostImgs} />})}</tbody>


        </table>
    );
}

export default BoostTable;