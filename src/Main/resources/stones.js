function getAllStones(){
    return {
        tachyon_stone: {
            "id": "tachyon_stone",
            "name": "Tachyon Stone",
            "categories": "egg_laying_rate",
            "description": "Increases egg laying rate when set",
            "effect_type": "multiplicative",
            "levels_compound": "multiplicative",
            tiers: [
                {
                    id: 2,
                    name: "Regular",
                    per_level: 2
                },
                {
                    id: 3,
                    name: "Eggsquisite",
                    per_level: 4
                },
                {
                    id: 4,
                    name: "Brilliant",
                    per_level: 5
                }
            ]
        },
        dilithium_stone: {
            "id": "dilithium_stone",
            "name": "Dilithium Stone",
            "categories": "boost_duration",
            "description": "Increases boost duration when set",
            "effect_type": "multiplicative",
            "levels_compound": "multiplicative",
            tiers: [
                {
                    id: 2,
                    name: "Regular",
                    per_level: 3
                },
                {
                    id: 3,
                    name: "Eggsquisite",
                    per_level: 6
                },
                {
                    id: 4,
                    name: "Brilliant",
                    per_level: 8
                }
            ]
        },
        quantum_stone: {
            "id": "quantum_stone",
            "name": "Quantum Stone",
            "categories": "shipping_rate",
            "description": "Increases shipping capacity when set",
            "effect_type": "multiplicative",
            "levels_compound": "multiplicative",
            tiers: [
                {
                    id: 2,
                    name: "Regular",
                    per_level: 2
                },
                {
                    id: 3,
                    name: "Phased",
                    per_level: 4
                },
                {
                    id: 4,
                    name: "Meggnificent",
                    per_level: 5
                }
            ]
        },
        life_stone: {
            "id": "life_stone",
            "name": "Life Stone",
            "categories": "internal_hatchery_rate",
            "description": "Improves internal hatcheries when set",
            "effect_type": "multiplicative",
            "levels_compound": "multiplicative",
            tiers: [
                {
                    id: 2,
                    name: "Regular",
                    per_level: 2
                },
                {
                    id: 3,
                    name: "Good",
                    per_level: 3
                },
                {
                    id: 4,
                    name: "Eggceptional",
                    per_level: 4
                }
            ]
        },
    }
}
export default getAllStones;