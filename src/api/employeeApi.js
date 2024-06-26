import axiosClient from "./api";

const employeeApi = {
    getAllEmployee() {
        const url = "/users";
        return axiosClient.get(url);
    },
    getEmployeeById(id){
        const url = `/users/${id}`;
        return axiosClient.get(url);
    },
    createEmployee(data){
        const url = "/users";
        return axiosClient.post(url, data);
    },
    updateEmployee(id, data){
        const url = `/users/${id}`;
        return axiosClient.put(url, data);
    },
    deleteEmployee(id){
        const url = `/users/${id}`;
        return axiosClient.delete(url);
    }

}

export default employeeApi;