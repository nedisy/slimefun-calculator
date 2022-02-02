import { stepSearchItem } from './'

describe('test for step searcher function', () => {
    test('gold_ingot-8', () => {
        const gold_ingot_8_result = stepSearchItem('gold_ingot-8', 1)
        const gold_ingot_8_expected = [
            {"gold_ingot-8": {
                required: 1,
                obtained: 1,
                obtaining: 'smeltery',
                require: {
                    "gold_ingot-6": 1,
                    gold_dust: 1
                }
            }},
            {"gold_ingot-6": {
                required: 1,
                obtained: 1,
                obtaining: 'smeltery',
                require: {
                    "gold_ingot-4": 1,
                    gold_dust: 1
                } 
            }},
            {"gold_ingot-4": {
                required: 1,
                obtained: 1,
                obtaining: 'smeltery',
                require: {
                    gold_dust: 1
                } 
            }},
            {gold_dust: {
                required: 3,
                obtained: 1,
                obtaining: 'gathering',
                require: {}
            }}
        ]
        expect(gold_ingot_8_result).toStrictEqual(gold_ingot_8_expected)
    })
    test('damascus_steel_ingot', () => {
        const damascus_steel_ingot_result = stepSearchItem('damascus_steel_ingot', 1)
        const damascus_steel_ingot_expected = [
            {
                "damascus_steel_ingot": {
                    "obtained": 1,
                    "obtaining": "smeltery",
                    "require": {
                        "steel_ingot": 1,
                        "iron_dust": 1,
                        "carbon": 1,
                        "iron_ingot": 1
                    },
                    "required": 1
                }
            },
            {
                "steel_ingot": {
                    "obtained": 1,
                    "obtaining": "smeltery",
                    "require": {
                        "iron_dust": 1,
                        "carbon": 1,
                        "iron_ingot": 1
                    },
                    "required": 1
                }
            },
            {
                "carbon": {
                    "obtained": 1,
                    "obtaining": "compressor",
                    "require": {
                        "coal": 8
                    },
                    "required": 2
                }
            },
            {
                "coal": {
                    "required": 16,
                    "obtained": 1,
                    "obtaining": "gathering",
                    "require": {}
                },
                "iron_dust": {
                    "required": 2,
                    "obtained": 1,
                    "obtaining": "gathering",
                    "require": {}
                },
                "iron_ingot": {
                    "required": 2,
                    "obtained": 1,
                    "obtaining": "gathering",
                    "require": {}
                }
            }
        ]
        expect(damascus_steel_ingot_result).toStrictEqual(damascus_steel_ingot_expected)
    })
})