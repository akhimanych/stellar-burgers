import { FC, memo } from 'react';

import { BurgerConstructorElementUI } from '@ui';

import { useDispatch } from '../../services/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/constructorSlice';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const canMoveUp = index > 0;
    const canMoveDown = index < totalItems - 1;

    const handleRemoveIngredient = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    const handleMoveIngredientUp = () => {
      if (!canMoveUp) {
        return;
      }

      dispatch(
        moveIngredient({
          from: index,
          to: index - 1
        })
      );
    };

    const handleMoveIngredientDown = () => {
      if (!canMoveDown) {
        return;
      }

      dispatch(
        moveIngredient({
          from: index,
          to: index + 1
        })
      );
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveIngredientUp}
        handleMoveDown={handleMoveIngredientDown}
        handleClose={handleRemoveIngredient}
      />
    );
  }
);
