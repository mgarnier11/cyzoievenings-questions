import React from 'react'
import { Component } from 'react';

class SingleQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            question: this.props.question,
            lstTypes: this.props.lstTypes
        };
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleHideClick = this.handleHideClick.bind(this);


    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.question) this.setState({ question: nextProps.question });
        if (nextProps.lstTypes) this.setState({ lstTypes: nextProps.lstTypes });
    }

    componentDidMount() {

    }

    handleUpdateClick() {
        this.props.handleUpdateClick(this.state.question);

    }

    handleDeleteClick() {
        this.props.handleDeleteClick(this.state.question);
    }

    handleHideClick() {
        this.props.handleHideClick(this.state.question);
    }

    render() {

        if (this.state.question) {
            let question = this.state.question;

            return (
                <tr className="listItem <%= question.hidden ? 'hidden' : '' %>">
                    <td>{question.text}</td>
                    {this.renderType(question.type)}
                    {this.renderStars(question.difficulty)}
                    <td className="questionCell actions">
                        <button className="btn btn-primary" onClick={this.handleUpdateClick}>Update</button>
                        <button className="btn btn-danger" onClick={this.handleDeleteClick}>Delete</button>
                        <button className="btn btn-success btnHidden" onClick={this.handleHideClick}>{(question.hidden ? 'Show' : 'Hide')}</button>
                    </td>
                </tr>
            );
        }
        else return (<tr></tr>)
    }


    renderType(typeId) {
        let type = this.state.lstTypes.find((t) => {
            return t.id == typeId;
        });

        if (type) return (<td className="questionCell type text-center"><span>{type.value}</span></td>);
    }

    renderStars(nb) {
        var stars = [];
        for (var i = 0; i < 5; i++) {
            if (i < nb) stars.push(<i className="fas fa-star" key={i}></i>);
            else stars.push(<i className="far fa-star" key={i}></i>);
        }

        return (
            <td className="questionCell difficulty">
                {stars.map(star => { return (star) })}
            </td>
        )
    }
}

export default SingleQuestion;