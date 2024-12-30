import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Login = () => {

    const navigation = useNavigation<any>();
    const [UserName, setUserName] = useState('');
    const [Password, setPassword] = useState('');

    const loginHandler = async (UserName: string, Password: string) => {
        const response = await fetch(`${process.env.DUMMY_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: UserName,
                password: Password,
                expiresInMins: 5,
            }),
        })
        const data = await response.json();
        if(response.ok || data.accessToken) {
         await AsyncStorage.setItem('token', (data.accessToken));
         await AsyncStorage.setItem('Refreshtoken', (data.refreshToken));
         navigation.navigate("Intro")
        }else {
            Alert.alert('Failed login');
        }
    };

    return (
        <View style={Styles.background}>
            <View style={Styles.Center}>
                <Image style={Styles.Logo} source={require('../assets/logo.png')} />
            </View>
            <View style={Styles.LoginElements}>
                <TextInput
                    placeholder="User Name"
                    value={UserName}
                    onChangeText={setUserName}
                    style={Styles.Input}
                />
                <TextInput
                    placeholder="Password"
                    value={Password}
                    onChangeText={setPassword}
                    style={Styles.Input}
                />
            </View>
            <View style={Styles.Center}>
                <TouchableOpacity style={Styles.LoginBtn} onPress={() => loginHandler(UserName, Password)}>
                    <Text style={Styles.LoginBtnText}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};
const Styles = StyleSheet.create({
    background: {
        backgroundColor: '#05014a',
        height: '100%',
    },
    Center: {
        alignItems: 'center'
    },
    Logo: {
        marginTop: 30,
        width: 250,
        height: 250,
    },
    LoginElements: {
        marginTop: 50,
        marginHorizontal: 30,
        justifyContent: 'center',
    },
    Input: {
        marginBottom: 20,
    },
    LoginBtnText: {
        color: "#fff",
        fontSize: 24,
        justifyContent: 'center',
    },
    LoginBtn: {
        backgroundColor: '#329932',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginTop: 20,
        width: 200,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
});

export default Login;