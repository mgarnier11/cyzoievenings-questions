import React, { PropTypes } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#app');


class QuestionModal extends React.Component {

    /**
     * className constructor.
     */
    constructor(props, context) {
        super(props, context);

        this.state = {
            questionText: "",
            questionDifficulty: 1,
            questionType: 1,
            questionUuid: '',
            lstTypes: this.props.lstTypes
        };

        this.onQuestionTextChange = this.onQuestionTextChange.bind(this);
        this.onSelectQuestionDifficultyChange = this.onSelectQuestionDifficultyChange.bind(this);
        this.onSelectQuestionTypeChange = this.onSelectQuestionTypeChange.bind(this);

        this.accept = this.accept.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.question) {
            this.setState({
                questionText: (nextProps.question.text || ''),
                questionDifficulty: (nextProps.question.difficulty || 1),
                questionType: (nextProps.question.type ? nextProps.question.type.id || 1 : 1),
                questionUuid: (nextProps.question.uuid || "")

            })
        }
        if (nextProps.lstTypes) this.setState({ lstTypes: nextProps.lstTypes });
    }

    onQuestionTextChange(e) {
        this.setState({ questionText: e.target.value })
    }

    onSelectQuestionDifficultyChange(e) {
        this.setState({ questionDifficulty: e.target.value })
    }

    onSelectQuestionTypeChange(e) {
        this.setState({ questionType: e.target.value })
    }

    accept() {
        this.props.accept({ 
            uuid: this.state.questionUuid,
            text: this.state.questionText, 
            type: parseInt(this.state.questionType), 
            difficulty: parseInt(this.state.questionDifficulty)
        })
    }


    /**
     * Render the component.
     */
    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.closeModal}
                shouldCloseOnEsc={true}
                shouldCloseOnOverlayClick={true}
                className="questionModal">
                <div className="form">
                    <h3>Question</h3>
                    <div className="form-group">
                        <label htmlFor="questionText">Question</label>
                        <textarea className="form-control" id="questionText" rows="4" name="questionText" value={this.state.questionText} onChange={this.onQuestionTextChange} ></textarea>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="selectType">Question Type</label>
                            <select className="form-control" id="selectType" name="questionType" value={this.state.questionType} onChange={this.onSelectQuestionTypeChange}>
                                {this.state.lstTypes.map(type => {
                                    return (<option value={type.id} key={type.id}>{type.value}</option>)
                                })}
                            </select>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="selectDifficulty">Question Difficulty</label>
                            <select className="form-control" id="selectDifficulty" name="questionDifficulty" value={this.state.questionDifficulty} onChange={this.onSelectQuestionDifficultyChange}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <button className="btn btn-primary offset-md-1 col-md-10" onClick={this.accept}>Send Question</button>
                            
                        </div>
                        <div className="form-group col-md-6">
                            <button className="btn btn-danger offset-md-1 col-md-10" onClick={this.props.deny}>Cancel</button>
                        </div>
                    </div>

                </div>
            </Modal>
        );
    }
}

export default QuestionModal;
