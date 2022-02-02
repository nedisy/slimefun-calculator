import React from 'react';
import './App.css';
import ItemForm from './components/item-form';
import Result from './components/result';
import StepResult from './components/step-result';
import { searchItem, stepSearchItem } from './components/recipes'
import type { KeyNumberPair, StepObjects } from './components/types'

const clone = require("deepclone");

class App extends React.Component {
  state = { 
    itemName: '',
    itemNumber: 1,
    calculatedItems: {},
    calculatedSteps: [],
    exceptions: [],
    itemError: ''
  }

  handleChange = (e: any) => {
    const target = e.target
    if (target.id === "itemName") {
      this.setState({ itemName: target.value })
    }
    if (target.id === "itemNumber") {
      this.setState({ itemNumber: target.value })
    }
    const exceptionStringStr = "exception-string-"
    const exceptionStringIndex = target.id.indexOf(exceptionStringStr)
    if (exceptionStringIndex >= 0) {
      const exceptionIndex = Number(target.id.slice(exceptionStringStr.length))
      const changedExceptions = clone(this.state.exceptions)
      changedExceptions[exceptionIndex][0] = target.value
      this.setState({ exceptions: changedExceptions })
    }
    const exceptionNumberStr = "exception-number-"
    const exceptionNumberIndex = target.id.indexOf(exceptionNumberStr)
    if (exceptionNumberIndex >= 0) {
      const exceptionIndex = Number(target.id.slice(exceptionNumberStr.length))
      const changedExceptions = clone(this.state.exceptions)
      changedExceptions[exceptionIndex][1] = target.value
      this.setState({ exceptions: changedExceptions })
    }
  }

  handleAddException = () => {
    const changedExceptions = clone(this.state.exceptions)
    changedExceptions.push(['',1])
    this.setState({ exceptions: changedExceptions })
  }

  handleDeleteException = (e: any) => {
    const target = e.target
    const index = target.id
    const changedExceptions = clone(this.state.exceptions)
    changedExceptions.splice(index, 1)
    this.setState({ exceptions: changedExceptions })
  }

  handleSubmit = () => {
    try {
      const exceptions: KeyNumberPair = {}
      this.state.exceptions.forEach((pair) => {
        exceptions[pair[0]] = pair[1]
      })
      const calculatedSteps: StepObjects[] = stepSearchItem(this.state.itemName, this.state.itemNumber, exceptions)
      const calculatedItems: KeyNumberPair = searchItem(this.state.itemName, this.state.itemNumber)
      this.setState({ 
        calculatedItems,
        calculatedSteps,
        itemError: ''
      })
    } catch (error: any) {
      const calculatedItems: KeyNumberPair =  {}
      const calculatedSteps: StepObjects[] = []
      this.setState({
        calculatedItems,
        calculatedSteps,
        itemError: error.message
      })
    }
  }

  render() { 
    return ( 
      <div className="App container-sm position-absolute top-0 start-50 translate-middle-x">
        <h1 className="text-light mt-5 mb-3">Slimefun Calculator</h1>
        <ItemForm
          itemName={this.state.itemName}
          itemNumber={this.state.itemNumber}
          exceptions={this.state.exceptions}
          onAddException={this.handleAddException}
          onDeleteException={this.handleDeleteException}
          onChange={this.handleChange}
          onSuccessfulSubmit={this.handleSubmit}
        />
        <Result 
          calculatedSteps={this.state.calculatedSteps}
          errorMessage={this.state.itemError}
        />
        <StepResult
          calculatedSteps={this.state.calculatedSteps}
          errorMessage={this.state.itemError}
        />
      </div>
     );
  }
}
 
export default App;
