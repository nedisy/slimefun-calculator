import React from 'react';
import './App.css';
import ItemForm from './components/item-form';
import Result from './components/result';
import { searchItem } from './components/recipes'
 
type KeyNumberPair = {[key: string]: number}

class App extends React.Component {
  state = { 
    itemName: '',
    itemNumber: 1,
    calculatedItems: [],
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
  }

  handleSubmit = () => {
    try {
      const calculatedItems: KeyNumberPair = searchItem(this.state.itemName, this.state.itemNumber)
      this.setState({ 
        calculatedItems,
        itemError: ''
      })    
    } catch (error: typeof error) {
      this.setState({
        calculatedItems: [],
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
          onChange={this.handleChange}
          onSuccessfulSubmit={this.handleSubmit}
        />
        <Result 
          calculatedItems={this.state.calculatedItems}
          errorMessage={this.state.itemError}
        />
      </div>
     );
  }
}
 
export default App;
