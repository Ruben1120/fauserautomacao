import React, {Component} from 'react';
import {View, Text,StyleSheet, TouchableOpacity, ActivityIndicator, Image} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";
import animacaoTorneira from "../animacoes/animacaoTorneira.json";
import Lottie from "lottie-react-native";
import ImgConfig from "../imagens/config.png";

export default class Torneira extends Component{
    static navigationOptions = {
        headerTitle: "Torneira"
    }
    constructor(props){
        super(props);
        this.state = {
            loop: false,
            agua: false,
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
        if(this.state.agua)
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
            if(response.data.indexOf("Torneira Ligada") > -1){
                this.setState({agua: true});
                this.animacao.play(0, 20);
            }else(response.data.indexOf("Torneira Parada") > -1)
                this.setState({agua: false});
            this.setState({carregando: false});
            this.setState({erro: ""});
        }).catch((erro)=>{
            this.setState({carregando: false});
            if(erro.toString().indexOf("play") < 0){
                this.setState({erro: "Não foi possivel se conectar ao aparelho =(", carregando: false});
                this.animacao.play(36, 60);
                this.setState({agua: false});
            }else{
                this.animacao.play(0, 20);
            } 
        });
    }
    ligar = () => {
        if(!this.state.agua && !this.state.carregandoLigar && !this.state.carregandoDesligar && !this.state.carregando){
            this.setState({carregandoLigar: true});
            this.setState({loop: false});
            axios.get("http://"+this.state.ip+"?ligarTorneira").then(() => {
                this.animacao.play(0, 20);
                this.setState({carregandoLigar: false, carregando: false});   
                this.setState({agua: true});
                this.setState({erro: ""});
            }).catch(()=>{
                this.setState({erro: "Não foi possivel se conectar ao aparelho =("});
                this.setState({carregandoLigar: false, carregando: false});  
                this.animacao.play(49, 50);
            });
        }
    }
    desligar = () => {
        if(this.state.agua && !this.state.carregandoLigar && !this.state.carregandoDesligar && !this.state.carregando){
            this.setState({carregandoDesligar: true})
            this.setState({loop: false});
            axios.get("http://"+this.state.ip+"?pararTorneira").then(() => {
                this.animacao.play(36, 60);
                this.setState({carregandoDesligar: false});
                this.setState({erro: ""});
            }).catch(()=>{
                this.setState({erro: "Não foi possivel se conectar ao aparelho =(", carregandoDesligar: false});
                this.animacao.play(49, 50);
            });
            this.setState({agua: false});
        }
    }
    render(){
        return(
            <View style={estilos.container}>
                {   !this.state.carregando ?
                    <Lottie source={animacaoTorneira} ref={(animation) => { this.animacao = animation }} style={estilos.animacao} onAnimationFinish={() => {
                        if(this.state.agua){
                            this.animacao.play(21, 35);
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
                <TouchableOpacity style={[estilos.button, {width: 60, height: 60, backgroundColor: "#4682B4", marginLeft: 140}]} onPress={() => { this.props.navigation.navigate("MudarIP", {tela: "Torneira"}); this.setState({carregandoDesligar: false}); }}>
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
        width: 200,
        height: 200,
        marginBottom: 0,
        },
    erro: {
        color: "red",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 7
    }
});