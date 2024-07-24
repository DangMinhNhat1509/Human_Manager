declare const employeeApi: {
    getAllEmployee(): Promise<import("axios").AxiosResponse<any, any>>;
    getEmployeeById(id: number): Promise<import("axios").AxiosResponse<any, any>>;
    createEmployee(data: any): Promise<import("axios").AxiosResponse<any, any>>;
    updateEmployee(id: number, data: any): Promise<import("axios").AxiosResponse<any, any>>;
    deleteEmployee(id: number): Promise<import("axios").AxiosResponse<any, any>>;
};
export default employeeApi;
