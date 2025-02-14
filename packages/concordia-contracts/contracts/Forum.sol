//SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

contract Forum {
    // Error messages for require()
    string public constant USER_HAS_SIGNED_UP = "User has already signed up.";
    string public constant USER_HAS_NOT_SIGNED_UP = "User hasn't signed up yet.";
    string public constant USERNAME_TAKEN = "Username is already taken.";
    string public constant TOPIC_DOES_NOT_EXIST = "Topic doesn't exist.";
    string public constant POST_DOES_NOT_EXIST = "Post doesn't exist.";
    string public constant INVALID_RANGE = "Invalid range.";

    //----------------------------------------USER----------------------------------------
    struct User {
        string username;    // TODO: set an upper bound instead of arbitrary string
        uint[] topicIDs;    // IDs of the topics the user created
        uint[] postIDs;    // IDs of the posts the user created
        uint timestamp;
        bool signedUp;    // Helper variable for hasUserSignedUp()
    }

    uint public numUsers;   // Total number of users

    mapping(address => User) users;
    mapping(string => address) usernameAddresses;
    address[] userAddresses;

    event UserSignedUp(string username, address userAddress);
    event UsernameUpdated(string newName, string oldName, address userAddress);

    function signUp(string memory username) public returns (bool) {
        require(!hasUserSignedUp(msg.sender), USER_HAS_SIGNED_UP);
        require(!isUserNameTaken(username), USERNAME_TAKEN);
        users[msg.sender] = User(username, new uint[](0), new uint[](0), block.timestamp, true);
        usernameAddresses[username] = msg.sender;
        userAddresses.push(msg.sender);
        numUsers++;
        emit UserSignedUp(username, msg.sender);
        return true;
    }

    function updateUsername(string memory newUsername) public returns (bool) {
        require(hasUserSignedUp(msg.sender), USER_HAS_NOT_SIGNED_UP);
        require(!isUserNameTaken(newUsername), USERNAME_TAKEN);
        string memory oldUsername = getUsername(msg.sender);
        delete usernameAddresses[users[msg.sender].username];
        users[msg.sender].username = newUsername;
        usernameAddresses[newUsername] = msg.sender;
        emit UsernameUpdated(newUsername, oldUsername, msg.sender);
        return true;
    }

    function getUsername(address userAddress) public view returns (string memory) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress].username;
    }

    function getUserAddress(string memory username) public view returns (address) {
        return usernameAddresses[username];
    }

    function hasUserSignedUp(address userAddress) public view returns (bool) {
        return users[userAddress].signedUp;
    }

    function isUserNameTaken(string memory username) public view returns (bool) {
        if (getUserAddress(username) != address(0))
            return true;
        return false;
    }

    function getUserTopics(address userAddress, uint startIndex, uint endIndex) public view returns (uint[] memory) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        require(startIndex <= endIndex && users[userAddress].topicIDs.length > endIndex, INVALID_RANGE);
        uint length = endIndex - startIndex + 1;
        uint[] memory userTopics = new uint[](length);
        uint counter = 0;
        for (uint i = startIndex; i <= endIndex; i++) {
            userTopics[counter] = users[userAddress].topicIDs[i];
            counter++;
        }
        return userTopics;
    }

    function getUserPosts(address userAddress, uint startIndex, uint endIndex) public view returns (uint[] memory) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        require(startIndex <= endIndex && users[userAddress].postIDs.length > endIndex, INVALID_RANGE);
        uint length = endIndex - startIndex + 1;
        uint[] memory userPosts = new uint[](length);
        uint counter = 0;
        for (uint i = startIndex; i <= endIndex; i++) {
            userPosts[counter] = users[userAddress].postIDs[i];
            counter++;
        }
        return userPosts;
    }

    function getUserTopicCount(address userAddress) public view returns (uint) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress].topicIDs.length;
    }

    function getUserPostCount(address userAddress) public view returns (uint) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress].postIDs.length;
    }

    function getUserDateOfRegister(address userAddress) public view returns (uint) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress].timestamp;
    }

    function getUser(address userAddress) public view returns (User memory) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress];
    }

    function getUserAddresses() public view returns (address[] memory) {
        return userAddresses;
    }

    function getUsernames(address[] memory userAddressesArray) public view returns (string[] memory) {
        string[] memory usernamesArray = new string[](userAddressesArray.length);

        for (uint i = 0; i < userAddressesArray.length; i++) {
            usernamesArray[i] = getUsername(userAddressesArray[i]);
        }

        return usernamesArray;
    }

    //----------------------------------------POSTING----------------------------------------
    struct Topic {
        uint topicID;
        address author;
        uint timestamp;
        uint[] postIDs;
    }

    struct Post {
        uint postID;
        address author;
        uint timestamp;
        uint topicID;
    }

    uint public numTopics;   // Total number of topics
    uint public numPosts;    // Total number of posts

    mapping(uint => Topic) topics;
    mapping(uint => Post) posts;

    event TopicCreated(uint topicID, uint postID);
    event PostCreated(uint postID, uint topicID);

    function createTopic() public returns (uint, uint) {
        require(hasUserSignedUp(msg.sender), USER_HAS_NOT_SIGNED_UP);
        //Creates topic
        uint topicID = numTopics++;
        topics[topicID] = Topic(topicID, msg.sender, block.timestamp, new uint[](0));
        users[msg.sender].topicIDs.push(topicID);

        //Adds first post to topic
        uint postID = numPosts++;
        posts[postID] = Post(postID, msg.sender, block.timestamp, topicID);
        topics[topicID].postIDs.push(postID);
        users[msg.sender].postIDs.push(postID);

        emit TopicCreated(topicID, postID);
        return (topicID, postID);
    }

    function createPost(uint topicID) public returns (uint) {
        require(hasUserSignedUp(msg.sender), USER_HAS_NOT_SIGNED_UP);
        require(topicExists(topicID), TOPIC_DOES_NOT_EXIST);
        uint postID = numPosts++;
        posts[postID] = Post(postID, msg.sender, block.timestamp, topicID);
        topics[topicID].postIDs.push(postID);
        users[msg.sender].postIDs.push(postID);
        emit PostCreated(postID, topicID);
        return postID;
    }

    function topicExists(uint topicID) public view returns (bool) {
        return topicID < numTopics;
    }

    function postExists(uint postID) public view returns (bool) {
        return postID < numPosts;
    }

    function getTopic(uint topicID) public view returns (address, string memory, uint, uint[] memory) {
        require(topicExists(topicID), TOPIC_DOES_NOT_EXIST);
        return (
            topics[topicID].author,
            users[topics[topicID].author].username,
            topics[topicID].timestamp,
            topics[topicID].postIDs
        );
    }

    function getTopicPostCount(uint topicID) public view returns (uint) {
        require(topicExists(topicID), TOPIC_DOES_NOT_EXIST);
        return topics[topicID].postIDs.length;
    }

    function getTopicPosts(uint topicID, uint startIndex, uint endIndex) public view returns (uint[] memory) {
        require(topicExists(topicID), TOPIC_DOES_NOT_EXIST);
        require(startIndex <= endIndex && topics[topicID].postIDs.length > endIndex, INVALID_RANGE);
        uint length = endIndex - startIndex + 1;
        uint[] memory topicPosts = new uint[](length);
        uint counter = 0;
        for (uint i = startIndex; i <= endIndex; i++) {
            topicPosts[counter] = topics[topicID].postIDs[i];
            counter++;
        }
        return topicPosts;
    }

    function getTopicAuthor(uint topicID) public view returns (address) {
        require(topicExists(topicID), TOPIC_DOES_NOT_EXIST);
        return topics[topicID].author;
    }

    function getPost(uint postID) public view returns (address, string memory, uint, uint) {
        require(postExists(postID), POST_DOES_NOT_EXIST);
        return (
            posts[postID].author,
            users[posts[postID].author].username,
            posts[postID].timestamp,
            posts[postID].topicID
        );
    }

    function getPostAuthor(uint postID) public view returns (address) {
        require(postExists(postID), POST_DOES_NOT_EXIST);
        return posts[postID].author;
    }

    //----------------------------------------MISC----------------------------------------
    function getStats() public view returns (uint, uint, uint) {
        return (
            numUsers,
            numTopics,
            numPosts
        );
    }
}
