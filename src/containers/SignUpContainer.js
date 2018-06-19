import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import UsernameFormContainer from './UsernameFormContainer';

import { Header } from 'semantic-ui-react';

class SignUp extends Component {
    constructor(props){
        super(props);

        this.signedUp = this.signedUp.bind(this);
    }

    signedUp(){
        this.props.router.push("/home");
    }

    render() {
        return (
            this.props.user.hasSignedUp
                ?(<div className="vertical-center-in-parent">
                    <Header color='teal' textAlign='center' as='h2'>
                        There is already an account for this addresss.
                    </Header>
                    <Header color='teal' textAlign='center' as='h4'>
                        If you want to create another account please change your address.
                    </Header>
                </div>)
                :(<div className="sign-up-container">
                    <div>
                        <h1>Sign Up</h1>
                        <p className="no-margin">
                            <strong>Account address:</strong> {this.props.user.address}
                        </p>
                        <UsernameFormContainer signedUp={this.signedUp}/>
                    </div>
                </div>)
        );
    }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
};

const SignUpContainer = drizzleConnect(SignUp, mapStateToProps);

export default SignUpContainer;