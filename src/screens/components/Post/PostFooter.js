import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { themeColor, Text } from "react-native-rapi-ui";
import { MenuItem, OverflowMenu } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";

// Redux
import { connect } from 'react-redux';
import { navigate } from "../../../navigation/RootNavigation";

PostFooter = ({ data, state }) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  if (!data) { return null };
  const post = state.homePosts && state.homePosts.find(p => p._id === data._id);
  const comments = post ? post.comments : [];

  return (
    <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={{ alignItems: 'center', marginRight: 20 }}>
          <Ionicons
            name="ios-heart"
            size={25}
            color={themeColor.danger}
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
        <TouchableOpacity style={{ alignItems: 'center', marginRight: 20 }}>
          <Ionicons
            name="ios-bookmark-outline"
            size={25}
            color={themeColor.black}
          />
        </TouchableOpacity>

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
          // onSelect={onItemSelect}
          onBackdropPress={() => setShowOptionsMenu(false)}
        >
          {
            data.user._id === state.user._id &&
            <MenuItem title='Editar' />
          }
          {
            data.user._id === state.user._id &&
            <MenuItem title='Eliminar' />
          }
          {
            data.user._id !== state.user._id &&
            <MenuItem title='Denunciar' />
          }
        </OverflowMenu>
      </View>
    </View>
  );
}


function mapStateToProps(state) {
  return { state }
}
export default connect(mapStateToProps)(PostFooter);
