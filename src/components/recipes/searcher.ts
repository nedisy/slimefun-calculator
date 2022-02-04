import type { KeyNumberPair, RecipeObject } from '../types'

const recipes: {[key: string]: RecipeObject} = require('./recipes.json')

const searcher: Function = ( item_id: string, number: number ): Object => {
    const selected: RecipeObject = recipes[item_id]
    let listed: KeyNumberPair = {}
    if (!selected) {
        throw Error(`could not find ${item_id} in the recipe book`)
    }
    else {
        deepSearch(selected, listed, number)
        return listed
    }
}

export default searcher

const deepSearch: Function = ( item: RecipeObject, listed: KeyNumberPair, multiplier: number = 1): void => {
    const keys = Object.keys(item.require)
    keys.forEach((value) => {
        const requiredExist = recipes[value]
        if (!requiredExist) {
            if (listed[value]) {
                listed[value] += (multiplier / item.obtained)*item.require[value]
            } else {
                listed[value] = (multiplier / item.obtained)*item.require[value]
            }
            return
        } else {
            deepSearch(requiredExist, listed, Math.ceil(multiplier / item.obtained) * item.require[value])
        }
    })
}