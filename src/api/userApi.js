import axiosClient from "./api";

const userApi = {
    getAllUser() {
        const url = "/users";
        return axiosClient.get(url);
    }

}

export default userApi;