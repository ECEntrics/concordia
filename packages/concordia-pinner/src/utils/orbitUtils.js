import OrbitDB from 'orbit-db';
import Identities from 'orbit-db-identity-provider';
import { EthereumContractIdentityProvider } from '@ecentrics/eth-identity-provider';
import Web3 from 'web3';
import { databaseNames } from 'concordia-shared/src/constants/orbit/OrbitDatabases';
import { ORBIT_DIRECTORY_DEFAULT } from '../constants';
import { logger } from './logger';

// TODO: share code below with frontend (?)
const determineDBAddress = async ({
  orbit, dbName, type, identityId,
}) => orbit.determineAddress(dbName, type, { accessController: { write: [identityId] } })
  .then((orbitAddress) => {
    const ipfsMultihash = orbitAddress.root;
    return `/orbitdb/${ipfsMultihash}/${dbName}`;
  });

const determineKVAddress = async ({ orbit, dbName, userAddress }) => determineDBAddress({
  orbit, dbName, type: 'keyvalue', identityId: userAddress + EthereumContractIdentityProvider.contractAddress,
});

export const createOrbitInstance = async (ipfs, contractAddress) => {
  Identities.addIdentityProvider(EthereumContractIdentityProvider);

  EthereumContractIdentityProvider.setWeb3(new Web3()); // We need a fully-featured new Web3 for signature verification
  EthereumContractIdentityProvider.setContractAddress(contractAddress);
  EthereumContractIdentityProvider.setStoreAuthDataLocally(true);

  const ORBIT_DIRECTORY = process.env.ORBIT_DIRECTORY || ORBIT_DIRECTORY_DEFAULT;
  logger.info(`Setting up OrbitDB in directory: ${ORBIT_DIRECTORY}`);

  return OrbitDB.createInstance(ipfs, { directory: ORBIT_DIRECTORY });
};

export const getPeerDatabases = async (orbit, userAddresses) => Promise.all(userAddresses
  .flatMap((userAddress) => databaseNames.map((dbName) => determineKVAddress({ orbit, dbName, userAddress }))));

export const openKVDBs = async (orbit, databases) => {
  databases
    .forEach((database) => {
      orbit
        .keyvalue(database)
        .then((store) => store.events.on('replicated', (address) => logger.info(`Replicated ${address}`)));
      logger.info(`Opened ${database}`);
    });
};
