import React, { useState } from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Linking, ScrollView, SafeAreaView } from "react-native";
import {
  Layout,
  Text,
  themeColor,
  TopNav,
  useTheme,
} from "react-native-rapi-ui";
import ImageView from "react-native-image-viewing";

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
import AutoHeightImage from "react-native-auto-height-image";

postDetail = ({ navigation, state, setUser, route }) => {
  const { isDarkmode, setTheme } = useTheme();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [wrapperWidth, setWrapperWidth] = useState(0);

  const data = route.params;

  if (!data) { return null };

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
    <Layout>


      <TopNav
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
      />

      <View style={[styles.container, {height}]}>

        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar size='small' source={require('../../../../assets/favicon.png')} />
            <View style={{ marginLeft: 10 }}>
              <Text size="md" fontWeight="regular">{data.user.userName}</Text>
              <Text size="sm" fontWeight="light">{data.user.rol}</Text>
            </View>
          </View>
          <Text style={{ color: themeColor.gray100, fontSize: 10 }}>{formatDate(data.createdAt)}</Text>
        </View>
        <View style={styles.body}>
            {
              !data.photo || data.photo !== '' &&
              <TouchableOpacity style={{ width: '100%', position: 'relative', maxHeight: 200, zIndex: 20, borderRadius: 10, marginBottom: 20 }}
                onLayout={event => setWrapperWidth(event.nativeEvent.layout.width)}
                onPress={() => setFullScreen(true)}>
                <AutoHeightImage
                  width={wrapperWidth}
                  maxHeight={200}
                  source={{ uri: data.photo.replace(/&#x2F;/g, '/') }}
                  style={{ borderRadius: 10 }}
                />
              </TouchableOpacity>
            }
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
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