import axios from "axios";

const APIURL = "https://jsonplaceholder.typicode.com";

const axiosClient = axios.create({
    baseURL: APIURL
});

axios.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

axiosClient.interceptors.request.use(async (currentConfig) => {
    return currentConfig;
});

axios.interceptors.response.use(
    function (response) {
        if (response.data) {
            if (response.status === 200 || response.status === 201) {
                return response;
            }
            return Promise.reject(response);
        }
        return Promise.reject(response);
    },

    function (error) {
        return Promise.reject(error);
    }
);

export default axiosClient;