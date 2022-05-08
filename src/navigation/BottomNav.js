import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, themeColor } from "react-native-rapi-ui";
import { navigate } from "./RootNavigation";

export default function ({navigationRef}) {
    const { isDarkmode, setTheme } = useTheme();
    const currentRoute = navigationRef.current?.getCurrentRoute();

    if (!currentRoute) return null;
    if (!currentRoute) return null;
    return (
        <View style={styles.container}>
            <View style={styles.list}>
                <TouchableOpacity onPress={() => navigate('Home')}>
                    <Ionicons
                        name="home-sharp"
                        size={20}
                        color={currentRoute.name === 'Home' ? themeColor.black : themeColor.gray}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('Events')}>
                    <Ionicons
                        name="ios-calendar"
                        size={20}
                        color={currentRoute.name === 'Events' ? themeColor.black : themeColor.gray}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('Trabajo')}>
                    <Ionicons
                        name="ios-briefcase"
                        size={20}
                        color={currentRoute.name === 'Trabajo' ? themeColor.black : themeColor.gray}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('User')}>
                    <Ionicons
                        name="person"
                        size={20}
                        color={currentRoute.name === 'User' ? themeColor.black : themeColor.gray}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: "absolute",
        bottom: 0,
        borderRadius: 10,
        paddingBottom: 20,
        height: 80,
        // borderWidth: 1,
        borderColor: 'rgba(200,200,200, .4)',
        borderTopWidth: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    list: {
        width: '90%',
        height: '100%',
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    item: {
        paddingHorizontal: 20
    }
});