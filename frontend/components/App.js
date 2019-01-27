import React from 'react'
import { Component } from 'react';

import io from 'socket.io-client';

import QuestionModal from './QuestionModal';
import DeleteModal from './DeleteModal';
import SingleQuestion from './SingleQuestion';
import SortMenu from './SortMenu';

var backend = 'https://my-game-backend.herokuapp.com/';
backend = 'http://localhost:3000'

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
        this.onUpdateQuestionClick = this.onUpdateQuestionClick.bind(this);
        this.onDeleteQuestionClick = this.onDeleteQuestionClick.bind(this);
        this.onHideQuestionClick = this.onHideQuestionClick.bind(this);

        this.onAcceptQuestionModal = this.onAcceptQuestionModal.bind(this);
        this.onDenyQuestionModal = this.onDenyQuestionModal.bind(this);

        this.onAcceptDeleteModal = this.onAcceptDeleteModal.bind(this);
        this.onDenyDeleteModal = this.onDenyDeleteModal.bind(this);

        this.onSortDifficultyChange = this.onSortDifficultyChange.bind(this);
        this.onSortTypeChange = this.onSortTypeChange.bind(this);
        this.onSortHiddenChange = this.onSortHiddenChange.bind(this);
    }

    onUpdateQuestionClick(question) {
        this.setState({ question: question, questionModalOpenned: true })
    }

    onDeleteQuestionClick(question) {
        this.setState({ question: question, deleteModalOpenned: true })
    }

    onHideQuestionClick(question) {
        this.socket.emit('switchHideQuestion', question);
    }

    onCreateQuestionClick() {
        this.setState({ question: {}, questionModalOpenned: true })
    }

    onAcceptQuestionModal(question) {
        this.socket.emit('upsertQuestion', question);

        this.setState({ questionModalOpenned: false });
    }

    onDenyQuestionModal() {
        this.setState({ questionModalOpenned: false });
    }

    onAcceptDeleteModal(question) {
        this.socket.emit('deleteQuestion', question);

        this.setState({ deleteModalOpenned: false });
    }

    onDenyDeleteModal() {
        this.setState({ deleteModalOpenned: false });
    }

    onSortTypeChange(e) {
        this.setState({ sortType: e.target.value }, () => this.setQuestionDisplayed());
    }

    onSortDifficultyChange(e) {
        this.setState({ sortDifficulty: e.target.value }, () => this.setQuestionDisplayed())
    }

    onSortHiddenChange() {
        console.log('test');
        this.setState({ hideHidden: !this.state.hideHidden }, () => this.setQuestionDisplayed());
    }

    setQuestionDisplayed() {
        let tmpLstQuestions = [];

        this.state.lstQuestions.forEach(question => {
            if (this.isHidden(question)) tmpLstQuestions.push(question);
        });

        this.setState({ lstQuestionsDisplayed: tmpLstQuestions });
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
                return q.id == question.id;
            });

            if (i > -1) {
                tmpLstQuestions.splice(i, 1)
            }

            this.setState({ lstQuestions: tmpLstQuestions }, () => this.setQuestionDisplayed());

        });

        this.socket.on('questionModified', (question) => {
            let tmpLstQuestions = [...this.state.lstQuestions];

            let i = tmpLstQuestions.findIndex((q) => {
                return q.id == question.id;
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
                <QuestionModal modalIsOpen={this.state.questionModalOpenned} accept={this.onAcceptQuestionModal} deny={this.onDenyQuestionModal} lstTypes={this.state.lstTypes} question={this.state.question} />
                <DeleteModal modalIsOpen={this.state.deleteModalOpenned} accept={this.onAcceptDeleteModal} deny={this.onDenyDeleteModal} question={this.state.question} />
                <SortMenu
                    lstTypes={this.state.lstTypes}
                    sortType={this.state.sortType}
                    sortDifficulty={this.state.sortDifficulty}
                    onCreateQuestionClick={this.onCreateQuestionClick}
                    onSortTypeChange={this.onSortTypeChange}
                    onSortDifficultyChange={this.onSortDifficultyChange}
                    onSortHiddenChange={this.onSortHiddenChange}
                    hideHidden={this.state.hideHidden}


                />
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
                            return (<SingleQuestion
                                question={question}
                                onUpdateQuestionClick={this.onUpdateQuestionClick}
                                onDeleteQuestionClick={this.onDeleteQuestionClick}
                                onHideQuestionClick={this.onHideQuestionClick}
                            />)
                        })}
                    </tbody>
                </table>
            </div>
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