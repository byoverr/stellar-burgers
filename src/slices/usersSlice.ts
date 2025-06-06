import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
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
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      return await loginUserApi(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserApi();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Auth check failed';
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await logoutApi();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Update failed';
      return rejectWithValue(message);
    }
  }
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
    },
    init: (state) => {
      state.isInit = true;
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
        state.error = (action.payload as string) || 'Login failed';
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
        state.error = (action.payload as string) || 'Registration failed';
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.user;
        state.isAuthenticated = true;
        state.isInit = true;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInit = true;
        state.error = (action.payload as string) || 'Auth check failed';
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.data = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Logout failed';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Update failed';
      });
  }
});

// Экспорт действий
export const { setAuthChecked, clearError, init } = userSlice.actions;

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
