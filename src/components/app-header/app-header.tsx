import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUser } from '../../slices/usersSlice';
import { useAppSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useAppSelector(selectUser);
  return <AppHeaderUI userName={user?.name} />;
};
