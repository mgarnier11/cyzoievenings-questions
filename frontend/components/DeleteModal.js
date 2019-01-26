import React, { PropTypes } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#app');


class DeleteModal extends React.Component {

    /**
     * className constructor.
     */
    constructor(props, context) {
        super(props, context);

        this.state = {
            question: this.props.question
        };

        this.accept = this.accept.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.question) this.setState({ question: nextProps.question });
    }

    accept() {
        this.props.accept(this.state.question);
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
                className="deleteQuestionModal">
                <div className="form">
                    <h3>Delete Question</h3>
                    <div className="form-group">
                        <label htmlFor="questionText">Question</label>
                        <textarea className="form-control" id="questionText" rows="4" name="questionText" value={(this.state.question ? this.state.question.text : '')} disabled></textarea>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="selectType">Question Type</label>
                            <input type="text" className="form-control" value={(this.state.question ? (this.state.question.type? this.state.question.type.value : '') : '')} disabled></input>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="selectDifficulty">Question Difficulty</label>
                            <input type="text" className="form-control" value={(this.state.question ? this.state.question.difficulty : '')} disabled></input>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <button className="btn btn-primary offset-md-1 col-md-10" onClick={this.accept}>Delete</button>
                            
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

export default DeleteModal;
