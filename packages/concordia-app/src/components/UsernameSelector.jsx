import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Form, Input,
} from 'semantic-ui-react';
import throttle from 'lodash/throttle';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { drizzle } from '../redux/store';
import { FORUM_CONTRACT } from '../constants/contracts/ContractNames';

const { contracts: { [FORUM_CONTRACT]: { methods: { isUserNameTaken } } } } = drizzle;

const UsernameSelector = (props) => {
  const {
    initialUsername, username, onChangeCallback, onErrorChangeCallback,
  } = props;
  const isUserNameTakenResults = useSelector((state) => state.contracts[FORUM_CONTRACT].isUserNameTaken);
  const { t } = useTranslation();

  useEffect(() => {
    if (username.length > 0) {
      const checkedUsernames = Object
        .values(isUserNameTakenResults)
        .map((callCompleted) => ({
          checkedUsername: callCompleted.args[0],
          isTaken: callCompleted.value,
        }));

      const checkedUsername = checkedUsernames
        .find((callCompleted) => callCompleted.checkedUsername === username);

      if (checkedUsername && checkedUsername.isTaken && username !== initialUsername) {
        onErrorChangeCallback({
          usernameChecked: true,
          error: true,
          errorMessage: t('username.selector.error.username.taken.message', { username }),
        });
      } else {
        onErrorChangeCallback({
          usernameChecked: true,
          error: false,
          errorMessage: null,
        });
      }

      return;
    }

    // Username input is empty
    if (initialUsername && initialUsername !== '') {
      onErrorChangeCallback({
        usernameChecked: true,
        error: true,
        errorMessage: t('username.selector.error.username.empty.message'),
      });
    } else {
      onErrorChangeCallback({
        usernameChecked: true,
        error: false,
        errorMessage: null,
      });
    }
  }, [initialUsername, isUserNameTakenResults, onErrorChangeCallback, t, username, username.length]);

  const checkUsernameTaken = useMemo(() => throttle(
    (usernameToCheck) => {
      isUserNameTaken.cacheCall(usernameToCheck);
    }, 200,
  ), []);

  const handleInputChange = useCallback((event, { value }) => {
    onChangeCallback(value);

    if (value.length > 0) {
      checkUsernameTaken(value);
    }
  }, [checkUsernameTaken, onChangeCallback]);

  return (
      <Form.Field required>
          <label htmlFor="form-field-username-selector">
              {t('username.selector.username.field.label')}
          </label>
          <Input
            id="form-field-username-selector"
            placeholder={t('username.selector.username.field.placeholder')}
            name="usernameInput"
            className="form-input"
            value={username}
            onChange={handleInputChange}
          />
      </Form.Field>
  );
};

UsernameSelector.propTypes = {
  initialUsername: PropTypes.string,
  username: PropTypes.string.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
  onErrorChangeCallback: PropTypes.func.isRequired,
};

export default UsernameSelector;
