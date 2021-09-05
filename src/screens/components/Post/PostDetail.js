import React, { useState } from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Linking, ScrollView, SafeAreaView } from "react-native";
import {
  Layout,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import ImageView from "react-native-image-viewing";

import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';

import { Ionicons } from "@expo/vector-icons";
const { height } = Dimensions.get('window');

import PostFooter from "./PostFooter";
import Comments from "./Comments/Comments";
import RNUrlPreview from 'react-native-url-preview';
import Autolink from 'react-native-autolink';

// Redux
import { connect } from 'react-redux';
import { actionCreators } from "../../../../store";
import { bindActionCreators } from "redux";


import { Avatar, Divider } from "@ui-kitten/components";
import { formatDate } from "../utils/functions.utils";

postDetail = ({ navigation, state, setUser, route }) => {
  const { isDarkmode, setTheme } = useTheme();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [fullScreen, setFullScreen] = useState(false);

  const userName = `@${state.user.firstName + state.user.lastName + state.user._id.slice(0, 4)}`;
  const data = route.params;
  
  if(!data) { return null };

  const photo = data.photo ? { uri: data.photo.replace(/&#x2F;/g, '/') } : require("../../../../assets/images/gian-cescon-641332-unsplash.png");
  const description = data.description.replace(/&#x2F;/g, '/');

  const renderPreview = (url) => {
    return (
      <Text size="sm" style={{ color: themeColor.primary }} onPress={() => Linking.openURL(url)}>
        {url.toLowerCase()}
      </Text>
    )
  }

  return (
    <Layout backgroundColor="transparent">

      <ImageHeaderScrollView
        maxHeight={400}
        minHeight={60}
        resizeMode="cover"
        headerImage={photo}
        // onPress={() => setFullScreen(true)}
        renderForeground={() => (
          <View style={{width: '100%', height: '100%', justifyContent: 'flex-end'}}>
            <TouchableOpacity style={{ height: '80%', width: '100%'}}
            onPress={() => setFullScreen(true)}>
            </TouchableOpacity>
          </View>
        )}
      >
        <View style={[styles.container,
          {
            height: height - 80,
            borderTopWidth: .5,
            borderColor: 'rgba(150, 150, 150, .2)',
          }]}>

          <View style={styles.header}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Avatar size='small' source={require('../../../../assets/favicon.png')} />
                  <View style={{marginLeft: 10}}>
                    <Text size="md" fontWeight="regular">{data.user.userName}</Text>
                    <Text size="sm" fontWeight="light">{data.user.rol}</Text>
                  </View>
              </View>
              <Text style={{color: themeColor.gray100, fontSize: 10 }}>{formatDate(data.createdAt)}</Text>
          </View>
          <SafeAreaView style={styles.body}>
            <ScrollView>
              {
                data.description !== '' &&
                <View>
                  <Autolink
                      component={Text}
                      renderText={(text) => <Text size="sm">{text}</Text>}
                      renderLink={(text, match) => renderPreview(match.getAnchorHref())}
                      text={description} truncate={0}
                  />
                  <Divider style={{ marginVertical: 30 }}></Divider>
                </View>
              }
              <PostFooter data={data}></PostFooter>
            </ScrollView>
          </SafeAreaView>
        </View>
      </ImageHeaderScrollView>


      <View style={styles.buttonHeader}>
        <Ionicons
          onPress={() => navigation.goBack()}
          name="chevron-back"
          size={20}
          color={isDarkmode ? themeColor.white100 : themeColor.dark}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
                size="sm"
                fontWeight="medium"
                style={{color: 'black', marginRight: 10, paddingVertical: 3,
                backgroundColor: 'white', paddingHorizontal: 10, borderRadius: 10}}>
                15
            </Text>
            <Text
              size="sm"
              fontWeight="medium"
              style={{color: 'white', textShadowColor: 'rgba(150, 150, 150, .75)',
              textShadowOffset: {width: 1, height: 2},
              textShadowRadius: 10}}>
              Reacciones
            </Text>
          </View>
      </View>

      
      <ImageView
          images={[photo]}
          imageIndex={0}
          visible={fullScreen}
          onRequestClose={() => setFullScreen(false)}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  buttonHeader: {
    width: '100%',
    position: 'absolute',
    top: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: '100%',
    resizeMode: 'cover'
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  body: {
    marginTop: -12,
    paddingVertical: 30,
    paddingHorizontal: 10,
    height: '80%'
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
export default connect(mapStateToProps, mapDispatchToProps)(postDetail);