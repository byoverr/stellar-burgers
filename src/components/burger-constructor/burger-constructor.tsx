import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI, Preloader } from '@ui';
import { TIngredientUnique } from '@utils-types';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../slices/usersSlice';
import { selectBuilderItems, clearBuilder } from '../../slices/builderSlice';
import {
  createOrder,
  selectOrderRequest,
  selectOrderModalData,
  closeOrderRequest
} from '../../slices/ordersSlice';
import { openOrderModal } from '../../slices/modalSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Селекторы
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const orderRequest = useAppSelector(selectOrderRequest);
  const builderItems = useAppSelector(selectBuilderItems);
  const orderModalData = useAppSelector(selectOrderModalData);
  // Мемоизированное вычисление цены
  const price = useMemo(() => {
    if (!builderItems) return 0;

    const bunPrice = builderItems.bun ? builderItems.bun.price * 2 : 0;
    const ingredientsPrice =
      builderItems.ingredients &&
      Array.isArray(builderItems.ingredients) &&
      builderItems.ingredients.length > 0
        ? builderItems.ingredients.reduce(
            (sum: number, ingredient: TIngredientUnique) =>
              sum + ingredient.price,
            0
          )
        : 0;
    return bunPrice + ingredientsPrice;
  }, [builderItems]);

  if (!builderItems) {
    return <Preloader />;
  }

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!builderItems.bun) {
      return;
    }

    const ingredients = [
      builderItems.bun._id,
      ...builderItems.ingredients.map((item) => item._id),
      builderItems.bun._id
    ];

    dispatch(createOrder(ingredients));
    dispatch(openOrderModal());
  };

  const handleCloseModal = () => {
    dispatch(closeOrderRequest());
    dispatch(clearBuilder());
  };

  return (
    <BurgerConstructorUI
      constructorItems={builderItems}
      orderRequest={orderRequest}
      price={price}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
