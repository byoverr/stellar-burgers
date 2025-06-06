import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { RegisterUI } from '@ui-pages';
import {
  register,
  selectUserError,
  selectIsAuthenticated,
  selectUserLoading,
  checkUserAuth,
  clearError
} from '../../slices/usersSlice';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectUserLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(register({ name: userName, email, password }))
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          localStorage.setItem('refreshToken', payload.refreshToken);
          setCookie('accessToken', payload.accessToken);
          dispatch(checkUserAuth());
        }
      })
      .catch(() => {
        // Ошибка уже обработана в slice, здесь можно добавить дополнительную логику если нужно
      });
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // перенаправление после успешной регистрации
    }
  }, [isAuthenticated, navigate]);
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
