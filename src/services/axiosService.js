import axios from "axios";
import { get } from "react-native/Libraries/Utilities/PixelRatio";
import { bindActionCreators } from "redux";
import { apiUrl } from "../../keys";
import { actionCreators, store } from "../../store";
import { navigateReset } from "../navigation/RootNavigation";


export const AxiosService = () => {

    const generateAPI = () => {
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
            if (error.response) { // Unauthorized
                if (error.response.status === 401) { // Unauthorized
                    navigateReset('Login');
                }
            }
            return Promise.reject(error);
        });
        return API;
    }

    return {
        get: (uri) => {
            const API = generateAPI();
            return API.get(apiUrl + uri);
        },
        post: (uri, body) => {
            const API = generateAPI();
            return API.post(apiUrl + uri, JSON.stringify(body));
        },
        delete: (uri) => {
            const API = generateAPI();
            return API.delete(apiUrl + uri);
        },
    }
}
