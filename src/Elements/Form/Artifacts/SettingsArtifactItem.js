import React, {useState} from 'react';
import parseNumber from "../../../Main/helpers/parseNumber";
import {calculateSettings} from "../../../Main/calculateSettings";
import SettingsItem from "../Settings/SettingsItem";

const artifacts = {
    gusset:{
        "id": "gusset",
        "name": "Gusset",
        "categories": "hab_capacity",
        "description": "Increases hen house capacity",
        "effect_type": "multiplicative",
        "levels_compound": "additive",
        tiers:[
            {
                id:1,
                name:"Plain",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:5
                    }
                ]
            },
            {
                id:2,
                name:"Ornate",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:10
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:12
                    }
                ]
            },
            {
                id:3,
                name:"Distegguished",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:15
                    },
                    {
                        id:1,
                        name:"Rare",
                        per_level:16
                    }
                ]
            },
            {
                id:4,
                name:"Jeweled",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:20
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:22
                    },
                    {
                        id:3,
                        name:"Legendary",
                        per_level:25
                    }
                ]
            }
        ]
    },
    compass:{
        "id": "compass",
        "name": "Interstellar Compass",
        "categories": "shipping_capacity",
        "description": "Increases egg shipping rate",
        "effect_type": "multiplicative",
        "levels_compound": "additive",
        tiers:[
            {
                id:1,
                name:"Miscalibrated",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:5
                    }
                ]
            },
            {
                id:2,
                name:"Regular",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:10
                    }
                ]
            },
            {
                id:3,
                name:"Precise",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:20
                    },
                    {
                        id:1,
                        name:"Rare",
                        per_level:22
                    }
                ]
            },
            {
                id:4,
                name:"Clairvoyant",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:30
                    },
                    {
                        id:1,
                        name:"Rare",
                        per_level:35
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:40
                    },
                    {
                        id:3,
                        name:"Legendary",
                        per_level:50
                    }
                ]
            }
        ]
    },
    chalice:{
        "id": "chalice",
        "name": "Chalice",
        "categories": "internal_hatchery_rate",
        "description": "Improves internal hatcheries",
        "effect_type": "multiplicative",
        "levels_compound": "additive",
        tiers:[
            {
                id:1,
                name:"Plain",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:5
                    }
                ]
            },
            {
                id:2,
                name:"Polished",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:10
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:15
                    }
                ]
            },
            {
                id:3,
                name:"Jeweled",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:20
                    },
                    {
                        id:1,
                        name:"Rare",
                        per_level:23
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:25
                    }
                ]
            },
            {
                id:4,
                name:"Eggceptional",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:30
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:35
                    },
                    {
                        id:3,
                        name:"Legendary",
                        per_level:40
                    }
                ]
            }
        ]
    },
    metronome:{
        "id": "metronome",
        "name": "Quantum Metronome",
        "categories": "egg_laying_rate",
        "description": "Increases egg shipping rate",
        "effect_type": "multiplicative",
        "levels_compound": "additive",
        tiers:[
            {
                id:1,
                name:"Misaligned",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:5
                    }
                ]
            },
            {
                id:2,
                name:"Adequate",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:10
                    },
                    {
                        id:1,
                        name:"Rare",
                        per_level:12
                    }
                ]
            },
            {
                id:3,
                name:"Perfect",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:15
                    },
                    {
                        id:1,
                        name:"Rare",
                        per_level:17
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:20
                    }
                ]
            },
            {
                id:4,
                name:"Reggference",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:25
                    },
                    {
                        id:1,
                        name:"Rare",
                        per_level:27
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:30
                    },
                    {
                        id:3,
                        name:"Legendary",
                        per_level:35
                    }
                ]
            }
        ]
    },
    monocle:{
        "id": "monocle",
        "name": "Dilithium Monocle",
        "categories": "boost_effectiveness",
        "description": "Increases boost effectiveness",
        "effect_type": "multiplicative",
        "levels_compound": "additive",
        tiers:[
            {
                id:1,
                name:"Regular",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:5
                    }
                ]
            },
            {
                id:2,
                name:"Precise",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:10
                    }
                ]
            },
            {
                id:3,
                name:"Eggsacting",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:15
                    },
                ]
            },
            {
                id:4,
                name:"Flawless",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:20
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:25
                    },
                    {
                        id:3,
                        name:"Legendary",
                        per_level:30
                    }
                ]
            }
        ]
    },
    tachyonDeflector:{
        "id": "tachyonDeflector",
        "name": "Tachyon Deflector",
        "categories": "egg_laying_rate",
        "description": "Increases co-op mates egg laying rate",
        "effect_type": "multiplicative",
        "levels_compound": "additive",
        tiers:[
            {
                id:1,
                name:"Weak",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:5
                    }
                ]
            },
            {
                id:2,
                name:"Regular",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:8
                    },
                ]
            },
            {
                id:3,
                name:"Robust",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:12
                    },
                    {
                        id:1,
                        name:"Rare",
                        per_level:13
                    },
                ]
            },
            {
                id:4,
                name:"Eggceptional",
                rarities:[
                    {
                        id:0,
                        name:"Common",
                        per_level:15
                    },
                    {
                        id:1,
                        name:"Rare",
                        per_level:17
                    },
                    {
                        id:2,
                        name:"Epic",
                        per_level:19
                    },
                    {
                        id:3,
                        name:"Legendary",
                        per_level:20
                    }
                ]
            }
        ]
    },
}
function getArtifactValue(artifact, tier, rarity){

    if(tier==="")return 0
    let rarities = artifacts[artifact].tiers[tier-1].rarities
    return rarities.find(r => r.id===Number(rarity)).per_level
}


