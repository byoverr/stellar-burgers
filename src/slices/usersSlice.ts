import {createAsyncThunk, createSlice, createSelector, PayloadAction} from '@reduxjs/toolkit';
import {
    TLoginData,
    TRegisterData,
    loginUserApi,
    registerUserApi,
    getUserApi,
    logoutApi,
    updateUserApi
} from '@api';
import { TUser } from '@utils-types';

type TUserState = {
    data: TUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isInit: boolean;
};

const initialState: TUserState = {
    data: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInit: false
};

export const login = createAsyncThunk(
    'user/login',
    async (data: TLoginData) => await loginUserApi(data)
);

export const register = createAsyncThunk(
    'user/register',
    async (data: TRegisterData) => await registerUserApi(data)
);

export const checkUserAuth = createAsyncThunk(
    'user/checkAuth',
    async () => await getUserApi()
);

export const logout = createAsyncThunk(
    'user/logout',
    async () => await logoutApi()
);

export const updateUser = createAsyncThunk(
    'user/update',
    async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthChecked: (state, action: PayloadAction<boolean>) => {
            state.isInit = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    selectors: {
        selectUser: (state: TUserState) => state.data,
        selectIsAuthenticated: (state: TUserState) => state.isAuthenticated,
        selectAuthChecked: (state: TUserState) => state.isInit,
        selectUserLoading: (state: TUserState) => state.isLoading,
        selectUserError: (state: TUserState) => state.error,

        // Мемоизированные селекторы
        selectUserName: createSelector(
            [(state: TUserState) => state.data],
            (user) => user?.name || ''
        ),
        selectUserEmail: createSelector(
            [(state: TUserState) => state.data],
            (user) => user?.email || ''
        ),
        selectAuthStatus: createSelector(
            [
                (state: TUserState) => state.isAuthenticated,
                (state: TUserState) => state.isInit
            ],
            (isAuthenticated, isInit) => ({ isAuthenticated, isInit })
        )
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Registration failed';
            })
            .addCase(checkUserAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkUserAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.user;
                state.isAuthenticated = true;
                state.isInit = true;
            })
            .addCase(checkUserAuth.rejected, (state) => {
                state.isLoading = false;
                state.isInit = true;
            })
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.data = null;
                state.isAuthenticated = false;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.user;
            });
    }
});

// Экспорт действий
export const { setAuthChecked, clearError } = userSlice.actions;

// Экспорт селекторов
export const {
    selectUser,
    selectIsAuthenticated,
    selectAuthChecked,
    selectUserLoading,
    selectUserError,
    selectUserName,
    selectUserEmail,
    selectAuthStatus
} = userSlice.selectors;

export default userSlice.reducer;
