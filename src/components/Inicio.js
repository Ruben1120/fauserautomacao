import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";
import lampada from "../imagens/lampada.png";
import torneira from "../imagens/torneira.png";
import logo from "../imagens/logoFauser.png";
export default class Inicio extends Component{
    static navigationOptions = {
        header: null
    }
    render(){
        return(
            <View style={estilos.container}>
                <Image source={logo} style={{width: 120, height: 120, resizeMode: "stretch", marginBottom: 20}}/>
                <Text style={estilos.titulo}>Fauser</Text>
                <Text style={[estilos.titulo, {marginBottom: 50}]}>Automação</Text>
                <TouchableOpacity style={estilos.button} onPress={() => { this.props.navigation.navigate("Lampada")}}>
                    <Text style={estilos.rotulo}>Lampada</Text>
                    <Image source={lampada} style={estilos.icones}/>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.button} onPress={() => { this.props.navigation.navigate("Torneira")}}>
                    <Text style={estilos.rotulo}>Torneira</Text>
                    <Image style={estilos.icones} source={torneira}/>
                </TouchableOpacity>
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
    titulo: {
        fontFamily: 'BigStem-Regular',
        fontSize: 48,
        color: "#e61919",
    },
    button: {
        backgroundColor: "#4682B4",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        width: 200,
        height: 70,
        marginBottom: 20,
        flexDirection: "row"
    },
    rotulo: {
        color: "white",
        fontSize: 27,
        fontFamily: 'BigStem-Regular',
    },
    icones: {
        resizeMode: "stretch",
        width: 50,
        height: 50,
        marginLeft: 10
    }
});