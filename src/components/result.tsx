import * as React from 'react';
import type { KeyNumberPair } from './types'

interface ResultProps {
    calculatedItems: KeyNumberPair
    errorMessage: string
}
 
class Result extends React.Component<ResultProps> {
    render() { 
        return ( 
            <div className="text-start text-light">
                <div className="mb-3">
                    <ul>
                        {Object.keys(this.props.calculatedItems).map(value => {
                            const amount = this.props.calculatedItems[value]
                            const stacks = Math.floor(amount/64)
                            const stackDisplayed = stacks > 0 ? stacks > 1 ? `${stacks} stacks` : `${stacks} stack` : ''
                            const remainder = amount % 64
                            const remainderDisplayed = remainder > 0 ? stacks > 0 ? ` and ${remainder}` : `${remainder}` : ''
                            return (
                                <li key={value}>
                                    {value}: {stackDisplayed + remainderDisplayed}
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