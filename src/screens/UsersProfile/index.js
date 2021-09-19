import React, { useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import {
    Text,
    themeColor,
    useTheme,
} from "react-native-rapi-ui";

import { Ionicons } from "@expo/vector-icons";
const { height } = Dimensions.get('window');


// Redux
import { connect } from 'react-redux';
import { actionCreators } from "../../../store";
import { bindActionCreators } from "redux";

import { Button, Avatar } from "@ui-kitten/components";

usersComponent = ({ navigation, state, route }) => {
    const { isDarkmode, setTheme } = useTheme();
    const [userData, setUserData] = React.useState([]);

    const data = route.params?.user;
    if (!data) return null;

    React.useEffect(() => {
        getUserData();
    }, []);

    const getUserData = () => {
        AxiosService().get(`/user/${data.id}`).then(({ data }) => {
            console.log(data);
            // setUserData(data);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <View style={{ backgroundColor: !isDarkmode ? themeColor.white : themeColor.dark, height }}>


            <View style={styles.buttonHeader}>
                <View
                    style={{
                        backgroundColor: 'rgba(150,150,150,.4)', borderRadius: 100, height: 40, width: 40,
                        alignItems: "center", justifyContent: "center"
                    }}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="chevron-back"
                        size={20}
                        color="white"
                    />
                </View>
                <View style={{ width: 80 }}>
                    <Button size="tiny">Follow</Button>
                </View>
            </View>

            <View style={styles.container}>
                <View style={{ alignItems: 'center', marginBottom: 30, position: 'relative' }}>
                    <Avatar size='giant' source={require('../../../assets/images/avatar.jpg')} />
                    <View style={{ marginTop: 15, alignItems: 'center' }}>
                        <Text size="md" fontWeight="light">@Tesst</Text>
                        <Text size="sm" fontWeight="light">Test</Text>
                    </View>
                </View>


                <View style={styles.headerContainer}>
                    <View style={styles.headerItems}>
                        <Text size="xl" fontWeight="medium">12</Text>
                        <Text size="sm" style={styles.headerItemsText}>Seguidores</Text>
                    </View>
                    <View style={styles.divider}></View>
                    <View style={styles.headerItems}>
                        <Text size="xl" fontWeight="medium">12</Text>
                        <Text size="sm" style={styles.headerItemsText}>Siguiendo</Text>
                    </View>
                    <View style={styles.divider}></View>
                    <View style={styles.headerItems}>
                        <Text size="xl" fontWeight="medium">12</Text>
                        <Text size="sm" style={styles.headerItemsText}>Posts</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonHeader: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 30,
        marginTop: 20
    },
    profileImage: {
        width: '100%',
        resizeMode: 'cover'
    },
    container: {
        paddingVertical: 0,
        paddingHorizontal: 20
    },
    headerContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: 'row',
        borderRadius: 20,
        marginBottom: 40,
        paddingHorizontal: 60
    },
    headerItems: {
        justifyContent: "center",
        alignItems: "center",
    },
    headerItemsText: {
        color: '#AEAEAE'
    },
    divider: {
        height: '100%',
        width: 1.3,
        backgroundColor: 'rgba(100, 100, 100, .2)',
        borderRadius: 100
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
export default connect(mapStateToProps, mapDispatchToProps)(usersComponent);