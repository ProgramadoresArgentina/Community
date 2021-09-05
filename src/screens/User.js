import React, { useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';

import { Ionicons } from "@expo/vector-icons";
const { height } = Dimensions.get('window');


// Redux
import { connect } from 'react-redux';
import { Tab, TabBar, Button } from "@ui-kitten/components";
import Post from "./components/Post/Post";
import { actionCreators } from "../../store";
import { bindActionCreators } from "redux";
import { navigate, navigateReset } from "../navigation/RootNavigation";

userComponent = ({ navigation, state, setUser }) => {
  const { isDarkmode, setTheme } = useTheme();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  if (!state.user) return null;


  const logout = async () => {
    await AsyncStorage.removeItem('@auth');
    navigateReset('Auth');
  }

  return (
    <Layout backgroundColor="transparent">

      <ImageHeaderScrollView
        maxHeight={400}
        minHeight={70}
        headerImage={require("../../assets/images/avatar.jpg")}
      >
        <View style={[styles.container,
        {
          backgroundColor: !isDarkmode ? themeColor.white : themeColor.dark,
          height: height - 80,
        }]}>
          <View style={styles.headerContainer}>
            <View style={styles.headerItems}>
              <Text size="xl" fontWeight="medium">12</Text>
              <Text size="sm" style={styles.headerItemsText}>Seguidores</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.headerItems}>
              <Text size="xl" fontWeight="medium">12</Text>
              <Text size="sm" style={styles.headerItemsText}>Siguiendo</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.headerItems}>
              <Text size="xl" fontWeight="medium">12</Text>
              <Text size="sm" style={styles.headerItemsText}>Posts</Text>
            </View>
          </View>

          <View style={{
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <View style={{ width: '70%' }}>
              <TabBar
                style={{ backgroundColor: 'transparent' }}
                selectedIndex={selectedIndex}
                onSelect={index => setSelectedIndex(index)}>
                <Tab title='Detalles' />
                <Tab icon={(props) => <Ionicons
                  name="images-outline"
                  size={20}
                  color={props.style.tintColor}
                />
                } />
                <Tab icon={(props) => <Ionicons
                  name="ios-bookmark-outline"
                  size={20}
                  color={props.style.tintColor}
                />
                } />
              </TabBar>
            </View>
            <Ionicons
              name="settings"
              size={20}
              color={themeColor.primary}
            />
          </View>


          <View style={{ paddingVertical: 20 }}>
            {
              selectedIndex === 0 &&
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                  <Text size="sm">Usuario</Text>
                  <Text size="sm" fontWeight="light">{state.user.userName}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                  <Text size="sm">Email</Text>
                  <Text size="sm" fontWeight="light">{state.user.email}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                  <Text size="sm">Contraseña</Text>
                  <Button
                    size="tiny"
                    // onPress={() => logout()}
                    appearance='ghost'
                    status='basic'>
                    Cambiar contraseña
                  </Button>
                </View>

                <View style={{ width: '100%', alignItems: 'center' }}>
                  <>
                    <View style={{ width: '50%', marginVertical: 40 }}>
                      <Button
                        size="tiny"
                        onPress={() => logout()}
                        appearance='outline'
                        status='basic'>
                        Cerrar sesión
                      </Button>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text size="sm">Necesitas ayuda?</Text>
                      <Button
                        size="tiny"
                        // onPress={() => logout()}
                        appearance='ghost'
                        status='info'>
                        Contactar a los administradores
                      </Button>
                    </View>
                  </>
                </View>
              </View>
            }
          </View>







        </View>
      </ImageHeaderScrollView>


      <View style={styles.buttonHeader}>
        <View
          style={{backgroundColor: 'rgba(150,150,150,.4)', borderRadius: 100, height: 40, width: 40,
          alignItems: "center", justifyContent: "center"}}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="chevron-back"
            size={20}
            color="white"
          />

        </View>
        <View style={{ width: 80 }}>
          <Button size="tiny">Follow</Button>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  buttonHeader: {
    width: '100%',
    position: 'absolute',
    top: height % 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20
  },
  profileImage: {
    width: '100%',
    resizeMode: 'cover'
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: 'row',
    borderRadius: 20,
    marginBottom: 40,
    paddingHorizontal: 60
  },
  headerItems: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerItemsText: {
    color: '#AEAEAE'
  },
  divider: {
    height: '100%',
    width: 1.3,
    backgroundColor: 'rgba(100, 100, 100, .2)',
    borderRadius: 100
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
export default connect(mapStateToProps, mapDispatchToProps)(userComponent);