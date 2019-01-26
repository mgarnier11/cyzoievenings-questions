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
                    <h3>Delete</h3>
                    <div>
                        {(this.state.question ? this.state.question.text : '')}
                    </div>
                    <div className="form-group text-center">
                        <button className="btn btn-primary" onClick={this.accept}>Yes</button>
                        <button className="btn btn-primary" onClick={this.props.deny}>No</button>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default DeleteModal;
