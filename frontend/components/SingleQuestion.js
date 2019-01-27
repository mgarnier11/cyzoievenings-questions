import React from 'react'
import { Component } from 'react';

class SingleQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            question: this.props.question
        };

        this.onUpdateQuestionClick = this.onUpdateQuestionClick.bind(this);
        this.onDeleteQuestionClick = this.onDeleteQuestionClick.bind(this);
        this.onHideQuestionClick = this.onHideQuestionClick.bind(this);
    }

    onUpdateQuestionClick() {
        this.props.onUpdateQuestionClick(this.state.question);
    }

    onDeleteQuestionClick() {
        this.props.onDeleteQuestionClick(this.state.question);
    }

    onHideQuestionClick() {
        this.props.onHideQuestionClick(this.state.question)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.question) this.setState({ question: nextProps.question });
    }


    render() {
        let question = this.state.question;
        return (
            <tr className="listItem" key={question.uuid}>
                <td>
                    {(question ? question.text : '')}
                </td>
                <td className="questionCell type text-center">
                    {(question.type ? question.type.value : '')}
                </td>
                <td className="questionCell difficulty">
                    {this.renderStars(question.difficulty)}
                </td>
                <td className="questionCell actions">
                    <button className="btn btn-primary" onClick={this.onUpdateQuestionClick}>Update</button>
                    <button className="btn btn-danger" onClick={this.onDeleteQuestionClick}>Delete</button>
                    <button className={"btn btn-" + (question.hidden ? 'warning' : 'success') + " btnHidden"} onClick={this.onHideQuestionClick}>{(question.hidden ? 'Show' : 'Hide')}</button>
                </td>
            </tr>
        );
    }

    renderStars(nb) {
        var stars = [];
        for (var i = 0; i < 5; i++) {
            if (i < nb) stars.push(<i className="fas fa-star" key={i}></i>);
            else stars.push(<i className="far fa-star" key={i}></i>);
        }

        return (
            stars.map(star => { return (star) })
        )
    }
}

export default SingleQuestion;