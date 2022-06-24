import React from 'react';
import formatNumber from "../Main/helpers/formatNumber";
import formatMinutesAsDHM from "../Main/helpers/formatMinutesAsDHM";

function BoostCombo({boostCombo,boostImages}) {
//{combo_id:combo_id,used_boosts:used_boosts, hatched_chickens:hatched_chickens, ge_cost:ge_cost, ge_ratio:ge_ratio, max_duration:max_duration}
    //if(boostCombo.id==='')return (<tr> <td colSpan= {6}>Everything Below will produce more Chickens than can be housed</td> </tr>)
    const {used_boosts, chickens_hatched_during, ge_cost, token_cost, max_duration, eggs_layed, timeFinished} = boostCombo.stats;
    return (

            <tr>
                <td>{boostCombo.combo_id.replaceAll(" ","")}</td>
                <td align="right" style = {{display:"flex", flexDirection: "row-reverse"}}>
                    {used_boosts.map((boost,index) => <img key={index} src = {boostImages[boost.img_data]} alt={''} title = {boost.name} />).reverse()}
                </td>
                <td align = "right">
                    {formatNumber(chickens_hatched_during,3)} 🐔
                </td>
                <td align = "right">{Number(token_cost).toLocaleString()} <img src = {boostImages[11]}  alt={"Tokens"}/></td>
                <td align = "right">{Number(ge_cost).toLocaleString()} <img src = {boostImages[10]}  alt={"GE"}/></td>
                <td align = "right">{formatNumber(eggs_layed,1)}</td>

                {/*<td align = "right">{Number(Math.floor(boostCombo.ge_ratio)).toLocaleString()}</td>*/}
                <td style={{"paddingLeft": "50px"}}>{formatMinutesAsDHM(timeFinished)}</td>
                <td style={{"paddingLeft": "50px"}}>{max_duration}m</td>
                {/*<th>Chickens Hatched per Token spent</th>*/}
            </tr>
    );

    //TODO: add time until habs fill, time until shipping fills as stat


    //TODO: Consider having a population vs time graph, eggs laid vs time graph for each boost combo.
    //TODO:  the user can click on a single boost combo to view more details for just that boost combo.
    //TODO:  they can click on a specific time range on that graph, and add an event, like a chicken box, more research, or another boost, to see how that would affect their chances



    //TODO: "each extra minute it takes you to get to this level of research then boost and close the app adds ___m to the time finished" (if any initial chickens, it might be less than 1m)
    //TODO: each level of IHR you miss adds ___m and each level of egg laying rate you miss adds ___m (also include time subtracted from extra research)




    // TODO: "each extra minute it takes you to get to this level of research after the boost then close the app adds ___m to the time finished" (probably less than 1m



}

export default BoostCombo;