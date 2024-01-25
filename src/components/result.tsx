import * as React from 'react';
import type { StepObjects } from './types'

interface ResultProps {
    calculatedSteps: StepObjects[]
    errorMessage: string
}
 
class Result extends React.Component<ResultProps> {
    render() { 
        const lastIndex = this.props.calculatedSteps.length - 1
        if (!this.props.calculatedSteps[lastIndex]) {
            return ''
        }
        return ( 
            <div className="text-start text-light">
                Required resources:
                <div className="mb-3">
                    <ul>
                        {Object.keys(this.props.calculatedSteps[lastIndex]).map(value => {
                            const amount = this.props.calculatedSteps[lastIndex][value].required
                            const shulkerBoxes = Math.floor(amount/(64*27))
                            const shulkerBoxDisplayed = shulkerBoxes > 0 ? shulkerBoxes > 1 ? `${shulkerBoxes} shulker boxes, ` : `${shulkerBoxes} shulker box, ` : '' 
                            const stacks = Math.floor(amount/64) % 27
                            const stackDisplayed = stacks > 0 ? stacks > 1 ? `${stacks} stacks` : `${stacks} stack` : ''
                            const remainder = amount % 64
                            const remainderDisplayed = remainder > 0 ? stacks > 0 ? ` and ${remainder}` : `${remainder}` : ''
                            return (
                                <li key={value}>
                                    {value}: {shulkerBoxDisplayed + stackDisplayed + remainderDisplayed}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="mb-3 text-danger">
                    {this.props.errorMessage}
                </div>
            </div>
         );
    }
}
 
export default Result;