import { StackNavigator } from "react-navigation";
import React, {Component} from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content, Button, Text, Form, Item, Input, InputGroup, Label, Spinner} from 'native-base';
import { connect } from 'react-redux';
import { loginUser } from '../actions/actions';
import ErrorCard from '../components/ErrorCard';

const mapStateToProps = state => ({
  auth: state.auth
})

class LoginForm extends Component {
  state = {
    email: '',
    password: ''
  }

  handleAuthenticationError = () => {
    if(this.props.auth.error)
    return (
      <ErrorCard>
        {this.props.auth.error.message}
      </ErrorCard>
    )

  }

  handleLoginClickAuth = () => {

      this.props.loginUser(
        {
          email: 'a@a.it',
          password: 'aaaaaa',
          navigateTo: (screen) => this.props.navigation.navigate(screen)
        }
      )

  }

  render(){
    if(this.props.auth.isLoading)
      return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text></Text>
            <Spinner color='blue' />
        </View>
      );
    return(

      <Container>

        <Content padder>
          {this.handleAuthenticationError()}
          <Item stackedLabel>
              <Label>Email</Label>
              <Input onChangeText={(email) => this.setState({email})} />
          </Item>
          <Item stackedLabel>
              <Label>Password</Label>
              <Input onChangeText={(password) => this.setState({password})}/>
          </Item>
            <Button block primary onPress={() => this.props.loginUser(
              {
                email: this.state.email,
                password: this.state.password,
                navigateTo: (screen) => this.props.navigation.navigate(screen)
              }
            )}>
              <Text>Log in</Text>
            </Button>

            <Button style={{marginTop:20}} block primary onPress={() => this.handleLoginClickAuth()}>
              <Text>DEBUG Login ever true</Text>
            </Button>

          </Content>
        </Container>
    );
  }
};

const style = StyleSheet.create({
  login:{
    width:'80%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default connect(mapStateToProps, { loginUser })(LoginForm);