import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { redirect, useParams, useLocation } from 'react-router-dom';
import { selectCurrentOrder, setCurrentOrder } from '../../slices/ordersSlice';
import { selectIngredients as selectAllIngredients } from '../../slices/ingredientsSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { openDetailsModal } from '../../slices/modalSlice';

export const OrderInfo: FC = () => {
  const params = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (location.state?.background) {
      dispatch(openDetailsModal());
    }
  }, [location, dispatch]);

  if (!params.number) {
    redirect('/feed');
    return null;
  }

  useEffect(() => {
    if (params.number) {
      // Явное преобразование типа для предотвращения ошибки TypeScript
      dispatch(setCurrentOrder(params.number as string));
    }
  }, [params.number, dispatch]);

  const orderData = useAppSelector(selectCurrentOrder);

  const ingredients: TIngredient[] = useAppSelector(selectAllIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients || ingredients.length === 0) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    if (!orderData.ingredients || !Array.isArray(orderData.ingredients)) {
      return null;
    }

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!item) return acc;

        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
