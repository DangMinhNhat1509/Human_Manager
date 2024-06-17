import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';

const initialState = {
    users: [],
    userDetail: null,
    loading: false,
    loadingDetail: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
};

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userApi.getAllUser();
            const totalPages = Math.ceil(response.data.length / 10);
            return { data: response.data, totalPages };
        } catch (error) {
            console.error('Error fetching users:', error);
            return rejectWithValue(error.response ? error.response.data : 'Network error');
        }
    }
);

export const fetchUserDetail = createAsyncThunk(
    "users/fetchUserDetail",
    async (id, { rejectWithValue }) => {
        try {
            const response = await userApi.getUserById(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching user detail:', error);
            return rejectWithValue(error.response ? error.response.data : 'Network error');
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload;
        },
        clearUserDetail(state) {
            state.userDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.users = payload.data;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchUsers.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload || 'Unable to fetch users';
            })
            .addCase(fetchUserDetail.pending, (state) => {
                state.loadingDetail = true;
                state.error = null;
            })
            .addCase(fetchUserDetail.fulfilled, (state, { payload }) => {
                state.loadingDetail = false;
                state.userDetail = payload;
            })
            .addCase(fetchUserDetail.rejected, (state, { payload }) => {
                state.loadingDetail = false;
                state.error = payload || 'Unable to fetch user details';
            });
    }
});

export const { setPage, clearUserDetail } = userSlice.actions;

export default userSlice.reducer;
