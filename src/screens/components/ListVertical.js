import React from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { themeColor } from "react-native-rapi-ui";
import Post from "./Post/Post";

export default ({ loading, data, onRefresh }) => {

    renderItem = (item, index) => {
        return (
            <Post data={item} key={index}></Post>
        )
    }

    return (
        <FlatList
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={() => onRefresh()}
                    tintColor={themeColor.gray200}
                />
            }
            keyExtractor={(item, index) => index.toString()}
            data={data}
            style={{ width: '100%', height: '100%' }}
            horizontal={false}
            renderItem={({ item, index }) => renderItem(item, index)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
});
