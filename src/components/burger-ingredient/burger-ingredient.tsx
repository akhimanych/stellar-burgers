import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';

import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const backgroundState = {
      background: location
    };

    const handleAddIngredient = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={backgroundState}
        handleAdd={handleAddIngredient}
      />
    );
  }
);
