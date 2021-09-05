import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Keyboard, Image } from "react-native";
import {
  Layout,
  TopNav,
  themeColor,
  useTheme
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input } from "@ui-kitten/components";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { apiUrl } from "../../../keys";
import { navigate, navigateGoBack } from "../../navigation/RootNavigation";
import { AxiosService } from "../../services/axiosService";
import Toast from 'react-native-toast-message';

// Redux
import { connect } from 'react-redux';
import { actionCreators } from "../../../store";
import { bindActionCreators } from "redux";

newEditPostComponent = ({ navigation, setHomePosts, state }) => {
  
  if (!state.user) return null;
  
  const { isDarkmode, setTheme } = useTheme('');
  const [imageSelected, setImageSelected] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const [textareaValue, setTextareaValue] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true
    });
    if (!result.cancelled) {
      const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
      setImageSelected('data:image/jpeg;base64,' + base64);
    }
  };

  const onSubmit = async () => {
    const body = {
      description: textareaValue,
      photo: imageSelected
    }

    AxiosService().post('/post', body).then(res => {
      setTextareaValue('');
      setImageSelected(null);
      res.data = { ...res.data, user: state.user, comments: [] };
      state.homePosts.unshift(res.data);
      setHomePosts(state.homePosts);
      Toast.show({
        type: 'success',
        text1: 'Publicar',
        text2: 'Publicada con éxito!'
      });
      navigateGoBack();
    }).catch((error) => {
      console.log(error);
      setErrorMessage(error);
    });
  }


  return (
    <Layout>
      <TopNav
        middleContent="Publicar"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          {imageSelected &&
            <TouchableOpacity onPress={() => pickImage()}>
              <Image style={{ width: 40, height: 40, marginRight: 10 }} source={{ uri: imageSelected }} />
            </TouchableOpacity>
          }
          <Input
            multiline={true}
            status='basic'
            style={{ borderWidth: 0 }}
            value={textareaValue}
            disabled={loading}
            textStyle={{ height: 80, width: imageSelected ? '80%' : '100%' }}
            onChangeText={nextValue => setTextareaValue(nextValue)}
            placeholder='Que hay para hoy?'
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 2, marginLeft: -15, }}>
          {
            !imageSelected &&
            <Button appearance='outline' size="small" status="basic" onPress={() => pickImage()}>
              {imageSelected ? 'Cambiar' : 'Imagen'}
            </Button>
          }
        </View>
        {
          (textareaValue.trim() !== '' || imageSelected) &&
          <View style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 5 }}>
            {
              !loading ?
                <Button size="small" disabled={!imageSelected && (textareaValue.trim() == '')} status="info" style={{ width: 130 }}
                  onPress={() => onSubmit()}>Publicar</Button>
                :
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, flexDirection: 'row' }}>
                  <Spinner size="small"></Spinner>
                </View>
            }
          </View>
        }
      </View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginBottom: 5,
  },
});



function mapDispatchToProps(dispatch) {
  return {
    setHomePosts: bindActionCreators(actionCreators.setHomePosts, dispatch),
  }
}

function mapStateToProps(state) {
  return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(newEditPostComponent);