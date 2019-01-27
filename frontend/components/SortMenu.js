import React from 'react'
import { Component } from 'react';

class SortMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lstTypes: this.props.lstTypes
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lstTypes) this.setState({ lstTypes: nextProps.lstTypes });
    }


    render() {
        return (
            <div className="form-row">
                <button className="form-group col-md-2 btn btn-primary" onClick={this.props.onCreateQuestionClick}>
                    Create new Question
            </button>
                <div className="form-group col-md-4">
                    <label>Sort Types</label>
                    <select className="form-control" value={this.props.sortType} onChange={this.props.onSortTypeChange}>
                        <option value="0">None</option>
                        {this.state.lstTypes.map(type => {
                            return (<option value={type.id} key={type.id}>{type.value}</option>)
                        })}
                    </select>
                </div>
                <div className="form-group col-md-4">
                    <label>Sort Difficulty</label>
                    <select className="form-control" value={this.props.sortDifficulty} onChange={this.props.onSortDifficultyChange}>
                        <option value="0" key={0}>
                            None
                    </option>
                        {[1, 2, 3, 4, 5].map(nb => {
                            return (
                                <option value={nb} key={nb}>
                                    {nb}
                                </option>)
                        })}
                    </select>
                </div>
                <button className={"form-group col-md-2 btn btn-" + (this.props.hideHidden ? "warning" : "success")} onClick={this.props.onSortHiddenClick}>
                    {(this.props.hideHidden ? "Show Hiddens" : "Hide Hiddens")}
                </button>
            </div>
        )
    }
}

export default SortMenu;