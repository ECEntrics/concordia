import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';

import { Grid, Form, TextArea, Button, Icon, Divider } from 'semantic-ui-react'

import TimeAgo from 'react-timeago';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

import { createPost } from '../redux/actions/transactionsMonitorActions';

class NewPost extends Component {
    constructor(props, context) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
        this.validateAndPost = this.validateAndPost.bind(this);

        this.newPostOuterRef = React.createRef();

        this.state = {
            postSubjectInput: this.props.subject ? this.props.subject : "",
            postContentInput: '',
            postSubjectInputEmptySubmit: false,
            postContentInputEmptySubmit: false,
            previewEnabled: false,
            previewDate: ""
        };
    }

    async validateAndPost() {
        if (this.state.postSubjectInput === '' || this.state.postContentInput === ''){
            this.setState({
                postSubjectInputEmptySubmit: this.state.postSubjectInput === '',
                postContentInputEmptySubmit: this.state.postContentInput === ''
            });
            return;
        }

        this.props.store.dispatch(
            createPost(this.props.topicID,
                {
                    postSubject: this.state.postSubjectInput,
                    postMessage: this.state.postContentInput
                }
            )
        );
        this.props.onPostCreated();
    }

    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handlePreviewToggle() {
        this.setState((prevState, props) => ({
            previewEnabled: !prevState.previewEnabled,
            previewDate: this.getDate()
        }));
    }

    getDate() {
        const currentdate = new Date();
        return ((currentdate.getMonth() + 1)  + " "
            + currentdate.getDate() + ", "
            + currentdate.getFullYear() + ", "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds());
    }

    render() {
        return (
            <div className="post" ref={this.newPostOuterRef}>
                <Divider horizontal>
                    <span className="grey-text">#{this.props.postIndex}</span>
                </Divider>
                <Grid>
                    <Grid.Row columns={16} stretched>
                        <Grid.Column width={1} className="user-avatar">
                            <UserAvatar
                                size="52"
                                className="inline user-avatar"
                                src={this.props.avatarUrl}
                                name={this.props.user.username}
                            />
                        </Grid.Column>
                        <Grid.Column width={15}>
                            <div className="">
                                <div className="stretch-space-between">
                                    <span><strong>{this.props.user.username}</strong></span>
                                    <span className="grey-text">
                                        {this.state.previewEnabled && 
                                           <TimeAgo date={this.state.previewDate}/>
                                        }
                                    </span>
                                </div>
                                <div className="stretch-space-between">
                                    <span><strong>
                                        {this.state.previewEnabled &&
                                            ("Subject: " + this.state.postSubjectInput)
                                        }
                                    </strong></span>
                                </div>
                                <div className="post-content">
                                    <div style={{display: this.state.previewEnabled ? "block" : "none"}}>
                                        <ReactMarkdown source={this.state.postContentInput}
                                            className="markdown-preview" />
                                    </div>
                                    <Form className="topic-form">
                                        <Form.Input key={"postSubjectInput"}
                                            style={{display: this.state.previewEnabled ? "none" : ""}}
                                            name={"postSubjectInput"}
                                            error={this.state.postSubjectInputEmptySubmit}
                                            type="text"
                                            value={this.state.postSubjectInput}
                                            placeholder="Subject"
                                            id="postSubjectInput"
                                            onChange={this.handleInputChange} />
                                        <TextArea key={"postContentInput"}
                                            style={{display: this.state.previewEnabled ? "none" : ""}}
                                            name={"postContentInput"}
                                            className={this.state.postContentInputEmptySubmit ? "form-textarea-required" : ""}
                                            value={this.state.postContentInput}
                                            placeholder="Post"
                                            id="postContentInput"
                                            onChange={this.handleInputChange}
                                            rows={4} autoHeight />
                                        <br/><br/>
                                        <Button.Group>
                                            <Button key="submit"
                                                type="button"
                                                onClick={this.validateAndPost}
                                                color='teal'
                                                animated>
                                                    <Button.Content visible>Post</Button.Content>
                                                    <Button.Content hidden>
                                                        <Icon name='reply' />
                                                    </Button.Content>
                                            </Button>
                                            <Button type="button"
                                                onClick={this.handlePreviewToggle}
                                                color='yellow'>
                                                {this.state.previewEnabled ? "Edit" : "Preview"}
                                            </Button>
                                            <Button type="button"
                                                onClick={this.props.onCancelClick}
                                                color='red'>
                                                Cancel
                                            </Button>
                                        </Button.Group>
                                    </Form>
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }

    componentDidMount(){
        this.newPostOuterRef.current.scrollIntoView(true);
    }
}

const mapStateToProps = state => {
    return {
        orbitDB: state.orbitDB,
        user: state.user
    }
};

export default drizzleConnect(NewPost, mapStateToProps);