import React from 'react';
import formatNumber from "../Main/helpers/formatNumber";

function BoostCombo({boostCombo,boostImages}) {
//{combo_id:combo_id,used_boosts:used_boosts, hatched_chickens:hatched_chickens, ge_cost:ge_cost, ge_ratio:ge_ratio, max_duration:max_duration}
    //if(boostCombo.id==='')return (<tr> <td colSpan= {6}>Everything Below will produce more Chickens than can be housed</td> </tr>)

    return (

            <tr>
                <td>{boostCombo.combo_id}</td>
                <td style = {{display:"flex"}}>
                    {boostCombo.used_boosts.map((boost,index) => <img key={index} src = {boostImages[boost.img_data]} alt={''} title = {boost.name} />)}
                </td>
                <td align = "right">
                    {formatNumber(boostCombo.hatched_chickens,3)+"\u00A0🐔"}
                </td>
                <td align = "right">{Number(boostCombo.token_cost).toLocaleString()} <img src = {boostImages[11]}  alt={"Tokens"}/></td>
                <td align = "right">{Number(boostCombo.ge_cost).toLocaleString()} <img src = {boostImages[10]}  alt={"GE"}/></td>
                <td align = "right">{formatNumber(boostCombo.eggs_layed,1)}</td>
                {/*<th>Token Cost</th>*/}
                <td align = "right">{Number(Math.floor(boostCombo.ge_ratio)).toLocaleString()}</td>
                <td style={{"paddingLeft": "50px"}}>{boostCombo.max_duration}m</td>
                {/*<th>Chickens Hatched per Token spent</th>*/}
            </tr>

    );
}

export default BoostCombo;