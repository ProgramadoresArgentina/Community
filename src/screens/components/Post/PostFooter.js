import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { themeColor, Text } from "react-native-rapi-ui";
import { MenuItem, OverflowMenu } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";

// Redux
import { connect } from 'react-redux';
import { navigate } from "../../../navigation/RootNavigation";
import { AxiosService } from "../../../services/axiosService";
import Toast from "react-native-toast-message";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../../../store";

PostFooter = ({ data, state, setHomePosts, setPinnedPosts }) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  if (!data) { return null };
  if (!state.user) return null;
  const post = state.homePosts && state.homePosts.find(p => p._id === data._id);
  const postIndex = state.homePosts && state.homePosts.findIndex(p => p._id === data._id);
  const comments = post ? post.comments : [];

  const userReaction = () => {
    const response = post ? post.reactions.find(reaction => reaction.user === state.user._id) ? true : false : false;
    return response;
  };

  const onMenuSelected = ({row}) => {
    if (row === 0) { // Delete
      deletePost();
    } else if(row === 1) { // Pinned
      pinPost();
    }
    setShowOptionsMenu(false);
  }

  const deletePost = () => {
    AxiosService().delete(`/post/${data._id}`).then(res => {
      Toast.show({
        type: 'success',
        text1: 'Publicar',
        text2: 'Eliminada con éxito!'
      });

      // Delete from datalist
      state.homePosts = state.homePosts.filter(e => e._id !== data._id);
      setHomePosts(state.homePosts);
    }).catch((error) => {
      console.log(error);
    });
  }

  const pinPost = () => {
    const body = {
      pin: postIndex !== -1 ? false : true
    }
    AxiosService().post(`/post/pinned/${data._id}`, body).then(({data}) => {
      Toast.show({
        type: 'success',
        text1: 'Pin',
        text2: postIndex !== -1 ? 'Pin eliminado' : 'Pin agregado con éxito!'
      });

      if (postIndex !== -1) { // Already Exist
        state.pinnedPosts = state.pinnedPosts.filter(e => e._id !== data._id); // Delete
      } else {
        state.pinnedPosts = [...state.pinnedPosts, data];
      }
      setPinnedPosts(state.pinnedPosts);
    }).catch((error) => {
      console.log(error);
    });
  }

  const addReaction = () => {
    const body = {
        post_id: data._id
    }
    AxiosService().post(`/reaction`, body).then(({data}) => {
      const postCurrentReactions = state.homePosts[postIndex].reactions;
      if (data.like) { // Add reaction
        const reactionData = {...data.reactionData, user:  state.user._id};
        state.homePosts[postIndex].reactions = [...postCurrentReactions, reactionData];
      } else { // Remove reaction
        state.homePosts[postIndex].reactions = postCurrentReactions.filter(reaction => reaction.user !== state.user._id);
      }

      setHomePosts(state.homePosts);
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => addReaction()}
          style={{ alignItems: 'center', marginRight: 20 }}>
          <Ionicons
            name={userReaction() ? "ios-heart" : "ios-heart-outline" }
            size={25}
            color={userReaction() ? themeColor.danger : '#000000' }
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons
            name="ios-share-social-sharp"
            size={25}
            color={themeColor.black}
          />
        </TouchableOpacity>
        <Text size="sm" style={{marginLeft: 10}}
        onPress={() => navigate('Comments', data)}>{comments.length} com.</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {/* <TouchableOpacity style={{ alignItems: 'center', marginRight: 20 }}>
          <Ionicons
            name="ios-bookmark-outline"
            size={25}
            color={themeColor.black}
          />
        </TouchableOpacity> */}

        {
        (data.user._id === state.user._id)
        || (state.user.rol === 'Admin') ?
          <OverflowMenu
            backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            anchor={() => (
              <TouchableOpacity
                onPress={() => setShowOptionsMenu(true)}>
                <Ionicons
                  name="ios-ellipsis-vertical"
                  size={25}
                  color={themeColor.black}
                />
              </TouchableOpacity>
            )}
            visible={showOptionsMenu}
            selectedIndex={1}
            onSelect={(item) => onMenuSelected(item)}
            onBackdropPress={() => setShowOptionsMenu(false)}
          >
            {/* {
              data.user._id === state.user._id &&
              <MenuItem title='Editar' />
            } */}
            {
              (data.user._id === state.user._id)
              || (state.user.role.roleName === 'Admin') ?
              <>
                <MenuItem title='Eliminar' />
                <MenuItem title='Pin' />
              </>
              : null
            }
            {/* {
              data.user._id !== state.user._id &&
              <MenuItem title='Denunciar' />
            } */}
          </OverflowMenu>
          : null
        }
      </View>
    </View>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    setHomePosts: bindActionCreators(actionCreators.setHomePosts, dispatch),
    setPinnedPosts: bindActionCreators(actionCreators.setPinnedPosts, dispatch),
  }
}


function mapStateToProps(state) {
  return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(PostFooter);
