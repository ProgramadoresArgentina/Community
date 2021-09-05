import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet } from "react-native";
import { TextInput, Text, themeColor, Button } from "react-native-rapi-ui";
import Svg, { Path } from 'react-native-svg';

// Redux
import { bindActionCreators } from "redux";
import { actionCreators } from "../../store";
import { connect } from 'react-redux';

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { apiUrl } from "../../keys";
import AsyncStorage from "@react-native-async-storage/async-storage";


auth = ({ navigation, state, setUser }) => {
  const [user, setLocalUser] = useState(false);
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  React.useEffect(() => {
    if (user !== state.user) {
      setLocalUser(state.user);
    }
  }, []);

  redirectTo = (name) => {
    navigation.reset({ index: 0, routes: [{ name: name }], });
  }

  loginIn = () => {
    const params =  {
      email: mail,
      password: password
    }

    axios.post(`${apiUrl}/auth/login`, params).then(async function({data}) {
      await AsyncStorage.setItem('@auth', JSON.stringify(params));
      setLocalUser(data.data);
      setUser(data.data);
      redirectTo('Home');
    }).catch(err => {
      let message = '';
      if (err.response.data.data) {
        message = err.response.data.data[0].msg;
      } else {
        message = err.response.data.message;
      }
      setErrorMessage(message)
    })
  }

  return (
    <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0064EF" />
      <View style={styles.svg}>
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={{ position: 'absolute', top: '60%' }}
        >
          <Path fill="#0064EF" fill-opacity="1" d="M0,224L60,224C120,224,240,224,360,202.7C480,181,600,139,720,128C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </Svg>
      </View>
      <View style={styles.container}>
        <Text style={styles.topText} size="lg">Programadores Argentina</Text>
        <Text style={styles.title} size="h2">Ingresar nuevamente</Text>
        <View style={styles.formContainer}>
            {
              errorMessage &&
              <Text size="md" style={{color: themeColor.danger}}>*{errorMessage}</Text>
            }
            <View style={styles.form}>
              <View style={styles.textInput}>
                <TextInput
                    placeholder="Ingresar mail"
                    value={mail}
                    onChangeText={(val) => {setErrorMessage(null);setMail(val)}}
                    leftContent={
                        <Ionicons name="person" size={20} color={themeColor.gray300} />
                    }
                />
              </View>
              <View style={styles.textInput}>
                <TextInput
                    placeholder="Ingresar contraseña"
                    value={password}
                    onChangeText={(val) => {setErrorMessage(null);setPassword(val)}}
                    leftContent={
                        <Ionicons name="lock-closed" size={20} color={themeColor.gray300} />
                    }
                />
              </View>
            </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button text="Ingresar" size="lg" onPress={() => loginIn()} />
          <View style={{
            width: '100%',
            position: 'relative',
            marginVertical: 30,
            alignItems: 'center',
          }}>
            <View style={{
              width: '80%',
              height: 1,
              backgroundColor: 'rgba(150, 150, 150, .3)',
              borderRadius: 100
            }}></View>
              <Text
                size="sm"
                style={{
                  position: 'absolute',
                  top: -8,
                  backgroundColor: 'white',
                  paddingHorizontal: 10,
                  color: 'rgba(150, 150, 150, .3)'
                }}>ó tambien puedes</Text>
          </View>
          <Button text="Registrarme" outline/>
        </View>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  svg: {
    backgroundColor: '#0064EF',
    height: '30%',
    width: '100%',
    position: 'absolute'
  },
  container: {
    height: '100%',
    width: '100%',
    padding: 10
  },
  topText: {
    color: 'white'
  },
  title: {
    marginTop: 40,
    width: '50%',
    color: 'white'
  },
  formContainer: {
    marginTop: 150,
    width: '100%',
    alignItems: 'center'
  },
  form: {
    width: '100%',
  },
  textInput: {
    width: '100%',
    marginVertical: 10
  },
  buttonContainer: {
    marginTop: 20
  }
});

function mapDispatchToProps(dispatch) {
  return {
    setUser: bindActionCreators(actionCreators.setUser, dispatch),
  }
}

function mapStateToProps(state) {
  return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(auth)
