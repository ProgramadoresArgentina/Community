import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Keyboard, Image } from "react-native";
import {
    Layout,
    TopNav,
    themeColor,
    useTheme
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input } from "@ui-kitten/components";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AxiosService } from "../../../../services/axiosService";
import { navigate, navigateGoBack } from "../../../../navigation/RootNavigation";

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { actionCreators } from "../../../../../store";
import { stateHomePost } from "../../utils/functions.utils";

AddComment = ({ navigation, setHomePosts, route, state }) => {
    const { isDarkmode, setTheme } = useTheme('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(null);
    const [textareaValue, setTextareaValue] = useState('');

    const data = route.params;
    if(!data) { return null };

    const onSubmit = async () => {
        const body = {
            comment: textareaValue,
            post_id: data._id
        }

        AxiosService().post('/comment', body).then(res => {
            setTextareaValue('');
            const post = state.homePosts.find(p => p._id === data._id);
            res.data = { ...res.data, user: state.user };
            post.comments.unshift(res.data);
            setHomePosts(state.homePosts);
            navigateGoBack();
        }).catch((error) => {
            console.log(error);
            setErrorMessage(error);
        });
    }


    return (
        <Layout>
            <TopNav
                middleContent="Comentar"
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                        color={isDarkmode ? themeColor.white100 : themeColor.dark}
                    />
                }
                leftAction={() => navigation.goBack()}
            />

            <View style={styles.container}>
                <Input
                    multiline={true}
                    status='basic'
                    value={textareaValue}
                    disabled={loading}
                    textStyle={{ paddingBottom: 20, paddingTop: 5, width: '100%' }}
                    onChangeText={nextValue => setTextareaValue(nextValue)}
                    placeholder='Escribir comentario..'
                    onSubmitEditing={Keyboard.dismiss}
                />

                <View style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 5 }}>
                    {
                        !loading ?
                            <Button size="small" disabled={(textareaValue.trim() == '')} status="info" style={{ width: 130 }}
                                onPress={() => onSubmit()}>Publicar</Button>
                            :
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, flexDirection: 'row' }}>
                                <Spinner size="small"></Spinner>
                            </View>
                    }
                </View>
            </View>
        </Layout>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'white',
        marginBottom: 5,
    },
});



function mapDispatchToProps(dispatch) {
    return {
        setHomePosts: bindActionCreators(actionCreators.setHomePosts, dispatch),
    }
}

function mapStateToProps(state) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddComment);