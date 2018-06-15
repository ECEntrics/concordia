import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'

import ipfs_logo from './../resources/ipfs_logo.png';

/*
 * Create component.
 */

class LoadingContainer extends Component {
    render() {
        if (this.props.web3.status === 'failed')
        {
            if (this.props.errorComp) {
                return this.props.errorComp
            }

            return(
                <main className="container loading-screen">
                    <div>
                        <div>
                            <h1><span role="img" aria-label="Warning Sign">⚠</span></h1>
                            <p>This browser has no connection to the Ethereum network. Please use the Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity.</p>
                        </div>
                    </div>
                </main>
            )
        }

        if (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0)
        {
            return(
                <main className="container loading-screen">
                    <div>
                        <div>
                            <h1><span role="img" aria-label="Fox Face">🦊</span></h1>
                            <p><strong>We can't find any Ethereum accounts!</strong> Please check and make sure Metamask or you browser are pointed at the correct network and your account is unlocked.</p>
                        </div>
                    </div>
                </main>
            )
        }

        if (!this.props.orbitDB.ipfsInitialized)
        {
            return(
                <main className="container loading-screen">
                    <div>
                        <div>
                            <img src={ipfs_logo} alt="ipfs_logo" height="50"/>
                            <p><strong>Initializing IPFS...</strong></p>
                        </div>
                    </div>
                </main>
            )
        }

        if (this.props.drizzleStatus.initialized)
            return Children.only(this.props.children);

        if (this.props.loadingComp)
            return this.props.loadingComp;


        return(
            <main className="container loading-screen">
                <div>
                    <div>
                        <h1><span role="img" aria-label="Gear">⚙</span></h1>
                        <p>Loading dapp...</p>
                    </div>
                </div>
            </main>
        )
    }
}

LoadingContainer.contextTypes = {
    drizzle: PropTypes.object
};

/*
 * Export connected component.
 */

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus,
        web3: state.web3,
        orbitDB: state.orbitDB
    }
};

export default drizzleConnect(LoadingContainer, mapStateToProps)