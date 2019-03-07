import {call, select, take, takeEvery} from 'redux-saga/effects'

import { drizzle } from '../../index'

let transactionsHistory = Object.create(null);

function* initTransaction(action) {
    var dataKey = drizzle.contracts[action.transactionDescriptor.contract]
        .methods[action.transactionDescriptor['method']]
        .cacheSend(...[action.transactionDescriptor.params]);

    transactionsHistory[dataKey] = action;
}

function* handleEvent(action) {
    switch(action.event.event) {
        case 'TopicCreated':
            var transactionStack = yield select((state) => state.transactionStack);
            var dataKey = transactionStack.indexOf(action.event.transactionHash);
            if (dataKey !== -1 &&
                transactionsHistory[dataKey] &&
                transactionsHistory[dataKey].state === 'initialized') {
                //Gets orbit
                const orbit = yield select((state) => state.orbit);
                //And saves the topic
                /*yield call(orbit.topicsDB.put, ...[action.event.returnValues.topicID, {
                    subject: transactionsHistory[dataKey].userInputs.topicSubject
                }]);
                yield call(orbit.postsDB.put, ...[action.event.returnValues.postID, {
                    subject: transactionsHistory[dataKey].userInputs.topicSubject,
                    content: transactionsHistory[dataKey].userInputs.topicMessage
                }]);*/

                transactionsHistory[dataKey].state = 'success';
            }
            break;
        default:
            //Nothing to do here
            return;
    }
}

function* handleError() {
    var transactionStack = yield select((state) => state.transactionStack);
    transactionStack.forEach((transaction, index) => {
        if (transaction.startsWith('TEMP_')) {
            transactionsHistory[index].state = 'error';
        }
    })
}

function* transactionsSaga() {
    yield take("DRIZZLE_UTILS_SAGA_INITIALIZED");
    yield takeEvery("INIT_TRANSACTION", initTransaction);
    yield takeEvery("EVENT_FIRED", handleEvent);
    yield takeEvery("TX_ERROR", handleError);
}

export default transactionsSaga;
