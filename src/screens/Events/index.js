import React, { useMemo, useState } from "react";
import {
    Layout, themeColor, TopNav,
} from "react-native-rapi-ui";
import { AxiosService } from "../../services/axiosService";

// import { Calendar } from 'react-native-big-calendar'
const { height } = Dimensions.get('window');

// Redux
import { connect } from 'react-redux';
import { actionCreators } from "../../../store";
import { bindActionCreators } from "redux";

import 'dayjs/locale/es'
import { Dimensions, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

Events = ({ navigation, state }) => {
    const [monthShowing, setMonthShowing] = useState(null);

    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Agosto', 'Julio', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    React.useEffect(() => {
        // getEvents();
    }, []);

    const getEvents = () => {
        AxiosService().get('//').then(({ data }) => {
            // setHomePosts(data);
        }).catch((error) => {
            console.log(error);
        });
    }

    const events = [
        {
            title: 'Test',
            start: new Date(2021, 9, 5, 1, 45),
            end: new Date(2021, 9, 5, 23, 45),
        },
        {
            title: 'Nerdearla',
            start: new Date(2021, 9, 10, 1, 45),
            end: new Date(2021, 9, 15, 23, 45),
        },
    ] 

    const onPressEvent = (e) => {
        console.log(e);
    }

    const onChangeDate = (e) => {
        const currentDate = new Date(e[0]);
        setMonthShowing(currentDate.getMonth());
    }

    return (
        <View style={{height, backgroundColor: 'white'}}>

            <TopNav
                middleTextStyle={{marginTop: 12}}
                middleContent={monthShowing && months[monthShowing]}
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                        style={{marginTop: 12}}
                        color={themeColor.dark}
                    />
                }
                rightContent={
                    <Ionicons
                        name="ios-add-circle-outline"
                        size={20}
                        style={{marginTop: 12}}
                        color={themeColor.dark}
                    />
                }
                leftAction={() => navigation.goBack()}
                rightAction={() => navigation.navigate('CreateEvent')}
            />
            <View style={{paddingTop: 10}}>
                {/* <Calendar
                    locale="es"
                    showTime={true}
                    overlapOffset={true}
                    events={events}
                    height={height}
                    mode={'month'}
                    onPressEvent={(e) => onPressEvent(e)}
                    onChangeDate={(e) => onChangeDate(e)}
                /> */}
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
export default connect(mapStateToProps, mapDispatchToProps)(Events);