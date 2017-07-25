import React, { Component } from 'react';
import { Container, Content, Card, CardItem, Text, Icon, Right, Button, Label } from 'native-base';
import { View, Dimensions } from 'react-native';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import {fetchListReport} from '../actions/actions';
import firebase from 'firebase';

class ReportList extends Component {
    static navigationOptions = {
        title: 'Segnalazioni'
    }
    renderPetReportList = () => {
        if(this.props.report.list.length == 0){
            return (
                <Card style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <CardItem>
                        <Text>
                            Nessun avvistamento per questo animale
                        </Text>
                    </CardItem>
                </Card>
            )
        }
        return this.props.report.list.map((report) => {
            const { email, descr, telefono } = report
            return (
                <Card>
                    <CardItem>                      
                      <Image/>
                      <Text style={{marginLeft:10}}>
                        {descr}
                      </Text>
                      <Text style={{marginLeft:10}}>
                        {telefono}
                      </Text>
                      <Text style={{marginLeft:10}}>
                        {email}
                      </Text>
                    </CardItem>
                </Card>
            )
        })
      }
    render() {
      const { key } = this.props.navigation.state.params
      const { width, height } = Dimensions.get('window');
        return (
            <Container>
                <Content>
                  {this.renderPetReportList()}
                </Content>
            </Container>
        );
    }
}
const mapStateToProps = (state) => ({
    report: state.report
})
export default connect(mapStateToProps, null)(ReportList)
