import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  login,
  selectUserError,
  selectIsAuthenticated,
  selectUserLoading,
  checkUserAuth,
  clearError
} from '../../slices/usersSlice';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectUserLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Очищаем ошибки при монтировании
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }))
      .unwrap()
      .then((payload) => {
        localStorage.setItem('refreshToken', payload.refreshToken);
        setCookie('accessToken', payload.accessToken);
        dispatch(checkUserAuth());
      });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
