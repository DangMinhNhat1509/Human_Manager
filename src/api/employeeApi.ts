import axiosClient from "./api";

const employeeApi = {
    getAllEmployee() {
        const url = "/users";
        return axiosClient.get(url);
    },
    getEmployeeById(id: number) {
        const url = `/users/${id}`;
        return axiosClient.get(url);
    },
    createEmployee(data: any) {
        const url = "/users";
        return axiosClient.post(url, data);
    },
    updateEmployee(id: number, data: any) {
        const url = `/users/${id}`;
        return axiosClient.put(url, data);
    },
    deleteEmployee(id: number) {
        const url = `/users/${id}`;
        return axiosClient.delete(url);
    }

}

export default employeeApi;