import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';

type TOrderStatus = 'done' | 'pending';

const getOrderNumbersByStatus = (
  orders: TOrder[],
  status: TOrderStatus
): number[] =>
  orders
    .filter((order) => order.status === status)
    .slice(0, 20)
    .map((order) => order.number);

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector((state) => state.feed);

  const readyOrders = getOrderNumbersByStatus(orders, 'done');
  const pendingOrders = getOrderNumbersByStatus(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{
        total,
        totalToday
      }}
    />
  );
};
