import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet } from "react-native";
import { TextInput, Text, themeColor, Button } from "react-native-rapi-ui";
import { Button as ButtonKitten } from '@ui-kitten/components';
import Svg, { Path } from 'react-native-svg';

// Redux
import { bindActionCreators } from "redux";
import { actionCreators } from "../../../store";
import { connect } from 'react-redux';

import axios from "axios";
import { apiUrl } from "../../../keys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigateReset } from "../../navigation/RootNavigation";
import Toast from "react-native-toast-message";


login = ({ state, setUser }) => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  validateOtp = () => {
    const params =  {
      email: state.user.email,
      otp: otp
    }

    axios.post(`${apiUrl}/auth/verify-otp`, params).then(async function({data}) {
       Toast.show({
         text1: 'Cuenta verificada correctamente',
         text2: 'Muchas gracias por confirmar tu cuenta!'
       });
       state.user.isConfirmed = true;
       setUser(state.user);
       navigateReset('Home');
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

  const resendOtp = () => {
    const params =  {
      email: state.user.email
    }

    axios.post(`${apiUrl}/auth/resend-verify-otp`, params).then(async function({data}) {
       console.log(data);
       Toast.show({
         text1: 'Codigo reenviado nuevamente.',
         text2: 'Verifica tu mail para obtener el codigo.'
       })
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

  const logout = async () => {
    await AsyncStorage.removeItem('@auth');
    navigateReset('Login');
  }

  return (
    <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" backgroundColor="#FE5F5F" />
      <View style={styles.svg}>
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={{ position: 'absolute', top: '60%' }}
        >
          <Path fill="#FE5F5F" fill-opacity="1" d="M0,224L60,224C120,224,240,224,360,202.7C480,181,600,139,720,128C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </Svg>
      </View>
      <View style={styles.container}>
        <Text style={styles.topText} size="lg">Programadores Argentina</Text>
        <Text style={styles.title} size="h2">Confirmar mi cuenta</Text>
        <Text size="md" style={{color: 'white'}}>{state.user.email}</Text>
        <View style={styles.formContainer}>
            {
              errorMessage &&
              <Text size="md" style={{color: themeColor.danger}}>{errorMessage}</Text>
            }
            <View style={styles.form}>
              <View style={styles.textInput}>
                <View style={{width: '80%', marginBottom: 10}}>
                  <Text size="sm" style={{color: themeColor.gray}}>Ingresar codigo recibido al mail:</Text>
                </View>
                <TextInput
                    placeholder="Ej: IfBs42B"
                    value={otp}
                    onChangeText={(val) => {setErrorMessage(null);setOtp(val)}}
                />
              </View>
            </View>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonKitten onPress={() => validateOtp()}
          status='basic' appearance='outline' disabled={otp.trim() === '' || errorMessage}>
            Confirmar cuenta
          </ButtonKitten>

          <View style={{alignItems: 'center', width: '100%', marginTop: 10}}>
            <ButtonKitten onPress={() => resendOtp()} appearance='ghost'
            size="small"
            >Reenviar codigo</ButtonKitten>
          </View>
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

          <View style={{alignItems: 'center', width: '100%'}}>
            <ButtonKitten onPress={() => logout()} appearance='ghost'
            size="small"
            >Cambiar de cuenta</ButtonKitten>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  svg: {
    backgroundColor: '#FE5F5F',
    height: '20%',
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
    width: '70%',
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
export default connect(mapStateToProps, mapDispatchToProps)(login)
