import type { RecipeObject, StepObject, StepObjects, KeyNumberPair } from '../types'

const clone = require("deepclone");
const recipes: {[key: string]: RecipeObject} = require('./recipes.json')

const stepSearcher: Function = ( item_id: string, number: number , exceptions: KeyNumberPair = {}): StepObjects[] => {
    const selected: StepObject = clone(recipes[item_id]) as StepObject
    if (!selected) {
        throw Error(`could not find ${item_id} in the recipe book`)
    }
    else {
        selected.required = number
        const finalStepObject: StepObjects = {}
        finalStepObject[item_id] = selected
        let listed: StepObjects[] = [finalStepObject]
        deepStepSearch(listed, exceptions)
        return listed
    }
}

export default stepSearcher

const deepStepSearch: Function = (listed: StepObjects[], exceptions: KeyNumberPair): void => {
    const currentStepIndex: number = listed.length - 1
    const currentStep: StepObjects = listed[currentStepIndex]
    if (currentStepIndex < 0) {
        throw Error(`final step must exist`)
    }

    let currentStepKeys: string[] = Object.keys(currentStep)

    currentStepKeys.forEach((currentStepKey) => {
        if (Object.keys(exceptions).includes(currentStepKey)) {
            listed[currentStepIndex][currentStepKey].required = Math.max(0, currentStep[currentStepKey].required - exceptions[currentStepKey])                
            if (listed[currentStepIndex][currentStepKey].required === 0) {
                delete listed[currentStepIndex][currentStepKey]
                currentStepKeys = currentStepKeys.filter(key => key !== currentStepKey)
            }
        }
    })

    currentStepKeys.forEach((name) => {
        Object.keys(currentStep[name].require).forEach((requiredObject) => {
            const isInRecipe: StepObject = recipes[requiredObject] as StepObject
            if (isInRecipe) {
                const toBeListed: StepObject = clone(isInRecipe)
                toBeListed['required'] = currentStep[name].require[requiredObject]*Math.ceil(currentStep[name].required/toBeListed.obtained)
                if (!listed[currentStepIndex + 1]){
                    listed[currentStepIndex + 1] = {}
                }
                if (listed[currentStepIndex + 1][requiredObject]) {
                    listed[currentStepIndex + 1][requiredObject].required += toBeListed.required
                } else {
                    listed[currentStepIndex + 1][requiredObject] = toBeListed
                }
            } else {
                const toBeListed: StepObject = {
                    required: currentStep[name].required*currentStep[name].require[requiredObject],
                    obtained: 1,
                    obtaining: "gathering",
                    require: {}
                }
                if (!listed[currentStepIndex + 1]){
                    listed[currentStepIndex + 1] = {}
                }
                if (listed[currentStepIndex + 1][requiredObject]) {
                    listed[currentStepIndex + 1][requiredObject].required += toBeListed.required
                } else {
                    listed[currentStepIndex + 1][requiredObject] = toBeListed
                }
            }
        })
    })
    const nextStep: StepObjects = listed[currentStepIndex + 1] 
    if (nextStep) {
        const nextStepKeys: string[] = Object.keys(nextStep)
        currentStepKeys.forEach((name) => {
            if (currentStep[name].obtaining === "gathering") {
                if (!listed[currentStepIndex + 1]) {
                    listed[currentStepIndex + 1] = {}
                }
                if (listed[currentStepIndex + 1][name]) {                    
                    listed[currentStepIndex + 1][name].required += currentStep[name].required
                } else {
                    listed[currentStepIndex + 1][name] = currentStep[name]
                    nextStepKeys.push(name)
                }
                delete listed[currentStepIndex][name]
                currentStepKeys = currentStepKeys.filter(key => key !== name)
                return
            }
            if (nextStepKeys.includes(name)) {
                nextStep[name].required += currentStep[name].required
                Object.keys(currentStep[name].require).forEach((requiredObject) => {
                    const isInRecipe = recipes[requiredObject]
                    if (isInRecipe) {
                        listed[currentStepIndex + 1][requiredObject].required -= currentStep[name].require[requiredObject]*Math.ceil(currentStep[name].required/isInRecipe.obtained)
                    } else {
                        listed[currentStepIndex + 1][requiredObject].required -= currentStep[name].required*currentStep[name].require[requiredObject]
                    }
                })
                delete currentStep[name]
                currentStepKeys = currentStepKeys.filter(key => key !== name)
            }
        })
        deepStepSearch(listed, exceptions)
    } else {
        return
    }
}