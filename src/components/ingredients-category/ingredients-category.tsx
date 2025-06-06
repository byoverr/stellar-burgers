import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { selectBuilderItems } from '../../slices/builderSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerBuilder = useAppSelector(selectBuilderItems);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerBuilder || {
      bun: null,
      ingredients: []
    };
    const counters: { [key: string]: number } = {};
    if (ingredients && ingredients.length > 0) {
      ingredients.forEach((ingredient: TIngredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
    }
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerBuilder]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
