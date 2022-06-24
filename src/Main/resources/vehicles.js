function getAllVehicles(){
    return {
        trike:{
            "serial_id": 0,
            "id": "trike",
            "name": "Trike",
            "categories": "",
            "levels": 1,
            "per_level": 5_000,
            "levels_compound": "additive",
            "prices": []
        },
        transit_van:{
            "serial_id": 1,
            "id": "transit_van",
            "name": "Transit Van",
            "categories": "",
            "levels": 1,
            "per_level": 15_000,
            "levels_compound": "additive",
            "prices": []
        },
        pickup:{
            "serial_id": 2,
            "id": "pickup",
            "name": "Pickup",
            "categories": "",
            "levels": 1,
            "per_level": 50_000,
            "levels_compound": "additive",
            "prices": []
        },
        "10_foot":{
            "serial_id": 3,
            "id": "10_foot",
            "name": "10 Foot",
            "categories": "",
            "levels": 1,
            "per_level": 100_000,
            "levels_compound": "additive",
            "prices": []
        },
        "24_foot":{
            "serial_id": 4,
            "id": "24_foot",
            "name": "24 Foot",
            "categories": "",
            "levels": 1,
            "per_level": 250_000,
            "levels_compound": "additive",
            "prices": []
        },
        semi:{
            "serial_id": 5,
            "id": "semi",
            "name": "Semi",
            "categories": "",
            "levels": 1,
            "per_level": 500_000,
            "levels_compound": "additive",
            "prices": []
        },
        double_semi:{
            "serial_id": 6,
            "id": "double_semi",
            "name": "Double Semi",
            "categories": "",
            "levels": 1,
            "per_level": 1_000_000,
            "levels_compound": "additive",
            "prices": []
        },
        future_semi:{
            "serial_id": 7,
            "id": "future_semi",
            "name": "Future Semi",
            "categories": "",
            "levels": 1,
            "per_level": 5_000_000,
            "levels_compound": "additive",
            "prices": []
        },
        mega_semi:{
            "serial_id": 8,
            "id": "mega_semi",
            "name": "Mega Semi",
            "categories": "",
            "levels": 1,
            "per_level": 15_000_000,
            "levels_compound": "additive",
            "prices": []
        },
        hover_semi:{
            "serial_id": 9,
            "id": "hover_semi",
            "name": "Hover Semi",
            "categories": "hover",
            "levels": 1,
            "per_level": 30_000_000,
            "levels_compound": "additive",
            "prices": []
        },
        quantum_transporter:{
            "serial_id": 10,
            "id": "quantum_transporter",
            "name": "Quantum Transporter",
            "categories": "hover",
            "levels": 1,
            "per_level": 50_000_000,
            "levels_compound": "additive",
            "prices": []
        },
        hyperloop_train:{
            "serial_id": 11,
            "id": "hyperloop_train",
            "name": "Hyperloop Train",
            "categories": "hover,hyperloop",
            "levels": 10,
            "per_level": 50_000_000,
            "levels_compound": "additive",
            "prices": []
        },
    }
}
export default getAllVehicles;