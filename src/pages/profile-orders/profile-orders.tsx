import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectUserOrders,
  selectOrdersLoading
} from '../../slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectUserOrders);
  const isLoading = useAppSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading || !orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
