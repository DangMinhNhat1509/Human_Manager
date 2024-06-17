import axios from "axios";

const APIURL = "https://666f9c300900b5f87247aecb.mockapi.io/api";

const axiosClient = axios.create({
    baseURL: APIURL
});

axiosClient.interceptors.request.use(async (currentConfig) => {
    return currentConfig;
});

axiosClient.interceptors.response.use(
    function (response) {
        // Chỉ trả về response khi có dữ liệu và trạng thái thành công
        if (response.data && (response.status === 200 || response.status === 201)) {
            return response;
        }
        return Promise.reject(new Error('Unexpected response status or missing data'));
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosClient;