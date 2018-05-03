import React, { Component } from 'react'
import { ContractData } from 'drizzle-react-components'
import UsernameFormContainer from '../../containers/UsernameFormContainer'

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <h1>Apella</h1>
            <br/><br/>
          </div>
          <div className="pure-u-1-1">
            <h2>Account</h2>
            <p><strong>Username</strong>: <ContractData contract="Forum" method="getUsername" methodArgs={[this.props.accounts[0]]}/></p>
            <UsernameFormContainer/>
            <br/><br/>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
