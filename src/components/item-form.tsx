import * as React from 'react'
import type { RecipeObject } from './types'

const recipes: {[key: string]: RecipeObject} = require('./recipes/recipes.json')

interface ItemFormProps {
    items: Array<[string, number]>,
    exceptions: Array<[string, number]>,
    onChange: Function,
    onAddItem: Function,
    onDeleteItem: Function,
    onAddException: Function,
    onDeleteException: Function,
    onSuccessfulSubmit: Function
}
 
class ItemForm extends React.Component<ItemFormProps> {
    state = {
        inputWarning: ""
    } 

    onSubmit = (e: any) => {
        e.preventDefault()

        const items = this.props.items
        let isOkay = true

        items.forEach((value) => {
            const itemName = value[0]
            const itemNumber = value[1]
            if (itemName === "") {
                this.setState({ inputWarning: "please enter item name" })
                isOkay = false
                return
            }
            if (itemNumber === undefined || isNaN(itemNumber)) {
                this.setState({ inputWarning: "please enter item number" })
                isOkay = false
                return
            }
            if (itemNumber < 1) {
                this.setState({ inputWarning: "please enter a number more than zero" })
                isOkay = false
                return
            }
            if (itemNumber % 1 > 0) {
                this.setState({ inputWarning: "please enter round number" })
                isOkay = false
                return
            }
            isOkay = true
        })


        const exceptions = this.props.exceptions

        exceptions.forEach((pair) => {
            const exceptionName = pair[0]
            const exceptionNumber = pair[1]
            if (exceptionName === "") {
                this.setState({ inputWarning: "please enter item name in all exceptions, or delete it" })
                isOkay = false
                return
            }
            if (exceptionNumber === undefined || isNaN(exceptionNumber)) {
                this.setState({ inputWarning: "please enter item number in all exceptions, or delete it" })
                isOkay = false
                return
            }
            if (exceptionNumber < 1) {
                this.setState({ inputWarning: "please enter all exceptions a number more than zero, or delete it" })
                isOkay = false
                return
            }
            if (exceptionNumber % 1 > 0) {
                this.setState({ inputWarning: "please enter round number in all exceptions" })
                isOkay = false
                return
            }
            isOkay = true
        })

        if (!isOkay) {
            return
        }

        this.setState({ inputWarning: "" })
        this.props.onSuccessfulSubmit()
    }

    render() { 
        return (
            <div className="text-start">
                <datalist id="items">
                    {Object.keys(recipes).map((name) => {
                        return (
                            <option value={name} key={name}></option>
                        )
                    })}
                </datalist>
                <p className="h1 mb-3 text-light fs-2">Enter slimefun item name and number</p>
                <form onSubmit={this.onSubmit}>
                    {this.props.items.map((value, index) => {
                        return (
                            <div className="mb-3 row g-2" key={`item-input-index-${index}`}>
                                <div className="col-md-8 col-sm-6 col-12">
                                    <input
                                        className="form-control"
                                        type="text"
                                        list="items"
                                        id={`item-string-${index}`}
                                        value={value[0]}
                                        onChange={(e: any) => this.props.onChange(e)}
                                        placeholder="item_name"
                                    ></input>
                                    </div>
                                <div className="col-md-auto col-sm-auto col-auto">
                                    <input
                                        className="form-control fixed-width-px-75"
                                        type="number"
                                        id={`item-number-${index}`}
                                        value={value[1]}
                                        onChange={(e: any) => this.props.onChange(e)}
                                        placeholder="64"
                                    ></input>
                                </div>
                                <div className="col-md-auto col-sm-auto col-auto">
                                    {index === 0 ? '' :
                                        <button
                                            type="button"
                                            className="btn btn-outline-light"
                                            onClick={() => this.props.onDeleteItem(index)}
                                        >Delete</button>
                                    }
                                </div>
                            </div>
                        )
                    })}
                    <div className="row g-2 mb-3 form-text text-secondary">
                        <div className="col-md-auto col-auto">
                            <button type="button" className="btn btn-outline-light" onClick={() => this.props.onAddItem()}>Add Item</button>
                        </div>
                    </div>
                    {/* <div className="mb-3 row g-2">
                        <div className="col-sm-10 col-12">
                            <input
                                className="form-control"
                                type="text"
                                list="items"
                                id="itemName"
                                value={this.props.itemName}
                                onChange={(e: any) => this.props.onChange(e)}
                                placeholder="item_name"
                            ></input>
                            </div>
                        <div className="col-sm-auto col-auto">
                            <input
                                className="form-control fixed-width-px-75"
                                type="number"
                                id="itemNumber"
                                value={this.props.itemNumber}
                                onChange={(e: any) => this.props.onChange(e)}
                                placeholder="64"
                            ></input>
                        </div>
                    </div> */}
                    <div>
                        <div className="mb-3 ms-3 text-light">
                            {this.props.exceptions.length === 0 ? '' : 'Exceptions:'}
                        </div>
                        {this.props.exceptions.map((value, index) => {
                            return (
                                <div className="mb-3 ms-5 row g-2"
                                    id={`exception-${index}`}
                                    key={`exception-${index}`}
                                >
                                    <div 
                                        className="col-md-8 col-sm-10 col-12"
                                    >
                                        <input
                                            className="form-control"
                                            type="text"
                                            list="items"
                                            id={`exception-string-${index}`}
                                            value={value[0]}
                                            onChange={(e: any) => this.props.onChange(e)}
                                            placeholder="exception_item_name"
                                        ></input>
                                        </div>
                                    <div className="col-md-auto col-sm-auto col-auto">
                                        <input
                                            className="form-control fixed-width-px-75"
                                            type="number"
                                            id={`exception-number-${index}`}
                                            value={value[1]}
                                            onChange={(e: any) => this.props.onChange(e)}
                                            placeholder="64"
                                        ></input>
                                    </div>
                                    <div className="col-md-auto col-sm-auto col-auto">
                                        <button
                                            type="button"
                                            className="btn btn-outline-light"
                                            id={index.toString()}
                                            onClick={(e: any) => this.props.onDeleteException(e)}
                                        >Delete</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="row g-2 mb-3 ms-5 form-text text-secondary">
                        {this.props.exceptions.length === 0 ?
                            <div className={`col-md-auto col-auto`}>
                                Already have some of the required items? add exceptions
                            </div>
                        :
                            <React.Fragment>
                                <div className="col-md-8"></div>
                                <div className="col-md-auto col-auto"><div className="fixed-width-px-75"></div></div>
                            </React.Fragment>
                        }
                        <div className="col-md-auto col-auto">
                            <button type="button" className="btn btn-outline-light" onClick={() => this.props.onAddException()}>Add Exception</button>
                        </div>
                    </div>
                    <div className="mb-3 form-text text-warning">
                        {this.state.inputWarning}
                    </div>
                    <input
                        type="submit"
                        className="mb-3 btn btn-outline-light"
                        value="Find"
                    />
                </form>
            </div>
          );
    }
}
 
export default ItemForm;