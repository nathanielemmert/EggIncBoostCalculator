function getAllDailyEvents(){
    return {
        boost_time: {
            "id": "boost_time",
            "name": "Boost time 2x",
            "categories": "boost_duration",
            "description": "Increases Boost Duration",
            "effect_type": "multiplicative",
            "levels_compound": "multiplicative",
            per_level:100
        }
    }
}
export default getAllDailyEvents;