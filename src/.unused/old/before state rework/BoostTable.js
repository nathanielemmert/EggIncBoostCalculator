import React from 'react';
import BoostCombo from "./BoostCombo";
import boostImages from "../Main/resources/BoostImages";
import {calculateAllBoostStats, getAllBoostCombos} from "../Main/calculateBoostStats";
import removeInsufficientBoostsForContract from "../Main/filterBoosts";




function BoostTable({settings}) {
    // let boostCombos = calculate_all_boost_combos('', 0, [], defaultSettings)//TODO: Memoize
    // filterNonOptimalBoostCombos(boostCombos)
    let boostCombos = getAllBoostCombos();
    calculateAllBoostStats(boostCombos, settings)
    removeInsufficientBoostsForContract(boostCombos, settings)


    let boostImgs = boostImages();
    let topPx = "0px"//"165px"
    return (
        <table>
            <thead>
            <tr style={{}}>
                <th style={{position: "sticky", top: topPx, background: "white"}}/>
                <th style={{position:"sticky", top:topPx, background:"white"}}>Boost Combo</th>
                <th style={{position:"sticky", top:topPx, background:"white"}}>Chickens Hatched</th>
                <th style={{"paddingLeft": "50px",position:"sticky", top:topPx, background:"white"}}>Token Cost</th>
                <th style={{"paddingLeft": "50px",position:"sticky", top:topPx, background:"white"}}>GE Cost</th>
                <th style={{"paddingLeft": "50px",position:"sticky", top:topPx, background:"white"}}>Eggs Layed</th>
                {/*<th>Token Cost</th>*/}
                {/*<th> <button  value = "ge_ratio">Chickens Hatched per GE spent</button> </th>*/}
                {/*<th style={{"paddingLeft": "50px", position:"sticky", top:topPx, background:"white"}}> Chickens Hatched per GE spent </th>*/}
                <th style={{"paddingLeft": "50px", position:"sticky", top:topPx, background:"white"}}>Time</th>
                {/*<th>Chickens Hatched per Token spent</th>*/}
            </tr>
            </thead>

            <tbody>{boostCombos.map(boostCombo => {return <BoostCombo key = {boostCombo.combo_id} boostCombo={boostCombo} boostImages={boostImgs} />})}</tbody>


        </table>
    );
}

export default BoostTable;