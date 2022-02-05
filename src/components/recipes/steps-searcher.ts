import type { RecipeObject, StepObject, StepObjects, KeyNumberPair } from '../types'

const clone = require("deepclone");
const recipes: {[key: string]: RecipeObject} = require('./recipes.json')

const stepSearcher: Function = ( items: [string, number][], exceptions: KeyNumberPair = {}): StepObjects[] => {
    let listed: StepObjects[] = [{}]
    items.forEach((value) => {
        const itemName = value[0]
        const itemNumber = value[1]
        if (listed[0][itemName]) {
            listed[0][itemName].required += itemNumber 
        } else {
            const selected: StepObject = clone(recipes[itemName]) as StepObject
            if (!selected) {
                listed[0][itemName] = {
                    required: value[1],
                    obtained: 1,
                    obtaining: "gathering",
                    require: {}
                }
            } else {
                selected.required = value[1]
                listed[0][value[0]] = selected
            }            
        }
    })

    deepStepSearch(listed, exceptions)
    return listed
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
                toBeListed['required'] = currentStep[name].require[requiredObject]*Math.ceil(currentStep[name].required/currentStep[name].obtained)
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
                    required: currentStep[name].require[requiredObject]*Math.ceil(currentStep[name].required/currentStep[name].obtained),
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
                        listed[currentStepIndex + 1][requiredObject].required -= currentStep[name].require[requiredObject]*Math.ceil(currentStep[name].required/currentStep[name].obtained)
                    } else {
                        listed[currentStepIndex + 1][requiredObject].required -= currentStep[name].require[requiredObject]*Math.ceil(currentStep[name].required/currentStep[name].obtained)
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