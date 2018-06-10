import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProfileInformation from '../components/ProfileInformation';
import TopicList from '../components/TopicList';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';
import epochTimeConverter from '../helpers/EpochTimeConverter';

const contract = "Forum";
const contractMethods = {
    getDateOfRegister: "getUserDateOfRegister",
    getOrbitDB: "getOrbitDBId",
    getUserTopics: "getUserTopics",
    getUserPosts: "getUserPosts"
};

class Profile extends Component {
    constructor(props, context) {
        super(props);

        //THIS WILL CHANGE WITH ACTUAL DATA
        this.match = {
            username: this.props.user.username,
            userAddress: this.props.user.address
        }

        this.handleTabClick = this.handleTabClick.bind(this);

        this.drizzle = context.drizzle;

        this.state = {
            viewSelected: "topics",
            username: this.match.username, // TODO actually get them from match
            userAddress: this.match.userAddress, // when router is fixed
            dateOfRegister: null,
            orbitDBId: this.match.address === this.props.user.address ? this.props.orbitDB.id : "",
            getDateOfRegisterTransactionState: null,
            getOrbitDBTransactionState: this.match.address === this.props.user.address ? "SUCCESS" : null,
            getTopicsTransactionState: null,
            getPostsTransactionState: null,
            topicIDs: [],
            postIDs: []
        };
    }

    handleTabClick(id) {
        this.setState({viewSelected: id});
    }

    render() {
        return (
            <div className="pure-g">
                <ProfileInformation username={this.state.username}
                    address={this.state.userAddress}
                    orbitAddress={this.state.orbitDBId}
                    numberOfTopics={this.state.topicIDs.length}
                    numberOfPosts={this.state.postIDs.length}
                    dateOfRegister={this.state.dateOfRegister}
                    self/>
                <div className="pure-u-1-1 profile-tabs-header">
                    <p onClick={() => (this.handleTabClick("topics"))}
                        className={this.state.viewSelected === "topics" ? "profile-tab-selected" : ""}>
                        Topics
                    </p>
                    <p onClick={() => (this.handleTabClick("posts"))}
                        className={this.state.viewSelected === "posts" ? "profile-tab-selected" : ""}>
                        Posts
                    </p>
                </div>
                {this.state.viewSelected === "topics"
                ?<div className="profile-tab">
                    {this.state.getTopicsTransactionState === "SUCCESS"
                    ? <TopicList topicIDs={this.state.topicIDs}/>
                    : <LoadingSpinner />
                    }
                </div>
                :<div className="profile-tab">
                    {this.state.getPostsTransactionState === "SUCCESS"
                    ? <PostList postIDs={this.state.postIDs}/>
                    : <LoadingSpinner />
                    }
                </div>
                }
            </div>
        );
    }

    componentWillReceiveProps() {
        if (this.state.getDateOfRegisterTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                this.dateOfRegisterKey = this.drizzle.contracts[contract]
                    .methods[contractMethods.getDateOfRegister].cacheCall(this.state.userAddress);
                this.setState({'getDateOfRegisterTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getDateOfRegisterTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState
                .contracts[contract][contractMethods.getDateOfRegister])[this.dateOfRegisterKey];
            if (dataFetched){
                this.setState({
                    'dateOfRegister': epochTimeConverter(dataFetched.value),
                    'getDateOfRegisterTransactionState': "SUCCESS"
                });
            }
        }

        if (this.state.getOrbitDBTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                this.orbitDBIdKey = this.drizzle.contracts[contract]
                    .methods[contractMethods.getOrbitDB].cacheCall(this.state.userAddress);
                this.setState({'getOrbitDBTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getOrbitDBTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState
                .contracts[contract][contractMethods.getOrbitDB])[this.orbitDBIdKey];
            if (dataFetched){
                this.setState({
                    'orbitDBId': dataFetched.value,
                    'getOrbitDBTransactionState': "SUCCESS"
                });
            }
        }

        if (this.state.getTopicsTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                this.getTopicsKey = this.drizzle.contracts[contract]
                    .methods[contractMethods.getUserTopics].cacheCall(this.state.userAddress);
                this.setState({'getTopicsTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getTopicsTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState
                .contracts[contract][contractMethods.getUserTopics])[this.getTopicsKey];
            if (dataFetched){
                this.setState({
                    'topicIDs': dataFetched.value,
                    'getTopicsTransactionState': "SUCCESS"
                });
            }
        }

        if (this.state.getPostsTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                this.getPostsKey = this.drizzle.contracts[contract]
                    .methods[contractMethods.getUserPosts].cacheCall(this.state.userAddress);
                this.setState({'getPostsTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getPostsTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState
                .contracts[contract][contractMethods.getUserPosts])[this.getPostsKey];
            if (dataFetched){
                this.setState({
                    'postIDs': dataFetched.value,
                    'getPostsTransactionState': "SUCCESS"
                });
            }
        }
    }
}

Profile.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Forum: state.contracts.Forum,
    user: state.user,
    orbitDB: state.orbitDB,
    drizzleStatus: state.drizzleStatus
  }
};

const ProfileContainer = drizzleConnect(Profile, mapStateToProps);

export default ProfileContainer;