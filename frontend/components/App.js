import React from 'react'
import { Component } from 'react';
import Switch from 'react-switch';

import io from 'socket.io-client';

import SingleQuestion from './SingleQuestion';
import QuestionModal from './QuestionModal';
import DeleteModal from './DeleteModal';

var backend = 'https://my-game-backend.herokuapp.com/';
backend = 'http://localhost:3000'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lstQuestions: [],
            lstTypes: [],
            sortQuestionType: '0',
            sortDifficulty: '0',
            modalQuestionText: '',
            modalQuestionType: '',
            modalQuestionDifficulty: '1',
            modalQuestionUuid: '',
            questionModal: false,
            questionToDelete: null,
            deleteModal: false,
            hideHidden: true
        };
        this.socket = io(backend);

        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.openQuestionModal = this.openQuestionModal.bind(this);
        this.closeQuestionModal = this.closeQuestionModal.bind(this);
        this.upsertQuestion = this.upsertQuestion.bind(this);

        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
        this.handleHideClick = this.handleHideClick.bind(this);

        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);

        this.onSortTypeChange = this.onSortTypeChange.bind(this);
        this.onSortDifficultyChange = this.onSortDifficultyChange.bind(this);

    }

    componentDidMount() {
        this.socket.emit('getListQuestions');
        this.socket.emit('getListTypes');

        this.socket.on('returnListQuestions', (lst) => {
            this.setState({ lstQuestions: lst });
        });

        this.socket.on('returnListTypes', (lst) => {
            this.setState({ lstTypes: lst });
        });

        this.socket.on('questionAdded', (question) => {
            let tmpLstQuestions = [...this.state.lstQuestions];
            tmpLstQuestions.unshift(question);
            this.setState({ lstQuestions: tmpLstQuestions });
        });

        this.socket.on('questionDeleted', (question) => {
            let tmpLstQuestions = [...this.state.lstQuestions];

            let i = tmpLstQuestions.findIndex((q) => {
                return q.uuid == question.uuid;
            });

            if (i > -1) {
                tmpLstQuestions.splice(i, 1)
            }

            this.setState({ lstQuestions: tmpLstQuestions });

        });

        this.socket.on('questionModified', (question) => {
            let tmpLstQuestions = [...this.state.lstQuestions];

            let i = tmpLstQuestions.findIndex((q) => {
                return q.uuid == question.uuid;
            });

            if (i > -1) {
                tmpLstQuestions[i] = question;
            }

            this.setState({ lstQuestions: tmpLstQuestions });

        });
    }

    openQuestionModal() {
        this.setState({ questionModal: true });
    }

    upsertQuestion(question) {
        this.setState({ questionModal: false });

        this.socket.emit('upsertQuestion', question);
    }

    closeQuestionModal() {
        this.setState({ questionModal: false });
    }

    handleCreateClick() {
        this.setState({
            modalQuestionText: '',
            modalQuestionType: '1',
            modalQuestionDifficulty: '1',
            modalQuestionUuid: ''
        }, () => {
            this.openQuestionModal();
        });
    }

    handleUpdateClick(question) {
        this.setState({
            modalQuestionText: question.text,
            modalQuestionType: question.type,
            modalQuestionDifficulty: question.difficulty,
            modalQuestionUuid: question.uuid
        }, () => {
            this.openQuestionModal();
        });

    }

    handleDeleteClick(question) {
        this.setState({ questionToDelete: question }, () => {
            this.openDeleteModal();
        });
    }

    openDeleteModal() {

        this.setState({ deleteModal: true });
    }

    deleteQuestion(question) {
        this.setState({ deleteModal: false });

        this.socket.emit('deleteQuestion', question);
    }

    closeDeleteModal() {
        this.setState({ deleteModal: false });
    }

    onSortTypeChange(e) {
        this.setState({ sortQuestionType: e.target.value })
    }

    onSortDifficultyChange(e) {
        this.setState({ sortDifficulty: e.target.value })

    }

    handleSwitchChange(checked) {
        this.setState({ hideHidden: checked });
    }

    handleHideClick(question) {
        this.socket.emit('switchHideQuestion', {uuid: question.uuid, hidden: question.hidden, text: question.text, type: question.type, difficulty: question.difficulty});
    }

    render() {
        return (
            <div className="container app">
                <QuestionModal modalIsOpen={this.state.questionModal} upsertQuestion={this.upsertQuestion} close={this.closeQuestionModal} lstTypes={this.state.lstTypes} question={{
                    text: this.state.modalQuestionText,
                    type: this.state.modalQuestionType,
                    difficulty: this.state.modalQuestionDifficulty,
                    uuid: this.state.modalQuestionUuid
                }} />
                <DeleteModal modalIsOpen={this.state.deleteModal} yes={this.deleteQuestion} no={this.closeDeleteModal} deleteQuestion={this.deleteQuestion} question={this.state.questionToDelete} />
                <hr />
                <button className="btn btn-primary menuItem" onClick={this.handleCreateClick}>Create new Question</button>
                <select className="form-control menuItem" id="sortType" value={this.state.sortQuestionType} onChange={this.onSortTypeChange}>
                    <option value="0">None</option>
                    {this.state.lstTypes.map(type => {
                        return (<option value={type.id} key={type.id}>{type.value}</option>)
                    })}
                </select>
                <select className="form-control menuItem" id="selectDifficulty" value={this.state.sortDifficulty} onChange={this.onSortDifficultyChange}>
                    <option value="0">None</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <Switch onChange={this.handleSwitchChange} checked={this.state.hideHidden} id="normal-switch" className="switchButton menuItem" />
                <hr id="afterSort" />
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
                        {this.renderList(this.state.lstQuestions)}
                    </tbody>
                </table>
            </div>
        )
    }

    renderList(lstQuestions) {
        if (lstQuestions) {
            return (
                lstQuestions.map((question) => {
                    if (this.isHidden(question)) return (<SingleQuestion question={question} lstTypes={this.state.lstTypes} key={question.uuid} handleUpdateClick={this.handleUpdateClick} handleDeleteClick={this.handleDeleteClick} handleHideClick={this.handleHideClick}/>)
                })
            )
        }
    }

    isHidden(question) {
        if (this.state.hideHidden && question.hidden) {
            return false;
        } else {
            return this.isDisplayed(question);
        }
    }

    isDisplayed(question) {
        if (this.state.sortQuestionType == '0' && this.state.sortDifficulty == '0') return true;
        else if (this.state.sortQuestionType != '0' && this.state.sortDifficulty == '0') {
            return this.sortQuestionType(question);
        } else if (this.state.sortDifficulty != '0' && this.state.sortQuestionType == '0') {
            return this.sortDifficulty(question);
        } else {
            if (this.state.sortDifficulty == question.difficulty && this.state.sortQuestionType == question.type) return true;
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

    sortQuestionType(question) {
        if (this.state.sortQuestionType == '0') return true;
        else {
            if (this.state.sortQuestionType == question.type) return true;
            else return false;
        }
    }
}

export default App;