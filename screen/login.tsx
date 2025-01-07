import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {login} from '../src/redux/action'
import { useAppDispatch,useAppSelector } from "../src/redux/hooks";
import { RootState } from "../src/redux/store";

const Login = () => {

    const navigation = useNavigation<any>();
    const [UserName, setUserName] = useState('');
    const [Password, setPassword] = useState('');
    const dispatch  = useAppDispatch();

    const { user, error, loading } = useAppSelector((state: RootState) => state.auth);

    const loginHandler = () => {
        dispatch(login(UserName, Password));
    };

    useEffect(() => {
        if (user) {
          navigation.navigate("Intro");
        }
        if (error) {
          Alert.alert("Login Failed", error);
        }
      }, [user, error, navigation]);

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
                <TouchableOpacity style={Styles.LoginBtn} onPress={() => loginHandler()}>
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