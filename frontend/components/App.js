import React from 'react'
import { Component } from 'react';
import Switch from 'react-switch';

import io from 'socket.io-client';

import QuestionModal from './QuestionModal';
import DeleteModal from './DeleteModal';

var backend = 'https://my-game-backend.herokuapp.com/';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lstQuestions: [],
            lstQuestionsDisplayed: [],
            lstTypes: [],
            question: null,
            questionModalOpenned: false,
            deleteModalOpenned: false,
            sortDifficulty: '0',
            sortType: '0',
            hideHidden: true
        };
        this.socket = io(backend);

        this.onCreateQuestionClick = this.onCreateQuestionClick.bind(this);

        this.onAcceptQuestionModal = this.onAcceptQuestionModal.bind(this);
        this.onDenyQuestionModal = this.onDenyQuestionModal.bind(this);

        this.onAcceptDeleteModal = this.onAcceptDeleteModal.bind(this);
        this.onDenyDeleteModal = this.onDenyDeleteModal.bind(this);

        this.onSortDifficultyChange = this.onSortDifficultyChange.bind(this);
        this.onSortTypeChange = this.onSortTypeChange.bind(this);
        this.onSortHiddenChange = this.onSortHiddenChange.bind(this);
    }

    onUpdateQuestionClick = question => e => {
        this.setState({question: question, questionModalOpenned: true})
    }

    onDeleteQuestionClick = question => e => {
        this.setState({question: question, deleteModalOpenned: true})
    }

    onHideQuestionClick = question => e => {
        this.socket.emit('switchHideQuestion', question);
    }

    onCreateQuestionClick() {
        this.setState({question: {}, questionModalOpenned: true})
    }

    onAcceptQuestionModal(question) {
        this.socket.emit('upsertQuestion', question);

        this.setState({questionModalOpenned: false});
    }

    onDenyQuestionModal() {
        this.setState({questionModalOpenned: false});
    }

    onAcceptDeleteModal(question) {
        question.type = question.type.id;

        this.socket.emit('deleteQuestion', question);

        this.setState({deleteModalOpenned: false});
    }

    onDenyDeleteModal() {
        this.setState({deleteModalOpenned: false});
    }

    onSortTypeChange(e) {
        this.setState({sortType: e.target.value}, () => this.setQuestionDisplayed());
    }
    
    onSortDifficultyChange(e) {
        this.setState({sortDifficulty: e.target.value}, () => this.setQuestionDisplayed())
    }

    onSortHiddenChange() {
        this.setState({ hideHidden: !this.state.hideHidden }, () => this.setQuestionDisplayed());
    }

    setQuestionDisplayed() {
        let tmpLstQuestions = [];

        this.state.lstQuestions.forEach(question => {
            if (this.isHidden(question)) tmpLstQuestions.push(question);
        });

        this.setState({lstQuestionsDisplayed: tmpLstQuestions});
    }

    componentDidMount() {
        this.socket.emit('getListQuestions');
        this.socket.emit('getListTypes');

        this.socket.on('returnListQuestions', (lst) => {
            this.setState({ lstQuestions: lst }, () => this.setQuestionDisplayed());
        });

        this.socket.on('returnListTypes', (lst) => {
            this.setState({ lstTypes: lst });
        });

        this.socket.on('questionAdded', (question) => {
            let tmpLstQuestions = [...this.state.lstQuestions];
            tmpLstQuestions.unshift(question);
            this.setState({ lstQuestions: tmpLstQuestions }, () => this.setQuestionDisplayed());
        });

        this.socket.on('questionDeleted', (question) => {
            let tmpLstQuestions = [...this.state.lstQuestions];

            let i = tmpLstQuestions.findIndex((q) => {
                return q.uuid == question.uuid;
            });

            if (i > -1) {
                tmpLstQuestions.splice(i, 1)
            }

            this.setState({ lstQuestions: tmpLstQuestions }, () => this.setQuestionDisplayed());

        });

        this.socket.on('questionModified', (question) => {
            let tmpLstQuestions = [...this.state.lstQuestions];

            let i = tmpLstQuestions.findIndex((q) => {
                return q.uuid == question.uuid;
            });

            if (i > -1) {
                tmpLstQuestions[i] = question;
            }

            this.setState({ lstQuestions: tmpLstQuestions }, () => this.setQuestionDisplayed());

        });
    }

    render() {
        return (
            <div className="container app">
                <QuestionModal modalIsOpen={this.state.questionModalOpenned} accept={this.onAcceptQuestionModal} deny={this.onDenyQuestionModal} lstTypes={this.state.lstTypes} question={this.state.question}/>
                <DeleteModal modalIsOpen={this.state.deleteModalOpenned} accept={this.onAcceptDeleteModal} deny={this.onDenyDeleteModal} question={this.state.question} />
                <div className="form-row">
                    <button className="form-group col-md-2 btn btn-primary" onClick={this.onCreateQuestionClick}>Create new Question</button>
                    <div className="form-group col-md-4">
                        <label>Sort Types</label>
                        <select className="form-control" value={this.state.sortType} onChange={this.onSortTypeChange}>
                            <option value="0">None</option>
                            {this.state.lstTypes.map(type => {
                                return (<option value={type.id} key={type.id}>{type.value}</option>)
                            })}
                        </select>
                    </div>
                    <div className="form-group col-md-4">
                        <label>Sort Difficulty</label>
                        <select className="form-control" value={this.state.sortDifficulty} onChange={this.onSortDifficultyChange}>
                            <option value="0" key={0}>None</option>
                            {[1,2,3,4,5].map(nb => {
                                return(<option value={nb} key={nb}>{nb}</option>)
                            })}
                        </select>
                    </div>
                    <button className={"form-group col-md-2 btn btn-" + (this.state.hideHidden ? "warning": "success")} onClick={this.onSortHiddenChange}>{(this.state.hideHidden? "Show Hiddens": "Hide Hiddens")}</button>
                </div>
                {this.state.lstQuestionsDisplayed.length} Questions displayed
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th className="">Text</th>
                            <th className="text-center">Type</th>
                            <th className="text-center">Difficulty</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.lstQuestionsDisplayed.map((question) => {
                            return this.renderSingleQuestion(question);
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    renderSingleQuestion(question) {
        if (question) {
            return (
                <tr className="listItem" key={question.uuid}>
                    <td>{question.text}</td>
                    {this.renderType(question.type)}
                    <td className="questionCell difficulty">
                        {this.renderStars(question.difficulty)}
                    </td>
                    <td className="questionCell actions">
                        <button className="btn btn-primary" onClick={this.onUpdateQuestionClick(question)}>Update</button>
                        <button className="btn btn-danger" onClick={this.onDeleteQuestionClick(question)}>Delete</button>
                        <button className={"btn btn-" + (question.hidden ? 'warning' : 'success') + " btnHidden"} onClick={this.onHideQuestionClick(question)}>{(question.hidden ? 'Show' : 'Hide')}</button>
                    </td>
                </tr>
            );
        }
    }

    renderType(type) {
        if (type) return (<td className="questionCell type text-center"><span>{type.value}</span></td>);
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

    isHidden(question) {
        if (this.state.hideHidden && question.hidden) {
            return false;
        } else {
            return this.isDisplayed(question);
        }
    }

    isDisplayed(question) {
        if (this.state.sortType == '0' && this.state.sortDifficulty == '0') return true;
        else if (this.state.sortType != '0' && this.state.sortDifficulty == '0') {
            return this.sortType(question);
        } else if (this.state.sortDifficulty != '0' && this.state.sortType == '0') {
            return this.sortDifficulty(question);
        } else {
            if (this.state.sortDifficulty == question.difficulty && this.state.sortType == question.type.id) return true;
            else return false;
        }
    }

    sortDifficulty(question) {
        if (this.state.sortDifficulty == '0') return true;
        else {
            if (this.state.sortDifficulty == question.difficulty) return true;
            else return false;
        }
    }

    sortType(question) {
        if (this.state.sortType == '0') return true;
        else {
            if (this.state.sortType == question.type.id) return true;
            else return false;
        }
    }
}

export default App;