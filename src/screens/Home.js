import React, { useState } from "react";
import { View, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl } from "react-native";
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
import CarouselCards from "./components/PinnedCarousel/CarouselCards";
import { navigate } from "../navigation/RootNavigation";
import { AxiosService } from "../services/axiosService";


// Redux
import { connect } from 'react-redux';
import { actionCreators } from "../../store";
import { bindActionCreators } from "redux";

Home = ({ navigation, setHomePosts, state }) => {
  const { isDarkmode, setTheme } = useTheme();
  let [page, setPage] = useState(0);

  React.useEffect(() => {
    getPosts(1);
  }, []);

  const getPosts = (p) => {
    if (page !== p) {
      AxiosService().get('/post/'+p).then(({data}) => {
        if (p === 1) {
          setHomePosts(data);
        } else {
          if (data.length > 0) {
            setHomePosts(state.homePosts.concat(data));
          }
        }
        setPage(p);
      }).catch((error) => {
        console.log(error);
      });
    }
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
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          refreshControl={
              <RefreshControl
                  refreshing={false}
                  onRefresh={() => getPosts(1)}
                  tintColor={themeColor.gray200}
              />
          }
          style={{ height: '80%', marginBottom: 40}}
          onMomentumScrollEnd={(e) => {
            const scrollPosition = e.nativeEvent.contentOffset.y;
            const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
            const contentHeight = e.nativeEvent.contentSize.height;
            const isScrolledToBottom = scrollViewHeight + scrollPosition;

            if (isScrolledToBottom >= (contentHeight-50)) {
              getPosts(page+1)
            }
          }}
        >
          <CarouselCards></CarouselCards>
          <View style={{ marginHorizontal: 20 }}>
            <ListVertical
              loading={false}
              data={state.homePosts}
              onRefresh={() => null}
            ></ListVertical>
          </View>
        </ScrollView>
      </SafeAreaView>
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