function SettingsArtifactItem({ artifact, oldProps, handleChange}) {

    let  {value, defaultValue,  label, rightLabel} = oldProps




    const [state, setState] = useState({tier:"",rarity:0})

    if(artifact==="tachyonDeflector") return <SettingsItem key={artifact} id={artifact} props={oldProps} handleChange = {e =>handleChange(e.target.value)}/>
    if(artifact==="shipInABottle") return <SettingsItem key={artifact} id={artifact} props={oldProps} handleChange = {e =>handleChange(e.target.value)}/>


    function handleChangeSelectedArtifact(e){

        const target = e.target;
        const value = target.value;
        const name = target.name;

        let newState = {...state,
            [name]: value
        }

        let selectedRarity = newState.rarity
        if(newState.tier!==""){
            let rarities = artifacts[artifact].tiers[newState.tier-1].rarities
            selectedRarity=rarities.map(r =>r.id).reduce((prev, curr)=>(curr>newState.rarity)?prev:Math.min(newState.rarity, curr),0)
        }

        setState(newState)
        handleChange(getArtifactValue(artifact, newState.tier, selectedRarity))
    }

    let selectedRarity = state.rarity
    let effectLabel=''
    if(state.tier!==""){
        let rarities = artifacts[artifact].tiers[state.tier-1].rarities
        selectedRarity=rarities.map(r =>r.id).reduce((prev, curr)=>(curr>state.rarity)?prev:Math.min(state.rarity, curr),0)
        effectLabel="(+"+rarities.find(r => r.id===Number(selectedRarity)).per_level+"%)"
    }



    return (
        <form style={{display:"table-row", marginTop:"2px", marginBottom:"2px", textAlign:"left"}}>
            <label htmlFor={artifact} style={{display:"table-cell", textAlign:"right"}}>{label}</label>
            <select name="tier" id="tier" style={{alignItems:"left"}} onChange={handleChangeSelectedArtifact}>
                <option key={""} value={""}>{""}</option>
                {artifacts[artifact].tiers.map(tier =>
                    <option key={tier.name} value={tier.id}>{"T"+tier.id+" ("+tier.name+") "}</option>
                )}
            </select>

            {(artifacts[artifact].tiers[state.tier-1]==null)?null:
            <select name="rarity" id="rarity" style={{alignItems:"left"}} onChange={handleChangeSelectedArtifact} value={selectedRarity}>
                {artifacts[artifact].tiers[state.tier-1].rarities.map(rarity =>
                    <option key={rarity.name} value={rarity.id}>{rarity.name}</option>
                )}
            </select>
            }
            <label htmlFor={artifact} style={{ textAlign:"left"}}>{effectLabel}</label>
        </form>
    );



}

export default SettingsArtifactItem;