import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { isMountedRef, navigationRef } from './RootNavigation';

// Redux
import { connect } from 'react-redux';
import { actionCreators } from '../../store';
import { bindActionCreators } from "redux";

// Screens
import Home from '../screens/Home';
import SecondScreen from '../screens/SecondScreen';
import BottomNav from './BottomNav';
import AuthComponent from '../screens/Auth';
import User from '../screens/User';
import { apiUrl } from '../../keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LoadingPage from './LoadingPage';
import NewEditPost from '../screens/components/NewEditPost';
import AddComment from '../screens/components/Post/Comments/AddComment';
import PostDetail from '../screens/components/Post/PostDetail';
import Comments from '../screens/components/Post/Comments/Comments';

const MainStack = createStackNavigator();

const Main = () => {
	return (
		<MainStack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<MainStack.Screen name="Loading" component={LoadingPage} />
			<MainStack.Screen name="Auth" component={AuthComponent} />
			<MainStack.Screen name="Home" component={Home} />
			<MainStack.Screen name="SecondScreen" component={SecondScreen} />
			<MainStack.Screen name="User" component={User} />
			<MainStack.Screen name="NewEditPost" component={NewEditPost} />
			<MainStack.Screen name="PostDetail" component={PostDetail} />
			<MainStack.Screen name="Comments" component={Comments} />
			<MainStack.Screen name="AddComment" component={AddComment} />
		</MainStack.Navigator>
	);
};

appNavigator = ({state, setUser}) => {
	const [update, setUpdated] = useState(false);

	redirectTo = (name) => {
		navigationRef.current.reset({ index: 0, routes: [{ name: name }], });
	}

	const isLoginIn = async () => {
        const localStorage = await AsyncStorage.getItem('@auth');
		if (!localStorage) { return new Promise((_, reject) => reject(false)); };
		params = JSON.parse(localStorage);
		return axios.post(`${apiUrl}/auth/login`, params);
	}


	React.useEffect(() => {
		isMountedRef.current = true;
		if (!state.user) {
			isLoginIn().then(res => {
				setUser(res.data.data);
				redirectTo('Home');
			}).catch(err => {
				console.log(err);
				redirectTo('Auth')
			});
		} else {
			redirectTo('Home');
		}
		return () => (isMountedRef.current = false);

	}, []);

	return (
		<NavigationContainer
			ref={navigationRef}
			onStateChange={_ => setUpdated(!update)}
		>
			<Main />
			{
				state.user && // User Login
				<BottomNav navigationRef={navigationRef}
				update={update}></BottomNav>
			}
		</NavigationContainer>
	);
};

function mapDispatchToProps(dispatch) {
	return {
	  setUser: bindActionCreators(actionCreators.setUser, dispatch),
	}
  }

function mapStateToProps(state) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(appNavigator);