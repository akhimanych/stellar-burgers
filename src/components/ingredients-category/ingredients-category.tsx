import { forwardRef, useMemo } from 'react';

import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { TIngredientsCategoryProps } from './type';

type TIngredientCounters = Record<string, number>;

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const constructorIngredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );

  const ingredientsCounters = useMemo(() => {
    const counters = constructorIngredients.reduce<TIngredientCounters>(
      (acc, ingredient: TIngredient) => {
        acc[ingredient._id] = (acc[ingredient._id] || 0) + 1;
        return acc;
      },
      {}
    );

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [bun, constructorIngredients]);

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

IngredientsCategory.displayName = 'IngredientsCategory';
