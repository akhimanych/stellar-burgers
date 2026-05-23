import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getOrderByNumberApi } from '@api';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

type TIngredientWithCount = TIngredient & {
  count: number;
};

type TIngredientsWithCountMap = Record<string, TIngredientWithCount>;

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [apiOrder, setApiOrder] = useState<TOrder | null>(null);

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const feedOrders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.userOrders.orders);

  const orderNumber = Number(number);

  const orderFromStore = useMemo(() => {
    const mergedOrders = [...feedOrders, ...userOrders];

    return mergedOrders.find((order) => order.number === orderNumber) || null;
  }, [feedOrders, userOrders, orderNumber]);

  useEffect(() => {
    if (!number) {
      setOrderError('Некорректный номер заказа');
      return;
    }

    if (Number.isNaN(orderNumber)) {
      setOrderError('Некорректный номер заказа');
      return;
    }

    if (orderFromStore || apiOrder) {
      return;
    }

    const fetchOrder = async () => {
      setIsOrderLoading(true);
      setOrderError(null);

      try {
        const response = await getOrderByNumberApi(orderNumber);

        if (response.success && response.orders.length > 0) {
          setApiOrder(response.orders[0]);
          return;
        }

        setOrderError('Заказ не найден');
      } catch {
        setOrderError('Не удалось загрузить информацию о заказе');
      } finally {
        setIsOrderLoading(false);
      }
    };

    fetchOrder();
  }, [number, orderNumber, orderFromStore, apiOrder]);

  const currentOrder = orderFromStore || apiOrder;

  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) {
      return null;
    }

    const ingredientsMap = ingredients.reduce<Record<string, TIngredient>>(
      (acc, ingredient) => {
        acc[ingredient._id] = ingredient;
        return acc;
      },
      {}
    );

    const ingredientsInfo =
      currentOrder.ingredients.reduce<TIngredientsWithCountMap>(
        (acc, ingredientId) => {
          const ingredient = ingredientsMap[ingredientId];

          if (!ingredient) {
            return acc;
          }

          if (!acc[ingredientId]) {
            acc[ingredientId] = {
              ...ingredient,
              count: 1
            };

            return acc;
          }

          acc[ingredientId].count += 1;
          return acc;
        },
        {}
      );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      total,
      date: new Date(currentOrder.createdAt)
    };
  }, [currentOrder, ingredients]);

  if (isOrderLoading) {
    return <Preloader />;
  }

  if (orderError && !currentOrder) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p className='text text_type_main-medium'>{orderError}</p>
      </div>
    );
  }

  if (!currentOrder || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
