import * as React from 'react';

interface ItemFormProps {
    itemName: string,
    itemNumber: number,
    onChange: Function,
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
        if (itemName === "") {
            this.setState({ inputWarning: "please enter item name" })
            return
        }
        if (itemNumber === undefined || itemNumber === NaN) {
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