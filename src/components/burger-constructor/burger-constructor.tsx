import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { orderBurger, clearOrder } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { orderRequest, orderData } = useSelector((state) => state.order);
  const currentUser = useSelector((state) => state.user.data);

  const hasBun = Boolean(bun);
  const isGuest = !currentUser;

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (acc: number, ingredient: TConstructorIngredient) =>
        acc + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const orderPayload = useMemo(() => {
    if (!bun) return null;

    return [
      bun._id,
      ...ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      bun._id
    ];
  }, [bun, ingredients]);

  const handleCreateOrder = () => {
    if (!hasBun || orderRequest) {
      return;
    }

    if (isGuest) {
      navigate('/login');
      return;
    }

    if (orderPayload) {
      dispatch(orderBurger(orderPayload));
    }
  };

  const handleCloseModal = () => {
    dispatch(clearOrder());
  };

  useEffect(() => {
    if (!orderData) {
      return;
    }

    dispatch(clearConstructor());
  }, [dispatch, orderData]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={{
        bun: bun ? { ...bun, on: true } : null,
        ingredients
      }}
      orderModalData={orderData}
      onOrderClick={handleCreateOrder}
      closeOrderModal={handleCloseModal}
    />
  );
};
