import * as React from 'react'
import Collapsible from 'react-collapsible'
import deepEqual from 'fast-deep-equal'
import type { KeyNumberPair, KeyBoolPair, StepObjects } from './types'

const clone = require("deepclone");

interface StepResultProps {
    calculatedSteps: StepObjects[]
}

interface StepGuiStates {
    isExpanded: boolean,
    subSteps: KeyBoolPair
}

interface StepResultStates {
    totalSteps: number,
    totalSubSteps: number,
    isStepExpanded: boolean,
    prevSteps: StepObjects[]
    steps: StepGuiStates[]
}
 
class StepResult extends React.PureComponent<StepResultProps> {
    state = {
        totalSteps: this.props.calculatedSteps.length,
        totalSubSteps: this.props.calculatedSteps.reduce((prev, current) => prev += Object.keys(current).length, 0),
        isStepsExpanded: false,
        prevSteps: [...clone(this.props.calculatedSteps)].reverse(),
        steps: [...this.props.calculatedSteps].reverse().map((stepObjects) => {
            const stepGuiObjects: StepGuiStates = {
                isExpanded: false,
                subSteps: {}
            }
            Object.keys(stepObjects).forEach((step) => {
                stepGuiObjects.subSteps[step] = false
            })
            return stepGuiObjects
        })
    }

    static getDerivedStateFromProps(props: StepResultProps, state: StepResultStates) {
        if (deepEqual(props.calculatedSteps, [...state.prevSteps].reverse())) {
            return state
        }
        const newState = {
            totalSteps: props.calculatedSteps.length,
            totalSubSteps: props.calculatedSteps.reduce((prev, current) => prev += Object.keys(current).length, 0),
            isStepsExpanded: false,
            prevSteps: [...clone(props.calculatedSteps)].reverse(),
            steps: [...props.calculatedSteps].reverse().map((stepObjects) => {
                const stepGuiObjects: StepGuiStates = {
                    isExpanded: false,
                    subSteps: {}
                }
                Object.keys(stepObjects).forEach((step) => {
                    stepGuiObjects.subSteps[step] = false
                })
                return stepGuiObjects
            })
        }
        return newState
    }

    handleCollapse = (event: any) => {
        const target = event.target
        if (target.id === 'root-step') {
            const newExpandedState = !this.state.isStepsExpanded
            this.setState({ isStepsExpanded: newExpandedState})
            return
        }
        const index = Number(target.id)
        const newSteps: StepGuiStates[] = clone(this.state.steps)
        newSteps[index].isExpanded = !this.state.steps[index].isExpanded
        this.setState({ steps: newSteps})
    }

    handleChecklist = (index: number, subStep: string) => {
        const newSteps = clone(this.state.steps)
        newSteps[index].subSteps[subStep] = !this.state.steps[index].subSteps[subStep]
        this.setState({ steps: newSteps})
    }

    getTotalStepCompletion = () => {
        const completed = this.state.steps.reduce((prev, current) => {
            return prev += Object.keys(current.subSteps).filter((subStep) => current.subSteps[subStep]).length
        }, 0)
        return `${completed}/${this.state.totalSubSteps} completed`
    }

    getSubStepCompletion = (index: number) => {
        const subSteps = this.state.steps[index].subSteps
        const subStepKeys = Object.keys(subSteps)
        const total = subStepKeys.length
        const completed = subStepKeys.filter((subStep) => subSteps[subStep]).length
        return `${completed}/${total} completed`
    }

    render() { 
        return ( 
            <div className="text-start text-light">
                <div className="mb-3 bg-dark rounded row justify-content-between position-relative">
                    <div className="position-absolute expander rounded top-0 start-0 w-100 h-100" id='root-step' onClick={this.handleCollapse}></div>
                    <div className="col">
                        Steps
                    </div>
                    <div className="col">
                        {this.getTotalStepCompletion()}
                    </div>
                </div>
                <Collapsible className='text-light' open={this.state.isStepsExpanded} trigger=''>
                    <ul className='list-group'>
                        {this.state.steps.map((stepGuiStates, index) => {
                            return (
                                <li className="mb-3 bg-secondary rounded list-group-item text-light" key={index}>
                                    <div className="mb-3 bg-dark rounded row justify-content-between position-relative">
                                        <div className={"expander rounded position-absolute top-0 start-0 w-100 " + (this.state.isStepsExpanded? "h-100" : "h-0")} id={index.toString()} onClick={this.handleCollapse}></div>
                                        <div className="col">
                                            Step {index + 1}
                                        </div>
                                        <div className="col">
                                            {this.getSubStepCompletion(index)}
                                        </div>
                                    </div>
                                    <Collapsible className='text-light' open={stepGuiStates.isExpanded} trigger=''>
                                        <ul>
                                            {Object.keys(stepGuiStates.subSteps).map((subStep) => {
                                                const obtainingMethod = this.state.prevSteps[index][subStep].obtaining
                                                const obtained = this.state.prevSteps[index][subStep].obtained
                                                const amount = this.state.prevSteps[index][subStep].required
                                                const stacks = Math.floor(amount/64)
                                                const stackDisplayed = stacks > 0 ? stacks > 1 ? `${stacks} stacks` : `${stacks} stack` : ''
                                                const remainder = amount % 64
                                                const remainderDisplayed = remainder > 0 ? stacks > 0 ? ` and ${remainder}` : `${remainder}` : ''
                                                const required = stackDisplayed + remainderDisplayed
                                                const require = this.state.prevSteps[index][subStep].require
                                                if (obtainingMethod === 'gathering') {
                                                    return (
                                                        <li 
                                                            key={subStep} 
                                                            className={'checklist ' + (stepGuiStates.subSteps[subStep]? 'checklist-checked' : '')}
                                                            onClick={() => this.handleChecklist(index, subStep)}
                                                        >
                                                            {`Gather ${required} ${subStep}`}
                                                        </li>
                                                    )
                                                }
                                                return (
                                                    <li key={subStep} 
                                                        className={'checklist ' + (stepGuiStates.subSteps[subStep]? 'checklist-checked' : '')}
                                                        onClick={() => this.handleChecklist(index, subStep)}
                                                    >
                                                        {`Use ${obtainingMethod} to obtain ${required} ${subStep} from:`}
                                                        <ul>
                                                            {Object.keys(require).map((requirement) => {
                                                                const requiredAmount = require[requirement]*Math.ceil(amount/obtained)
                                                                const requiredStacks = Math.floor(requiredAmount/64)
                                                                const requiredStackDisplayed = requiredStacks > 0 ? requiredStacks > 1 ? `${requiredStacks} stacks` : `${requiredStacks} stack` : ''
                                                                const requiredRemainder = requiredAmount % 64
                                                                const requiredRemainderDisplayed = requiredRemainder > 0 ? requiredStacks > 0 ? ` and ${requiredRemainder}` : `${requiredRemainder}` : ''
                                                                const required2 = requiredStackDisplayed + requiredRemainderDisplayed
                                                                return (
                                                                    <li  key={`${subStep}-${requirement}`}>{`${required2} ${requirement}`}</li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </Collapsible>
                                </li>
                            )
                        })}
                    </ul>
                </Collapsible>
            </div>
         );
    }
}
 
export default StepResult;