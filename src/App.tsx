import React from 'react';
import './App.css';
import ItemForm from './components/item-form';
import Result from './components/result';
import StepResult from './components/step-result';
import { stepSearchItem } from './components/recipes'
import type { KeyNumberPair, StepObjects } from './components/types'

const clone = require("deepclone");

interface AppState {
  items: [string, number][],
  calculatedSteps: StepObjects[],
  exceptions: [string, number][],
  itemError: string
}

// TODO: Use https://github.com/WalshyDev/SFItemsExporter to export items.json
// and convert it to recipes.json for this app to get full recipes. COMPLETED!!!!!!
// 
// TODO: regularly update as slimefun update with item2recipes.py

class App extends React.Component {
  state: AppState = { 
    items: [['',1]],
    calculatedSteps: [],
    exceptions: [],
    itemError: ''
  }

  handleChange = (e: any) => {
    const target = e.target

    const itemStringStr = "item-string-"
    const itemStringIndex = target.id.indexOf(itemStringStr)
    if (itemStringIndex >= 0) {
      const itemIndex = Number(target.id.slice(itemStringStr.length))
      const changedItems = clone(this.state.items)
      changedItems[itemIndex][0] = target.value
      this.setState({ items: changedItems })
    }

    const itemNumberStr = "item-number-"
    const itemNumberIndex = target.id.indexOf(itemNumberStr)
    if (itemNumberIndex >= 0) {
      const itemIndex = Number(target.id.slice(itemNumberStr.length))
      const changedItems = clone(this.state.items)
      changedItems[itemIndex][1] = target.value
      this.setState({ items: changedItems })
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

  handleAddItem = () => {
    const changedItems = clone(this.state.items)
    changedItems.push(['',1])
    this.setState({ items: changedItems })
  }

  handleDeleteItem = (index: number) => {
    const changedItems = clone(this.state.items)
    changedItems.splice(index, 1)
    this.setState({ items: changedItems })
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
      const items: [string, number][] = clone(this.state.items)

      const exceptions: KeyNumberPair = {}
      this.state.exceptions.forEach((pair) => {
        if (exceptions[pair[0]]) {
          exceptions[pair[0]] += Number(pair[1])
        } else {
          exceptions[pair[0]] = Number(pair[1])
        }
      })
      const calculatedSteps: StepObjects[] = stepSearchItem(items, exceptions)
      this.setState({ 
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
          items={this.state.items}
          exceptions={this.state.exceptions}
          onAddItem={this.handleAddItem}
          onDeleteItem={this.handleDeleteItem}
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
