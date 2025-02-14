#!/bin/sh

echo "window.runtimeEnv = { \
REACT_APP_CONCORDIA_HOST: \"${REACT_APP_CONCORDIA_HOST}\", \
REACT_APP_CONCORDIA_PORT: \"${REACT_APP_CONCORDIA_PORT}\", \
REACT_APP_WEB3_HOST: \"${REACT_APP_WEB3_HOST}\", \
REACT_APP_WEB3_PORT: \"${REACT_APP_WEB3_PORT}\", \
REACT_APP_RENDEZVOUS_HOST: \"${REACT_APP_RENDEZVOUS_HOST}\", \
REACT_APP_RENDEZVOUS_PORT: \"${REACT_APP_RENDEZVOUS_PORT}\", \
REACT_APP_USE_EXTERNAL_CONTRACTS_PROVIDER: \"${REACT_APP_USE_EXTERNAL_CONTRACTS_PROVIDER}\", \
REACT_APP_CONTRACTS_PROVIDER_HOST: \"${REACT_APP_CONTRACTS_PROVIDER_HOST}\", \
REACT_APP_CONTRACTS_PROVIDER_PORT: \"${REACT_APP_CONTRACTS_PROVIDER_PORT}\", \
REACT_APP_CONTRACTS_VERSION_HASH: \"${REACT_APP_CONTRACTS_VERSION_HASH}\", \
}" >/var/www/concordia-app/environment.js
