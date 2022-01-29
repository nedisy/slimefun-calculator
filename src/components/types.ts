type KeyNumberPair = {[key: string]: number}

type RecipeObject = {
    obtained: number,
    obtaining: string,
    require: {[key: string]: number}
}


export type { KeyNumberPair, RecipeObject }