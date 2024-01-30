import type { StepObjects } from '../types'

const cleanSteps: Function = ( steps: StepObjects[] ): void => {
    const stepLength = steps.length
    steps.forEach((step, currentStepIndex) => {
        for (let comparedStepIndex = currentStepIndex + 1; comparedStepIndex < stepLength; comparedStepIndex++) {
            const currentStepKeys = Object.keys(step)
            const comparedStepKeys = Object.keys(steps[comparedStepIndex])
            for (let currentStepKeyIndex = 0; currentStepKeyIndex < currentStepKeys.length; currentStepKeyIndex++) {
                for (let comparedStepKeyIndex = 0; comparedStepKeyIndex < comparedStepKeys.length; comparedStepKeyIndex++) {
                    const currentStepKey = currentStepKeys[currentStepKeyIndex]
                    const comparedStepKey = comparedStepKeys[comparedStepKeyIndex]
                    if (currentStepKey === comparedStepKey) {
                        steps[comparedStepIndex][comparedStepKey].required += step[currentStepKey].required
                        delete step[currentStepKey]
                    }
                }
            }
        }
    })
    steps = steps.filter((step) => Object.keys(step).length > 0)
}

export default cleanSteps