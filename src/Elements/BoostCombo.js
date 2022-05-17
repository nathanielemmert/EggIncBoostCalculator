import React from 'react';
import formatNumber from "../Main/helpers/formatNumber";

function BoostCombo({boostCombo,boostImages}) {
//{combo_id:combo_id,used_boosts:used_boosts, hatched_chickens:hatched_chickens, ge_cost:ge_cost, ge_ratio:ge_ratio, max_duration:max_duration}
    //if(boostCombo.id==='')return (<tr> <td colSpan= {6}>Everything Below will produce more Chickens than can be housed</td> </tr>)
    const {used_boosts, hatched_chickens, ge_cost, token_cost, max_duration, eggs_layed} = boostCombo.stats;
    return (

            <tr>
                <td>{boostCombo.combo_id.replaceAll(" ","")}</td>
                <td align="right" style = {{display:"flex", flexDirection: "row-reverse"}}>
                    {used_boosts.map((boost,index) => <img key={index} src = {boostImages[boost.img_data]} alt={''} title = {boost.name} />).reverse()}
                </td>
                <td align = "right">
                    {formatNumber(hatched_chickens,3)} 🐔
                </td>
                <td align = "right">{Number(token_cost).toLocaleString()} <img src = {boostImages[11]}  alt={"Tokens"}/></td>
                <td align = "right">{Number(ge_cost).toLocaleString()} <img src = {boostImages[10]}  alt={"GE"}/></td>
                <td align = "right">{formatNumber(eggs_layed,1)}</td>

                {/*<td align = "right">{Number(Math.floor(boostCombo.ge_ratio)).toLocaleString()}</td>*/}
                <td style={{"paddingLeft": "50px"}}>{max_duration}m</td>
                {/*<th>Chickens Hatched per Token spent</th>*/}
            </tr>

    );
}

export default BoostCombo;