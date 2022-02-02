import * as React from 'react';

interface ItemFormProps {
    itemName: string,
    itemNumber: number,
    exceptions: Array<[string, number]>,
    onChange: Function,
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
        const itemName = this.props.itemName
        const itemNumber = this.props.itemNumber
        const exceptions = this.props.exceptions
        if (itemName === "") {
            this.setState({ inputWarning: "please enter item name" })
            return
        }
        if (itemNumber === undefined || isNaN(itemNumber)) {
            this.setState({ inputWarning: "please enter item number" })
            return
        }
        if (itemNumber < 1) {
            this.setState({ inputWarning: "please enter a number more than zero" })
            return
        }
        if (itemNumber % 1 > 0) {
            this.setState({ inputWarning: "please enter round number" })
            return
        }

        let exceptionsIsOkay = true
        exceptions.forEach((pair) => {
            const exceptionName = pair[0]
            const exceptionNumber = pair[1]
            if (exceptionName === "") {
                this.setState({ inputWarning: "please enter item name in all exceptions, or delete it" })
                exceptionsIsOkay = false
                return
            }
            if (exceptionNumber === undefined || isNaN(itemNumber)) {
                this.setState({ inputWarning: "please enter item number in all exceptions, or delete it" })
                exceptionsIsOkay = false
                return
            }
            if (exceptionNumber < 1) {
                this.setState({ inputWarning: "please enter all exceptions a number more than zero, or delete it" })
                exceptionsIsOkay = false
                return
            }
            if (exceptionNumber % 1 > 0) {
                this.setState({ inputWarning: "please enter round number in all exceptions" })
                exceptionsIsOkay = false
                return
            }
            exceptionsIsOkay = true
        })

        if (!exceptionsIsOkay) {
            return
        }

        this.setState({ inputWarning: "" })
        this.props.onSuccessfulSubmit()
    }

    render() { 
        return (
            <div className="text-start">
                <p className="h1 mb-3 text-light fs-2">Enter slimefun item name and number</p>
                <form onSubmit={this.onSubmit}>
                    <div className="mb-3 row">
                        <div className="col-10">
                            <input
                                className="form-control"
                                type="text"
                                id="itemName"
                                value={this.props.itemName}
                                onChange={(e: any) => this.props.onChange(e)}
                                placeholder="item_name"
                            ></input>
                            </div>
                        <div className="col-2">
                            <input
                                className="form-control"
                                type="number"
                                id="itemNumber"
                                value={this.props.itemNumber}
                                onChange={(e: any) => this.props.onChange(e)}
                                placeholder="64"
                            ></input>
                        </div>
                    </div>
                    <div>
                        <div className="mb-3 ms-3 text-light">
                            {this.props.exceptions.length === 0 ? '' : 'Exceptions:'}
                        </div>
                        {this.props.exceptions.map((value, index) => {
                            return (
                                <div className="mb-3 ms-5 row"
                                    id={`exception-${index}`}
                                    key={`exception-${index}`}
                                >
                                    <div 
                                        className="col-8"
                                    >
                                        <input
                                            className="form-control"
                                            type="text"
                                            id={`exception-string-${index}`}
                                            value={value[0]}
                                            onChange={(e: any) => this.props.onChange(e)}
                                            placeholder="exception_item_name"
                                        ></input>
                                        </div>
                                    <div className="col-1">
                                        <input
                                            className="form-control"
                                            type="number"
                                            id={`exception-number-${index}`}
                                            value={value[1]}
                                            onChange={(e: any) => this.props.onChange(e)}
                                            placeholder="64"
                                        ></input>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-outline-light col-1"
                                        id={index.toString()}
                                        onClick={(e: any) => this.props.onDeleteException(e)}
                                    >Delete</button>
                                </div>
                            )
                        })}
                    </div>
                    <div className="row mb-3 ms-5 form-text text-secondary">
                        <div className="col-9">
                        {this.props.exceptions.length === 0 ? 'Already have some of the required items? add exceptions' : ''}
                        </div>
                        <button type="button" className="btn btn-outline-light col-1" onClick={() => this.props.onAddException()}>Add</button>
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