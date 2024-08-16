export const initializeLocalStorage = () => {
    const dataKey = 'hrmData';
    const exitingData = localStorage.getItem(dataKey);


    if (!exitingData) {
        const data = {
            employees: [
                { employeeId: 1, name: "John Doe", email: "john.doe@example.com", gender: "Male", phoneNumber: "123-456-7890", dateOfBirth: "1990-01-15", address: "123 Elm Street", avatar: "avatar1.jpg", status: true, departmentId: 1, role: "Manager" },
                { employeeId: 2, name: "Jane Smith", email: "jane.smith@example.com", gender: "Female", phoneNumber: "234-567-8901", dateOfBirth: "1985-05-25", address: "456 Oak Avenue", avatar: "avatar2.jpg", status: true, departmentId: 2, role: "Employee" },
                { employeeId: 3, name: "Robert Johnson", email: "robert.johnson@example.com", gender: "Male", phoneNumber: "345-678-9012", dateOfBirth: "1992-07-30", address: "789 Pine Road", avatar: "avatar3.jpg", status: true, departmentId: 1, role: "HR" },
                { employeeId: 4, name: "Emily Davis", email: "emily.davis@example.com", gender: "Female", phoneNumber: "456-789-0123", dateOfBirth: "1988-09-20", address: "101 Maple Drive", avatar: "avatar4.jpg", status: true, departmentId: 2, role: "Director" },
                { employeeId: 5, name: "Michael Brown", email: "michael.brown@example.com", gender: "Male", phoneNumber: "567-890-1234", dateOfBirth: "1983-11-25", address: "202 Birch Street", avatar: "avatar5.jpg", status: true, departmentId: 3, role: "Manager" },
                { employeeId: 6, name: "Sarah Wilson", email: "sarah.wilson@example.com", gender: "Female", phoneNumber: "678-901-2345", dateOfBirth: "1991-02-14", address: "303 Pine Avenue", avatar: "avatar6.jpg", status: true, departmentId: 4, role: "Employee" },
                { employeeId: 7, name: "David Taylor", email: "david.taylor@example.com", gender: "Male", phoneNumber: "789-012-3456", dateOfBirth: "1985-04-05", address: "404 Oak Lane", avatar: "avatar7.jpg", status: true, departmentId: 5, role: "HR" },
                { employeeId: 8, name: "Laura Martinez", email: "laura.martinez@example.com", gender: "Female", phoneNumber: "890-123-4567", dateOfBirth: "1989-06-15", address: "505 Cedar Street", avatar: "avatar8.jpg", status: true, departmentId: 6, role: "Director" },
                { employeeId: 9, name: "James Anderson", email: "james.anderson@example.com", gender: "Male", phoneNumber: "901-234-5678", dateOfBirth: "1987-07-22", address: "606 Maple Avenue", avatar: "avatar9.jpg", status: true, departmentId: 1, role: "Employee" },
                { employeeId: 10, name: "Emily Clark", email: "emily.clark@example.com", gender: "Female", phoneNumber: "012-345-6789", dateOfBirth: "1990-08-30", address: "707 Birch Street", avatar: "avatar10.jpg", status: true, departmentId: 2, role: "Manager" },
                { employeeId: 11, name: "Chris Evans", email: "chris.evans@example.com", gender: "Male", phoneNumber: "123-456-7891", dateOfBirth: "1993-01-10", address: "808 Elm Street", avatar: "avatar11.jpg", status: true, departmentId: 3, role: "HR" },
                { employeeId: 12, name: "Ava Robinson", email: "ava.robinson@example.com", gender: "Female", phoneNumber: "234-567-8902", dateOfBirth: "1994-02-20", address: "909 Oak Avenue", avatar: "avatar12.jpg", status: true, departmentId: 4, role: "Employee" },
                { employeeId: 13, name: "Liam Harris", email: "liam.harris@example.com", gender: "Male", phoneNumber: "345-678-9013", dateOfBirth: "1988-03-25", address: "1010 Pine Road", avatar: "avatar13.jpg", status: true, departmentId: 5, role: "Manager" },
                { employeeId: 14, name: "Sophia Green", email: "sophia.green@example.com", gender: "Female", phoneNumber: "456-789-0124", dateOfBirth: "1986-04-12", address: "1111 Maple Drive", avatar: "avatar14.jpg", status: true, departmentId: 6, role: "Director" },
                { employeeId: 15, name: "Daniel White", email: "daniel.white@example.com", gender: "Male", phoneNumber: "567-890-1235", dateOfBirth: "1990-05-16", address: "1212 Birch Street", avatar: "avatar15.jpg", status: true, departmentId: 1, role: "Employee" },
                { employeeId: 17, name: "William King", email: "william.king@example.com", gender: "Male", phoneNumber: "678-901-2346", dateOfBirth: "1985-02-10", address: "303 Spruce Avenue", avatar: "avatar17.jpg", status: true, departmentId: 3, role: "Employee" },
                { employeeId: 18, name: "Olivia Carter", email: "olivia.carter@example.com", gender: "Female", phoneNumber: "789-012-3457", dateOfBirth: "1992-06-18", address: "404 Fir Lane", avatar: "avatar18.jpg", status: true, departmentId: 4, role: "Employee" },
                { employeeId: 19, name: "Noah Wright", email: "noah.wright@example.com", gender: "Male", phoneNumber: "890-123-4568", dateOfBirth: "1994-08-25", address: "505 Walnut Street", avatar: "avatar19.jpg", status: true, departmentId: 5, role: "HR" },
                { employeeId: 20, name: "Isabella Clark", email: "isabella.clark@example.com", gender: "Female", phoneNumber: "901-234-5679", dateOfBirth: "1989-09-22", address: "606 Chestnut Avenue", avatar: "avatar20.jpg", status: true, departmentId: 6, role: "Employee" },
                { employeeId: 21, name: "Henry Thompson", email: "henry.thompson@example.com", gender: "Male", phoneNumber: "012-345-6790", dateOfBirth: "1987-10-30", address: "707 Redwood Street", avatar: "avatar21.jpg", status: true, departmentId: 1, role: "Employee" },
                { employeeId: 22, name: "Amelia Johnson", email: "amelia.johnson@example.com", gender: "Female", phoneNumber: "123-456-7892", dateOfBirth: "1991-11-15", address: "808 Birch Avenue", avatar: "avatar22.jpg", status: true, departmentId: 2, role: "Employee" },
                { employeeId: 23, name: "Lucas Scott", email: "lucas.scott@example.com", gender: "Male", phoneNumber: "234-567-8903", dateOfBirth: "1986-12-05", address: "909 Oak Street", avatar: "avatar23.jpg", status: true, departmentId: 3, role: "HR" },
                { employeeId: 24, name: "Mia Thomas", email: "mia.thomas@example.com", gender: "Female", phoneNumber: "345-678-9014", dateOfBirth: "1993-01-20", address: "1010 Maple Lane", avatar: "avatar24.jpg", status: true, departmentId: 4, role: "Employee" },
                { employeeId: 25, name: "Elijah Walker", email: "elijah.walker@example.com", gender: "Male", phoneNumber: "456-789-0125", dateOfBirth: "1988-02-12", address: "1111 Pine Street", avatar: "avatar25.jpg", status: true, departmentId: 5, role: "Manager" },
                { employeeId: 26, name: "Charlotte Harris", email: "charlotte.harris@example.com", gender: "Female", phoneNumber: "567-890-1236", dateOfBirth: "1990-03-14", address: "1212 Maple Avenue", avatar: "avatar26.jpg", status: true, departmentId: 6, role: "Director" }
            ],
            departments: [
                { departmentId: 1, departmentName: "Sales", managerId: 1 },
                { departmentId: 2, departmentName: "Marketing", managerId: 5 },
                { departmentId: 3, departmentName: "Finance", managerId: 8 },
                { departmentId: 4, departmentName: "Engineering", managerId: 13 },
                { departmentId: 5, departmentName: "Customer Support", managerId: 14 }
            ],
            actions: [
                { actionId: 1, employeeId: 2, actionType: "Reward", actionSubtype: "Bonus", reason: "Outstanding performance in Q1", actionDate: "2024-06-01", currentApproverId: 1, amount: 500, duration: null, status: "APPROVED" },
                { actionId: 2, employeeId: 3, actionType: "Disciplinary", actionSubtype: "Warning", reason: "Missed deadlines", actionDate: "2024-07-15", currentApproverId: 5, amount: null, duration: null, status: "PENDING" },
                { actionId: 3, employeeId: 7, actionType: "Reward", actionSubtype: "Promotion", reason: "Excellent leadership skills", actionDate: "2024-08-10", currentApproverId: 8, amount: null, duration: null, status: "DRAFT" },
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