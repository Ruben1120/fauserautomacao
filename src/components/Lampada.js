import React, {Component} from 'react';
import {View, Text,StyleSheet, TouchableOpacity, ActivityIndicator, Image} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";
import animacaoLampada from "../animacoes/animacaoLampada.json";
import Lottie from "lottie-react-native";
import ImgConfig from "../imagens/config.png";

export default class Lampada extends Component{
    static navigationOptions = {
        headerTitle: "Lampada"
    }
    constructor(props){
        super(props);
        this.state = {
            loop: false,
            luz: false,
            ip: "",
            carregando: true,
            carregandoLigar: false,
            carregandoDesligar: false,
            erro: ""
        }
    }
    async componentDidMount(){
        let ip = await AsyncStorage.getItem("ip");
            if(ip)
                this.setState({ip});
        this.setStatus();
        if(this.state.luz)
            this.animacao.play(0, 20);
        this.telaEmExibicao = this.props.navigation.addListener('didFocus', async () => {
            this.setState({carregandoDesligar: false, carregandoLigar: false, carregando: false});
            let ip = await AsyncStorage.getItem("ip");
            if(ip)
                this.setState({ip});
            console.log(this.state.ip);
        });
    }
    componentWillUnmount() {
        this.telaEmExibicao.remove();
      }
    setStatus = () => {
        axios.get("http://"+this.state.ip).then(response => {
            if(response.data.indexOf("Lampada Ligada") > -1){
                this.setState({luz: true, erro: ""});
                this.animacao.play(0, 53);
            }else(response.data.indexOf("Lampada Parada") > -1)
                this.setState({luz: false});
            this.setState({carregando: false});
            this.setState({erro: ""});
        }).catch(erro => { 
            this.setState({carregando: false});
            if(erro.toString().indexOf("play") < 0){
                this.setState({erro: "Não foi possivel se conectar ao aparelho =(", carregando: false});
                this.setState({luz: false});
                this.animacao.play(120, 129); 
            }else{
                this.animacao.play(0, 53);
            } 
        });
    }
    ligar = () => {
        if(!this.state.luz && !this.state.carregandoLigar && !this.state.carregandoDesligar && !this.state.carregando){
            this.setState({carregandoLigar: true});
            this.setState({loop: false});
            axios.get("http://"+this.state.ip+"?ligarLampada").then(() => {
                this.animacao.play(0, 53);
                this.setState({carregandoLigar: false, carregando: false});   
                this.setState({luz: true});
                this.setState({erro: ""});
            }).catch(()=>{
                this.setState({erro: "Não foi possivel se conectar ao aparelho =("});
                this.setState({carregandoLigar: false, carregando: false});  
                this.animacao.play(120, 129);
            });
        }
    }
    desligar = () => {
        if(this.state.luz && !this.state.carregandoLigar && !this.state.carregandoDesligar && !this.state.carregando){
            this.setState({carregandoDesligar: true})
            this.setState({loop: false});
            axios.get("http://"+this.state.ip+"?pararLampada").then(() => {
                this.animacao.play(108, 123);
                this.setState({carregandoDesligar: false});
                this.setState({erro: ""});
            }).catch(()=>{
                this.setState({erro: "Não foi possivel se conectar ao aparelho =("});
                this.animacao.play(120, 129);
            });
            this.setState({luz: false});
        }
    }
    render(){
        return(
            <View style={estilos.container}>
                {   !this.state.carregando ?
                    <Lottie source={animacaoLampada} ref={(animation) => { this.animacao = animation }} style={estilos.animacao} onAnimationFinish={() => {
                        if(this.state.luz){
                            this.animacao.play(53, 107);
                            this.setState({loop: true})
                        }
                    }} loop={this.state.loop}/> :
                    <ActivityIndicator size="large" color="#e61919"/>
                }
                <Text style={estilos.erro}>{this.state.erro}</Text>
                <TouchableOpacity style={[estilos.button, {backgroundColor: "green"}]} onPress={this.ligar}>
                    {this.state.carregandoLigar ? <ActivityIndicator size="large" color="white"/> : <Text style={estilos.rotulo}>Ligar</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={estilos.button} onPress={this.desligar}>
                    {this.state.carregandoDesligar ? <ActivityIndicator size="large" color="white"/> : <Text style={estilos.rotulo}>Desligar</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={[estilos.button, {width: 60, height: 60, backgroundColor: "#4682B4", marginLeft: 140}]} onPress={() => { this.props.navigation.navigate("MudarIP", {tela: "Lampada"}); this.setState({carregandoDesligar: false}); }}>
                    <Image source={ImgConfig} style={[estilos.icones, {width: 45, marginRight: 8}]}/>
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
    button: {
        backgroundColor: "red",
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
    },
    animacao: {
        width: 250,
        height: 250,
        marginBottom: 0,
        marginTop: -10
    },
    erro: {
        color: "red",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 7
    }
});