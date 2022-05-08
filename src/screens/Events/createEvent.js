import React, { useState } from "react";
import { themeColor, TopNav } from "react-native-rapi-ui";
import { AxiosService } from "../../services/axiosService";

const { height } = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';

// Redux
import { connect } from 'react-redux';
import { actionCreators } from "../../../store";
import { bindActionCreators } from "redux";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";

import 'dayjs/locale/es'
import { Dimensions, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@ui-kitten/components";

CreateEvent = ({ navigation, state }) => {
    const richText = React.createRef();
    const [monthShowing, setMonthShowing] = useState(null);
    const [date, setDate] = useState(new Date())
    const [showDate, setShowDate] = useState(false)

    const onSubmit = () => {
        AxiosService().get('//').then(({ data }) => {
            // setHomePosts(data);
        }).catch((error) => {
            console.log(error);
        });
    }

    

    const editorInitializedCallback = () => {
        richText.current?.registerToolbar(function (items) {
            // console.log('Toolbar click, selected items (insert end callback):', items);
        });
    }


    return (
        <View style={{ height, backgroundColor: 'white' }}>

            <TopNav
                middleTextStyle={{ marginTop: 12 }}
                middleContent="Crear evento"
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                        style={{ marginTop: 12 }}
                        color={themeColor.dark}
                    />
                }
                rightContent={
                    <Ionicons
                        name="ios-add-circle-outline"
                        size={20}
                        style={{ marginTop: 12 }}
                        color={themeColor.dark}
                    />
                }
                leftAction={() => navigation.goBack()}
            />
            <View>
                <RichEditor
                        ref={richText}
                        editorInitializedCallback={editorInitializedCallback}
                />
                <RichToolbar
                    editor={richText}
                    actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                        actions.insertImage,
                        'customAction',
                    ]}
                    // customAction={this.handleCustomAction}
                />
                {
                    date &&
                    <Button status="basic" onPress={() => setShowDate(true)}>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Button>
                }
                {
                    showDate &&
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={'datetime'}
                        is24Hour={true}
                        onChange={(e, date) => {
                            if (date !== undefined) {
                                setDate(new Date(date));
                            }
                            setShowDate(false);
                        }}
                        onTouchCancel={() => setShowDate(false)}
                    />
                }
            </View>
        </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);