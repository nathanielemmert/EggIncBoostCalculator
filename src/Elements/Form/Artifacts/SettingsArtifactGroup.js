import React from 'react';
import SettingsArtifactItem from "./SettingsArtifactItem";

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


function SettingsArtifactGroup({groupName, formState, appSettings, updateForm, borderStyle}) {

    function underscoreToCamelCase(a){
        let capitalize = (a) => a.charAt(0).toUpperCase() + a.substring(1)
        return a.split("_").map((b,i)=>(i>0)?capitalize(b):b).join("")
    }

    function influences(artifact){
        return  artifacts[artifact].categories
                .split(",")
                .map(underscoreToCamelCase)
    }

    function handleChangeArtifact( group, attr, newValue){
        updateForm(1000, group, attr, influences(attr), newValue)
    }



    return  <div style={borderStyle}>
        <b key={"title"}>{groupName.split("_").map(a => a.charAt(0).toUpperCase() + a.substring(1)).join(" ")}</b>

        {appSettings.artifacts.map((artifactName) => {
            let oldProps = appSettings[artifactName]
            oldProps.value = formState[artifactName]
            return <SettingsArtifactItem key = {artifactName}
                                         artifact={artifactName}
                                         oldProps={oldProps}
                                         handleChange = {handleChangeArtifact.bind(this, "artifacts", artifactName)}/>
        })}
    </div>

}

export default SettingsArtifactGroup;