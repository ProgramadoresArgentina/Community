import React, { useState } from "react";
import { View, Linking, ScrollView, TouchableOpacity } from "react-native";
import {
  Layout,
  TopNav,
  useTheme,
  themeColor,
  Text,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import Post from "./components/Post/Post";
import ListVertical from "./components/ListVertical";
import { navigate } from "../navigation/RootNavigation";
import { AxiosService } from "../services/axiosService";


// Redux
import { connect } from 'react-redux';
import { actionCreators } from "../../store";
import { bindActionCreators } from "redux";

Home = ({ navigation, setHomePosts, state }) => {
  const { isDarkmode, setTheme } = useTheme();
  const [ posts, setPosts ] = useState(null);

  React.useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    AxiosService().get('/post').then(({data}) => {
      setPosts(data);
      setHomePosts(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <Layout>
      <View style={{
        justifyContent: 'space-between', flexDirection: 'row',
        paddingHorizontal: 20, paddingVertical: 30, alignContent: 'center'
      }}>
        <View>
          <Text size="lg" fontWeight="medium">Inicio</Text>
          <Text size="sm" fontWeight="light">Que bueno verte de nuevo!</Text>
        </View>
        <View style={{
          alignItems: 'center', height: '100%',
          flexDirection: 'row'
        }}>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              if (isDarkmode) {
                setTheme("light");
              } else {
                setTheme("dark");
              }
            }}>
            <Ionicons
              name={isDarkmode ? "sunny" : "moon"}
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => navigate('NewEditPost')}>
            <Ionicons
              name="ios-add-circle-outline"
              size={30}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginHorizontal: 10, height: '80%' }}>
        <ListVertical
          loading={false}
          data={posts}
          onRefresh={() => getPosts()}
          component={Post}
        ></ListVertical>
      </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);