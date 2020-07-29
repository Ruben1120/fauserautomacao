import React, {Component} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

export default class MudarIP extends Component{
    static navigationOptions = {
        header: null
    }
    constructor(props){
        super(props);
        this.state = {
            ip: "",
            tela: ""
        }
    }
    async componentDidMount(){
        let ip = await AsyncStorage.getItem("ip");
        if(ip){
            this.setState({ip});
        }
        this.telaEmExibicao = this.props.navigation.addListener('didFocus', () => {
            this.setState({tela: this.props.navigation.getParam("tela")});
        });
    }
    mudarip = async () => {
        await AsyncStorage.setItem("ip", this.state.ip);
        this.props.navigation.navigate(this.state.tela, {ip: this.state.ip});
    }
    componentWillUnmount(){
        this.telaEmExibicao.remove();
    }
    render(){
        return(
            <View style={estilos.container}>
                <Text style={estilos.textoForm}>Endereço IP: </Text>
                <TextInput style={estilos.form} placeholder="Endereço IP" onChangeText={(text) => { this.setState({ip: text}) }} value={this.state.ip}/>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={[estilos.button, {backgroundColor: "#4682B4"}]} onPress={this.mudarip}><Text style={estilos.rotulo}>Confirmar</Text></TouchableOpacity>
                    <TouchableOpacity style={estilos.button}><Text style={estilos.rotulo} onPress={() => this.props.navigation.goBack()}>Cancelar</Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}
const estilos = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    form: {
        borderRadius: 4,
        borderWidth: 1,
        marginBottom: 20,
        width: 300,
        borderColor: "#ddd"
    },
    textoForm: {
        fontSize: 20,
        textAlign: "left",
        marginBottom: 20
    },  
    button: {
        backgroundColor: "red",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        width: 110,
        height: 60,
        marginBottom: 20,
        flexDirection: "row",
        marginRight: 20,
        marginLeft: 5
    },
    rotulo: {
        color: "white",
        fontSize: 27,
        fontFamily: 'BigStem-Regular',
    },
});