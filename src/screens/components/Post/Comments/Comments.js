import { Ionicons } from "@expo/vector-icons";
import { Avatar, Divider, Spinner } from "@ui-kitten/components";
import React, { useState } from "react";
import { Dimensions, FlatList, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import {
  Layout,
  useTheme,
  Text,
  themeColor,
  TopNav
} from "react-native-rapi-ui";

const { height } = Dimensions.get('window');


// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { actionCreators } from "../../../../../store";
import { navigate } from "../../../../navigation/RootNavigation";
import { AxiosService } from "../../../../services/axiosService";
import { formatDate, stateHomePost } from "../../utils/functions.utils";

Comments = ({ navigation, setHomePosts, route, state }) => {
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const data = route.params;
  if (!data) { return null };
  const post = state.homePosts && state.homePosts.find(p => p._id === data._id);
  const comments = post ? post.comments : [];
  
  React.useEffect(() => {
    getComments();
  }, []);
  

  const getComments = () => {
    setLoading(true);
    AxiosService().get('/comment/' + data._id).then((response) => {
      setLoading(false);
      const newState = stateHomePost(state, data._id, {comments: response.data});
      setHomePosts(newState);
    }).catch((error) => {
      console.log(error);
    });
  }

  renderItem = (item, index) => {
    return (
      <View style={{ marginTop: 15, paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '10%', alignItems: 'center' }}>
            <Avatar size='small' source={require('../../../../../assets/images/avatar.jpg')} />
          </View>
          <View style={{ width: '60%', paddingHorizontal: 10 }}>
            <Text size="md" fontWeight="regular">{item.user.userName}</Text>
            <Text size="sm" fontWeight="light"
              style={{ color: themeColor.gray, fontSize: 10, marginTop: 10 }}>{item.comment}</Text>
          </View>
          <View style={{ width: '30%', alignItems: 'flex-end' }}>
            <Text style={{ color: themeColor.gray100, fontSize: 10 }}>{formatDate(data.createdAt)}</Text>
          </View>
        </View>
        <View
          style={{
            height: 1, width: '100%', backgroundColor: 'rgba(150,150,150,.2)',
            marginTop: 20
          }}>
        </View>
      </View>
    )
  }
  return (
    <Layout>
      <TopNav
        middleContent="Comentarios"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
        rightContent={
          <Ionicons
            name="ios-add-circle-outline"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => navigate('AddComment', data)}
      />

      {
        loading ?
          <View style={{ alignItems: 'center', flex: 1, paddingVertical: 30 }}>
            <Spinner></Spinner>
          </View>
          :
          comments && comments.length ?
            <SafeAreaView>
              <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => getComments()}
                        tintColor={themeColor.gray200}
                    />
                }
                data={comments}
                style={{ width: '100%', height: height - 150 }}
                horizontal={false}
                renderItem={({ item, index }) => renderItem(item, index)}
              />
            </SafeAreaView>
            :
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text size="sm" style={{ marginTop: 20 }}>No existen comentarios</Text>
            </View>
      }
    </Layout>
  );
}




function mapDispatchToProps(dispatch) {
  return {
    setHomePosts: bindActionCreators(actionCreators.setHomePosts, dispatch),
  }
}
function mapStateToProps(state) {
  return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(Comments);