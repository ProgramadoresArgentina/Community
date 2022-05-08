import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import {
  Text,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import AutoHeightImage from 'react-native-auto-height-image';
import { Avatar, Button, Divider } from "@ui-kitten/components";
import { navigate } from "../../../navigation/RootNavigation";
import ImageView from "react-native-image-viewing";

import PostFooter from "./PostFooter";
import RNUrlPreview from 'react-native-url-preview';
import Autolink from 'react-native-autolink';

// Redux
import { connect } from 'react-redux';
import { formatDate } from "../utils/functions.utils";

postComponent = ({ data, state }) => {
  const { isDarkmode, setTheme } = useTheme();
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [showCompleteText, setShowCompleteText] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  if (!data) { return null };
  const description = data.description.replace(/&#x2F;/g, '/');

  const renderPreview = (url) => {
    return (
      <Text size="sm" style={{ color: themeColor.primary }} onPress={() => Linking.openURL(url)}>
        {url.toLowerCase()}
      </Text>
    )
  }

  const truncateString = function (str, length) {
    return str.substring(0, length);
  };

  return (
    <View style={{ width: '100%', marginBottom: 30 }}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar size='small' source={require('../../../../assets/images/avatar.jpg')} />
          <View style={{ marginLeft: 10 }}>
            <Text size="md" fontWeight="regular">{data.user.userName}</Text>
            <Text size="sm" fontWeight="light">{data.user.role.roleName}</Text>
          </View>
        </View>
        <Text style={{ color: themeColor.gray100, fontSize: 10 }}>{formatDate(data.createdAt)}</Text>
      </View>
      <View style={{ width: '100%', borderRadius: 10 }}>
        {
          !data.photo || data.photo !== '' &&
          <TouchableOpacity style={{ width: '100%', position: 'relative', maxHeight: 300, zIndex: 20, borderRadius: 10 }}
            onLayout={event => setWrapperWidth(event.nativeEvent.layout.width)}
            onPress={() => setFullScreen(true)}>
            <AutoHeightImage
              width={wrapperWidth}
              maxHeight={300}
              source={{ uri: data.photo.replace(/&#x2F;/g, '/') }}
              style={{ borderRadius: 10 }}
            />
            <View style={{
              position: 'absolute',
              top: 20, left: 20, flexDirection: 'row', alignItems: 'center'
            }}>
              <Text
                size="sm"
                fontWeight="medium"
                style={{
                  color: 'black', marginRight: 10, paddingVertical: 3,
                  backgroundColor: 'white', paddingHorizontal: 10, borderRadius: 10
                }}>
                {data.reactions.length}
              </Text>
              <Text
                size="sm"
                fontWeight="medium"
                style={{
                  color: 'white', textShadowColor: 'rgba(200, 200, 200, .75)',
                  textShadowOffset: { width: 1, height: 2 },
                  textShadowRadius: 1
                }}>
                Reacciones
              </Text>
            </View>
          </TouchableOpacity>
        }
        <TouchableOpacity style={[styles.body, {marginTop: data.photo ? -12 : 5}]}
        onPress={() => navigate('PostDetail', data)}>
          <View>
            {
              description !== '' &&
              <View>
                <TouchableOpacity>
                  <Autolink
                    component={Text}
                    renderText={(text) => <Text size="sm">{text}</Text>}
                    renderLink={(text, match) => renderPreview(match.getAnchorHref())}
                    text={showCompleteText ? description : truncateString(description, 100)} truncate={0}
                  />
                </TouchableOpacity>
                {
                  !showCompleteText &&
                  description.length > 100 &&
                  <Button
                    onPress={() => setShowCompleteText(true)}
                    size="small" style={{ marginVertical: 10 }}
                    status="basic">Expandir</Button>
                }
                <Divider style={{ marginVertical: 10 }}></Divider>
              </View>
            }
            <PostFooter data={data}></PostFooter>
          </View>
        </TouchableOpacity>
      </View>
      <ImageView
          images={[{uri: data.photo.replace(/&#x2F;/g, '/')}]}
          imageIndex={0}
          visible={fullScreen}
          onRequestClose={() => setFullScreen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10
  },
  body: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    shadowOpacity: .1,
    shadowRadius: 1,
    elevation: 1,
    borderRadius: 10
  }
});


function mapStateToProps(state) {
  return { state }
}
export default connect(mapStateToProps)(postComponent);
