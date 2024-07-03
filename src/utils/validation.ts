export const validateField = (name: string, value: string): string | null => {
    switch (name) {
        case 'name':
            if (!value) return 'Name is required';
            break;
        case 'email':
            if (!value) return 'Email is required';
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'Invalid email address';
            break;
        case 'phone':
            if (!value) return 'Phone is required';
            if (!/^[\d()\s\-]+(x\d+)?$/.test(value)) return 'Invalid phone number';
            break;
        case 'address':
            if (!value) return 'Address is required';
            break;
        case 'dateOfBirth':
            if (!value) return 'Date of birth is required';
            const dob = new Date(value);
            const age = new Date().getFullYear() - dob.getFullYear();
            if (age < 18 || age > 80) return 'Age must be between 18 and 80';
            break;
        case 'avatar':
            if (!value) return 'Avatar URL is required';
            if (!/^https?:\/\/.+/.test(value)) return 'Invalid URL';
            break;
        case 'gender':
            if (!value) return 'Gender is required';
            break;
        default:
            break;
    }
    return null;
};
