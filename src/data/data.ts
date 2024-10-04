export const initializeLocalStorage = () => {
    const dataKey = 'hrmData';
    const exitingData = localStorage.getItem(dataKey);


    if (!exitingData) {
        const data = {
            employees: [
                // Phòng ban 1
                { employeeId: 1, name: "John Doe", email: "john.doe@example.com", gender: "Male", phoneNumber: "123-456-7890", dateOfBirth: "1990-01-15", address: "123 Elm Street", avatar: "https://randomuser.me/api/portraits/men/1.jpg", status: true, departmentId: 1, role: "Manager" },
                { employeeId: 13, name: "Daniel White", email: "daniel.white@example.com", gender: "Male", phoneNumber: "345-678-9013", dateOfBirth: "1990-05-16", address: "1010 Pine Street", avatar: "https://randomuser.me/api/portraits/men/2.jpg", status: true, departmentId: 1, role: "Employee" },
                { employeeId: 14, name: "Sophia Green", email: "sophia.green@example.com", gender: "Female", phoneNumber: "456-789-0124", dateOfBirth: "1986-04-12", address: "1111 Maple Drive", avatar: "https://randomuser.me/api/portraits/women/3.jpg", status: true, departmentId: 1, role: "Employee" },
                { employeeId: 17, name: "Lucas Scott", email: "lucas.scott@example.com", gender: "Male", phoneNumber: "789-012-3457", dateOfBirth: "1986-12-05", address: "1414 Willow Street", avatar: "https://randomuser.me/api/portraits/men/4.jpg", status: true, departmentId: 1, role: "Employee" },
                { employeeId: 18, name: "Mia Thomas", email: "mia.thomas@example.com", gender: "Female", phoneNumber: "890-123-4568", dateOfBirth: "1993-01-22", address: "1515 Birch Lane", avatar: "https://randomuser.me/api/portraits/women/5.jpg", status: true, departmentId: 1, role: "Employee" },

                // Phòng ban 2
                { employeeId: 2, name: "Jane Smith", email: "jane.smith@example.com", gender: "Female", phoneNumber: "234-567-8901", dateOfBirth: "1985-05-25", address: "456 Oak Avenue", avatar: "https://randomuser.me/api/portraits/women/6.jpg", status: true, departmentId: 2, role: "Manager" },
                { employeeId: 15, name: "Ethan Lewis", email: "ethan.lewis@example.com", gender: "Male", phoneNumber: "567-890-1235", dateOfBirth: "1988-02-18", address: "1212 Birch Street", avatar: "https://randomuser.me/api/portraits/men/7.jpg", status: true, departmentId: 2, role: "Employee" },
                { employeeId: 16, name: "Charlotte Harris", email: "charlotte.harris@example.com", gender: "Female", phoneNumber: "678-901-2346", dateOfBirth: "1994-03-25", address: "1313 Cedar Avenue", avatar: "https://randomuser.me/api/portraits/women/8.jpg", status: true, departmentId: 2, role: "Employee" },
                { employeeId: 19, name: "James Anderson", email: "james.anderson@example.com", gender: "Male", phoneNumber: "901-234-5678", dateOfBirth: "1987-07-22", address: "1414 Maple Lane", avatar: "https://randomuser.me/api/portraits/men/9.jpg", status: true, departmentId: 2, role: "Employee" },
                { employeeId: 20, name: "Olivia Johnson", email: "olivia.johnson@example.com", gender: "Female", phoneNumber: "012-345-6789", dateOfBirth: "1989-05-22", address: "707 Birch Street", avatar: "https://randomuser.me/api/portraits/women/10.jpg", status: true, departmentId: 2, role: "Employee" },

                // Phòng ban 3
                { employeeId: 3, name: "Robert Johnson", email: "robert.johnson@example.com", gender: "Male", phoneNumber: "345-678-9012", dateOfBirth: "1992-07-30", address: "789 Pine Road", avatar: "https://randomuser.me/api/portraits/men/11.jpg", status: true, departmentId: 3, role: "Manager" },
                { employeeId: 21, name: "Daniel Brown", email: "daniel.brown@example.com", gender: "Male", phoneNumber: "765-890-1234", dateOfBirth: "1987-06-30", address: "202 Pine Avenue", avatar: "https://randomuser.me/api/portraits/men/12.jpg", status: true, departmentId: 3, role: "Employee" },
                { employeeId: 22, name: "Isabella Davis", email: "isabella.davis@example.com", gender: "Female", phoneNumber: "876-901-2345", dateOfBirth: "1995-07-15", address: "303 Birch Street", avatar: "https://randomuser.me/api/portraits/women/13.jpg", status: true, departmentId: 3, role: "Employee" },
                { employeeId: 23, name: "Mason White", email: "mason.white@example.com", gender: "Male", phoneNumber: "890-123-4567", dateOfBirth: "1990-04-12", address: "404 Oak Lane", avatar: "https://randomuser.me/api/portraits/men/14.jpg", status: true, departmentId: 3, role: "Employee" },
                { employeeId: 24, name: "Sophia Martinez", email: "sophia.martinez@example.com", gender: "Female", phoneNumber: "901-234-5678", dateOfBirth: "1988-12-18", address: "505 Cedar Street", avatar: "https://randomuser.me/api/portraits/women/15.jpg", status: true, departmentId: 3, role: "Employee" },

                // Phòng ban 4
                { employeeId: 4, name: "Emily Davis", email: "emily.davis@example.com", gender: "Female", phoneNumber: "456-789-0123", dateOfBirth: "1988-09-20", address: "101 Maple Drive", avatar: "https://randomuser.me/api/portraits/women/16.jpg", status: true, departmentId: 4, role: "Manager" },
                { employeeId: 25, name: "James Lee", email: "james.lee@example.com", gender: "Male", phoneNumber: "567-890-1236", dateOfBirth: "1991-01-25", address: "606 Maple Avenue", avatar: "https://randomuser.me/api/portraits/men/17.jpg", status: true, departmentId: 4, role: "Employee" },
                { employeeId: 26, name: "Olivia Moore", email: "olivia.moore@example.com", gender: "Female", phoneNumber: "678-901-2347", dateOfBirth: "1987-09-12", address: "707 Cedar Street", avatar: "https://randomuser.me/api/portraits/women/18.jpg", status: true, departmentId: 4, role: "Employee" },
                { employeeId: 27, name: "Lucas King", email: "lucas.king@example.com", gender: "Male", phoneNumber: "789-012-3458", dateOfBirth: "1992-11-30", address: "808 Birch Avenue", avatar: "https://randomuser.me/api/portraits/men/19.jpg", status: true, departmentId: 4, role: "Employee" },
                { employeeId: 28, name: "Charlotte Clark", email: "charlotte.clark@example.com", gender: "Female", phoneNumber: "890-123-4569", dateOfBirth: "1993-06-20", address: "909 Maple Lane", avatar: "https://randomuser.me/api/portraits/women/20.jpg", status: true, departmentId: 4, role: "Employee" },

                // Phòng ban 5
                { employeeId: 5, name: "Michael Brown", email: "michael.brown@example.com", gender: "Male", phoneNumber: "567-890-1234", dateOfBirth: "1983-11-25", address: "202 Birch Street", avatar: "https://randomuser.me/api/portraits/men/21.jpg", status: true, departmentId: 5, role: "Manager" },
                { employeeId: 29, name: "Emma Roberts", email: "emma.roberts@example.com", gender: "Female", phoneNumber: "678-901-2348", dateOfBirth: "1994-03-18", address: "303 Pine Avenue", avatar: "https://randomuser.me/api/portraits/women/22.jpg", status: true, departmentId: 5, role: "Employee" },
                { employeeId: 30, name: "Liam Johnson", email: "liam.johnson@example.com", gender: "Male", phoneNumber: "789-012-3459", dateOfBirth: "1989-07-30", address: "404 Maple Street", avatar: "https://randomuser.me/api/portraits/men/23.jpg", status: true, departmentId: 5, role: "Employee" },
                { employeeId: 31, name: "Ava Martinez", email: "ava.martinez@example.com", gender: "Female", phoneNumber: "890-123-4567", dateOfBirth: "1991-10-05", address: "505 Cedar Avenue", avatar: "https://randomuser.me/api/portraits/women/24.jpg", status: true, departmentId: 5, role: "Employee" },
                { employeeId: 32, name: "Noah Taylor", email: "noah.taylor@example.com", gender: "Male", phoneNumber: "901-234-5678", dateOfBirth: "1987-05-20", address: "606 Willow Lane", avatar: "https://randomuser.me/api/portraits/men/25.jpg", status: true, departmentId: 5, role: "Employee" },

                //Thêm Director không thuộc phòng ban
                { employeeId: 36, name: "Henry Clark", email: "henry.clark@example.com", gender: "Male", phoneNumber: "789-456-1234", dateOfBirth: "1982-08-15", address: "202 Maple Avenue", avatar: "https://randomuser.me/api/portraits/men/26.jpg", status: true, role: "Director" },
                { employeeId: 37, name: "Ella Martin", email: "ella.martin@example.com", gender: "Female", phoneNumber: "890-234-5678", dateOfBirth: "1985-09-22", address: "303 Willow Lane", avatar: "https://randomuser.me/api/portraits/men/27.jpg", status: true, role: "Director" },
                { employeeId: 38, name: "James Anderson", email: "james.anderson@example.com", gender: "Male", phoneNumber: "901-345-6789", dateOfBirth: "1980-10-30", address: "404 Oak Avenue", avatar: "https://randomuser.me/api/portraits/women/35.jpg", status: true, role: "Director" },

                // Thêm HR không thuộc phòng ban
                { employeeId: 39, name: "Sarah Wilson", email: "sarah.wilson@example.com", gender: "Female", phoneNumber: "321-456-7890", dateOfBirth: "1987-12-25", address: "505 Pine Lane", avatar: "https://randomuser.me/api/portraits/women/34.jpg", status: true, role: "HR" },
                { employeeId: 40, name: "Michael Brown", email: "michael.brown@example.com", gender: "Male", phoneNumber: "432-567-8901", dateOfBirth: "1990-01-14", address: "606 Birch Avenue", avatar: "https://randomuser.me/api/portraits/men/30.jpg", status: true, role: "HR" },
                { employeeId: 41, name: "Jessica Green", email: "jessica.green@example.com", gender: "Female", phoneNumber: "543-678-9012", dateOfBirth: "1988-07-19", address: "707 Cedar Lane", avatar: "https://randomuser.me/api/portraits/men/31.jpg", status: true, role: "HR" }
            ],

            departments: [
                { departmentId: 1, departmentName: "Sales", managerId: 1 },
                { departmentId: 2, departmentName: "Marketing", managerId: 2 },
                { departmentId: 3, departmentName: "Finance", managerId: 3 },
                { departmentId: 4, departmentName: "Engineering", managerId: 4 },
                { departmentId: 5, departmentName: "Customer Support", managerId: 5 }
            ],
            actions: [
                { actionId: 1, employeeId: 18, actionType: "Reward", actionSubtype: "Bonus", reason: "Outstanding performance in Q1", actionDate: "2024-06-01", currentApproverId: 1, amount: 500, duration: null, status: "APPROVED" },
                { actionId: 2, employeeId: 23, actionType: "Disciplinary", actionSubtype: "Warning", reason: "Missed deadlines", actionDate: "2024-07-15", currentApproverId: 5, amount: null, duration: null, status: "PENDING" },
                { actionId: 3, employeeId: 32, actionType: "Reward", actionSubtype: "Promotion", reason: "Excellent leadership skills", actionDate: "2024-08-10", currentApproverId: 8, amount: null, duration: null, status: "DRAFT" },
                { actionId: 4, employeeId: 14, actionType: "Disciplinary", actionSubtype: "Suspension", reason: "Repeated absenteeism", actionDate: "2024-07-20", currentApproverId: 1, amount: null, duration: 5, status: "REJECTED" },
                { actionId: 5, employeeId: 15, actionType: "Reward", actionSubtype: "Bonus", reason: "Exceeded sales targets", actionDate: "2024-08-01", currentApproverId: 5, amount: 300, duration: null, status: "APPROVED" }
            ],
            approvalLogs: [
                { approvalLogId: 1, actionId: 1, approverId: 1, note: "Approved after review", approvalDate: "2024-06-02", action: "APPROVED" },
                { approvalLogId: 2, actionId: 2, approverId: 5, note: "Pending additional information", approvalDate: "2024-07-16", action: "PENDING" },
                { approvalLogId: 3, actionId: 3, approverId: 8, note: "Awaiting confirmation from HR", approvalDate: "2024-08-11", action: "PENDING" },
                { approvalLogId: 4, actionId: 4, approverId: 1, note: "Rejected due to repeated issues", approvalDate: "2024-07-21", action: "REJECT" },
                { approvalLogId: 5, actionId: 5, approverId: 5, note: "Approved for excellent performance", approvalDate: "2024-08-02", action: "APPROVE" }
            ]
        };

        localStorage.setItem('hrmData', JSON.stringify(data));
    }
};