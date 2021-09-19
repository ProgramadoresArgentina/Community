import axios from "axios";
import { get } from "react-native/Libraries/Utilities/PixelRatio";
import { bindActionCreators } from "redux";
import { apiUrl } from "../../keys";
import { actionCreators, store } from "../../store";
import { navigateReset } from "../navigation/RootNavigation";


export const AxiosService = () => {
    const API = axios.create({
        // timeout: 10000,
        headers: {
            'Authorization': 'Bearer ' + store.getState().user.token,
            'Content-Type': 'application/json'
        }
    });

    API.interceptors.response.use(function ({data}) {
        return data;
    }, function (error) {
        if (error.response.status === 401) { // Unauthorized
            navigateReset('Login');
        }
        return Promise.reject(error);
    });

    return {
        get: (uri) => {
            return API.get(apiUrl + uri);
        },
        post: (uri, body) => {
            return API.post(apiUrl + uri, JSON.stringify(body));
        },
        delete: (uri) => {
            return API.delete(apiUrl + uri);
        },
    }
}
