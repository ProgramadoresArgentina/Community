import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet } from "react-native";
import { TextInput, Text, themeColor, Button } from "react-native-rapi-ui";
import Svg, { Path } from 'react-native-svg';

// Redux
import { bindActionCreators } from "redux";
import { actionCreators } from "../../../store";
import { connect } from 'react-redux';

import { navigate } from "../../navigation/RootNavigation";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { apiUrl } from "../../../keys";
import Toast from "react-native-toast-message";
import { Spinner } from "@ui-kitten/components";


register = ({ navigation, state, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [invitation, setInvitation] = useState('');
  const [mail, setMail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  React.useEffect(() => {
    setUser(null);
  }, []);

  redirectTo = (name) => {
    navigation.reset({ index: 0, routes: [{ name: name }], });
  }

  const onSubmit = () => {
    setLoading(true);
    const params =  {
      email: mail,
      password: password,
      invitation: invitation,
      userName: userName
    }

    axios.post(`${apiUrl}/auth/register`, params).then(async function({data}) {
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Cuenta creada con éxito',
        text2: 'Por favor inicie sesión para continuar.'
      });
      redirectTo('Login');
    }).catch(err => {
      console.log(err);
      let message = '';
      if (err.response.data.data) {
        message = err.response.data.data[0].msg;
      } else {
        message = err.response.data.message;
      }
      setLoading(false);
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
        <Text style={styles.title} size="h2">Crear nueva cuenta</Text>
        <View style={styles.formContainer}>
          {
            errorMessage &&
            <Text size="md" style={{ color: themeColor.danger, marginBottom: 10 }}>{errorMessage}</Text>
          }
          <View style={styles.form}>

            {
              step === 1 ?
                <View style={styles.textInput}>
                  <TextInput
                    placeholder="Ingresar invitación"
                    value={invitation}
                    onChangeText={(val) => { setErrorMessage(null); setInvitation(val) }}
                  />
                </View>
                :
                <>
                  <View style={{width: 50}}>
                    <Button leftContent={
                        <Ionicons name="arrow-back" size={20} color={themeColor.white} />
                    } 
                    size="sm" onPress={() => setStep(1)}
                    />
                  </View>
                  <View style={styles.textInput}>
                    <TextInput
                      placeholder="Ingresar nombre de usuario"
                      value={userName}
                      onChangeText={(val) => { setErrorMessage(null); setUserName(val) }}
                      leftContent={
                        <Ionicons name="person" size={20} color={themeColor.gray300} />
                      }
                    />
                  </View>
                  <View style={styles.textInput}>
                    <TextInput
                      placeholder="Ingresar mail"
                      value={mail}
                      onChangeText={(val) => { setErrorMessage(null); setMail(val) }}
                      leftContent={
                        <Ionicons name="mail-sharp" size={20} color={themeColor.gray300} />
                      }
                    />
                  </View>
                  <View style={styles.textInput}>
                    <TextInput
                      placeholder="Ingresar contraseña"
                      value={password}
                      onChangeText={(val) => { setErrorMessage(null); setPassword(val) }}
                      leftContent={
                        <Ionicons name="lock-closed" size={20} color={themeColor.gray300} />
                      }
                    />
                  </View>
                </>
            }

          </View>
        </View>
        <View style={styles.buttonContainer}>
          {
            !loading ?
            step === 1 ?
            <Button text="Siguiente" size="lg" onPress={() => setStep(2)}
              disabled={invitation.trim() === ''} />
            :
            <Button text="Registrarme" size="lg" onPress={() => onSubmit()} style={{width: '50%'}}
            disabled={invitation.trim() === '' || errorMessage} />
            :
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <Spinner size="small"></Spinner>
            </View>
          }
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
          <Button text="Ingresar" outline
            onPress={() => navigate('Login')} />
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
    marginTop: 170,
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
export default connect(mapStateToProps, mapDispatchToProps)(register)
