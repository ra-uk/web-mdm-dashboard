import React, { Component } from "react"
import PropTypes from 'prop-types'
import Loading from '../../../Utils/Loading'
import ContentPane from '../../../Utils/ContentPane'

class Feedback extends Component {

    constructor(props) {
        super(props)

        this.state = {
            feedbackSent: false
        }
    }

    send = () => {
        this.props.sendFeedback()
        this.setState({
            feedbackSent: true
        })
        
    }
    
    render() {

        if(this.props.isLoading) {
            return <Loading message="Sending..." />
        } else if(this.state.feedbackSent) {
            return (
                <ContentPane itemListPaneWidth={this.props.itemListPaneWidth}>
                    <div className="listPane" style={{ padding: 0}}>
                        <h2 className="titleContentPane" onClick={() => this.props.changeSelectItem(null)}>
                            {'<'} Help Center
                        </h2>
                        <br />
                        <div style={{ textAlign: 'center' }}>
                            <h3>Thank you!</h3>
                            <p>your submission has been received</p>
                        </div>
                    </div>
                </ContentPane>
            )
        } else {
            return (
                <ContentPane itemListPaneWidth={this.props.itemListPaneWidth}>
                    <h2 className="titleContentPane" onClick={() => this.props.changeSelectItem(null)}>
                        {'<'} Help Center
                    </h2>
                    <div style={{padding: '0 10px'}}>
                        <h3>Feedback</h3>
                        <div className="feedback">
                            <textarea className="win-textbox feedback-textarea"/>
                            <button className="win-button" style={{float: 'right'}} onClick={this.send}>
                                Send
                            </button>
                        </div>
                    </div>
                </ContentPane>
            )
        }
    }
}

Feedback.propTypes = {
    itemListPaneWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    changeSelectItem: PropTypes.func.isRequired,
    sendFeedback: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired   
}

export default Feedback