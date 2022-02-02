export type KeyNumberPair = {[key: string]: number}

export type KeyBoolPair = {[key: string]: boolean}

export type RecipeObject = {
    obtained: number,
    obtaining: string,
    require: KeyNumberPair
}

export type StepObject = {
    required: number,
    obtained: number,
    obtaining: string,
    require: KeyNumberPair
}

export type StepObjects = {[key: string]: StepObject}