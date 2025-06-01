import { TIngredient, TIngredientUnique, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TIngredientUnique[];
  } | null;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
