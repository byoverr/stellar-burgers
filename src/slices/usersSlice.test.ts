import {
  login,
  register,
  checkUserAuth,
  logout,
  updateUser,
  userSlice,
  setAuthChecked,
  clearError,
  init
} from './usersSlice';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi
} from '@api';
import { mockUser } from './__mocks__/usersMock';

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn(),
  logoutApi: jest.fn(),
  updateUserApi: jest.fn()
}));

describe('userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(userSlice.getInitialState()).toEqual({
        data: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInit: false
      });
    });
  });

  describe('reducers', () => {
    it('should handle setAuthChecked', () => {
      const state = userSlice.reducer(undefined, setAuthChecked(true));
      expect(state.isInit).toBe(true);
    });

    it('should handle clearError', () => {
      const state = userSlice.reducer(
        { ...userSlice.getInitialState(), error: 'Some error' },
        clearError()
      );
      expect(state.error).toBeNull();
    });

    it('should handle init', () => {
      const state = userSlice.reducer(undefined, init());
      expect(state.isInit).toBe(true);
    });
  });

  describe('async thunks', () => {
    describe('login', () => {
      const loginData = { email: 'test@example.com', password: 'password' };

      it('should handle pending', () => {
        const state = userSlice.reducer(
          undefined,
          login.pending('', loginData)
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled', () => {
        const state = userSlice.reducer(
          undefined,
          login.fulfilled(
            {
              user: mockUser,
              refreshToken: '',
              accessToken: '',
              success: true
            },
            '',
            loginData
          )
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          data: mockUser,
          isAuthenticated: true
        });
      });

      it('should handle rejected', () => {
        const errorMessage = 'Login failed';
        const state = userSlice.reducer(
          undefined,
          login.rejected(new Error(errorMessage), '', loginData)
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          error: errorMessage
        });
      });

      it('should call loginUserApi', async () => {
        (loginUserApi as jest.Mock).mockResolvedValue({ user: mockUser });
        const dispatch = jest.fn();
        const getState = jest.fn();

        await login(loginData)(dispatch, getState, undefined);
        expect(loginUserApi).toHaveBeenCalledWith(loginData);
      });
    });

    describe('register', () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test'
      };

      it('should handle pending', () => {
        const state = userSlice.reducer(
          undefined,
          register.pending('', registerData)
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled', () => {
        const state = userSlice.reducer(
          undefined,
          register.fulfilled(
            {
              user: mockUser,
              success: true,
              refreshToken: '',
              accessToken: ''
            },
            '',
            registerData
          )
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          data: mockUser,
          isAuthenticated: true
        });
      });

      it('should handle rejected', () => {
        const errorMessage = 'Registration failed';
        const state = userSlice.reducer(
          undefined,
          register.rejected(new Error(errorMessage), '', registerData)
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          error: errorMessage
        });
      });

      it('should call registerUserApi', async () => {
        (registerUserApi as jest.Mock).mockResolvedValue({ user: mockUser });
        const dispatch = jest.fn();
        const getState = jest.fn();

        await register(registerData)(dispatch, getState, undefined);
        expect(registerUserApi).toHaveBeenCalledWith(registerData);
      });
    });

    describe('checkUserAuth', () => {
      it('should handle pending', () => {
        const state = userSlice.reducer(undefined, checkUserAuth.pending(''));
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled', () => {
        const state = userSlice.reducer(
          undefined,
          checkUserAuth.fulfilled({ user: mockUser, success: true }, '')
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          data: mockUser,
          isAuthenticated: true,
          isInit: true
        });
      });

      it('should handle rejected', () => {
        const errorMessage = 'Auth check failed';
        const state = userSlice.reducer(
          undefined,
          checkUserAuth.rejected(new Error(errorMessage), '')
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          isInit: true,
          error: errorMessage
        });
      });

      it('should call getUserApi', async () => {
        (getUserApi as jest.Mock).mockResolvedValue({ user: mockUser });
        const dispatch = jest.fn();
        const getState = jest.fn();

        await checkUserAuth()(dispatch, getState, undefined);
        expect(getUserApi).toHaveBeenCalledTimes(1);
      });
    });

    describe('logout', () => {
      it('should handle pending', () => {
        const state = userSlice.reducer(undefined, logout.pending(''));
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled', () => {
        const initialState = {
          ...userSlice.getInitialState(),
          data: mockUser,
          isAuthenticated: true
        };
        const state = userSlice.reducer(
          initialState,
          logout.fulfilled({ success: true }, '')
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          data: null,
          isAuthenticated: false
        });
      });

      it('should handle rejected', () => {
        const errorMessage = 'Logout failed';
        const state = userSlice.reducer(
          undefined,
          logout.rejected(new Error(errorMessage), '')
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          error: errorMessage
        });
      });

      it('should call logoutApi', async () => {
        (logoutApi as jest.Mock).mockResolvedValue({});
        const dispatch = jest.fn();
        const getState = jest.fn();

        await logout()(dispatch, getState, undefined);
        expect(logoutApi).toHaveBeenCalledTimes(1);
      });
    });

    describe('updateUser', () => {
      const updateData = { name: 'New Name', email: 'new@example.com' };

      it('should handle pending', () => {
        const state = userSlice.reducer(
          undefined,
          updateUser.pending('', updateData)
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled', () => {
        const updatedUser = { ...mockUser, ...updateData };
        const state = userSlice.reducer(
          { ...userSlice.getInitialState(), data: mockUser },
          updateUser.fulfilled(
            { user: updatedUser, success: true },
            '',
            updateData
          )
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          data: updatedUser
        });
      });

      it('should handle rejected', () => {
        const errorMessage = 'Update failed';
        const state = userSlice.reducer(
          undefined,
          updateUser.rejected(new Error(errorMessage), '', updateData)
        );
        expect(state).toEqual({
          ...userSlice.getInitialState(),
          isLoading: false,
          error: errorMessage
        });
      });

      it('should call updateUserApi', async () => {
        (updateUserApi as jest.Mock).mockResolvedValue({ user: mockUser });
        const dispatch = jest.fn();
        const getState = jest.fn();

        await updateUser(updateData)(dispatch, getState, undefined);
        expect(updateUserApi).toHaveBeenCalledWith(updateData);
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      user: {
        data: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInit: true
      }
    };

    it('selectUser should return user data', () => {
      expect(userSlice.selectors.selectUser(mockState)).toEqual(mockUser);
    });

    it('selectIsAuthenticated should return auth status', () => {
      expect(userSlice.selectors.selectIsAuthenticated(mockState)).toBe(true);
    });

    it('selectAuthChecked should return isInit', () => {
      expect(userSlice.selectors.selectAuthChecked(mockState)).toBe(true);
    });

    it('selectUserLoading should return loading state', () => {
      expect(userSlice.selectors.selectUserLoading(mockState)).toBe(false);
    });

    it('selectUserError should return error', () => {
      expect(userSlice.selectors.selectUserError(mockState)).toBeNull();
    });

    it('selectUserName should return user name', () => {
      expect(userSlice.selectors.selectUserName(mockState)).toBe('Test User');
    });

    it('selectUserEmail should return user email', () => {
      expect(userSlice.selectors.selectUserEmail(mockState)).toBe(
        'test@example.com'
      );
    });

    it('selectAuthStatus should return auth status object', () => {
      expect(userSlice.selectors.selectAuthStatus(mockState)).toEqual({
        isAuthenticated: true,
        isInit: true
      });
    });

    it('selectors should work with empty state', () => {
      const emptyState = { user: userSlice.getInitialState() };
      expect(userSlice.selectors.selectUser(emptyState)).toBeNull();
      expect(userSlice.selectors.selectIsAuthenticated(emptyState)).toBe(false);
      expect(userSlice.selectors.selectAuthChecked(emptyState)).toBe(false);
      expect(userSlice.selectors.selectUserLoading(emptyState)).toBe(false);
      expect(userSlice.selectors.selectUserError(emptyState)).toBeNull();
      expect(userSlice.selectors.selectUserName(emptyState)).toBe('');
      expect(userSlice.selectors.selectUserEmail(emptyState)).toBe('');
      expect(userSlice.selectors.selectAuthStatus(emptyState)).toEqual({
        isAuthenticated: false,
        isInit: false
      });
    });
  });

  describe('extra cases', () => {
    it('should not modify state for unknown action', () => {
      const state = userSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(userSlice.getInitialState());
    });

    it('should preserve other state when loading starts', () => {
      const initialState = {
        ...userSlice.getInitialState(),
        data: mockUser,
        isAuthenticated: true
      };
      const state = userSlice.reducer(
        initialState,
        updateUser.pending('', { name: 'New Name' })
      );
      expect(state.data).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });
  });
});
