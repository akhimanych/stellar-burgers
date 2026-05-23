import { FC } from 'react';

import { OrderStatusUI } from '@ui';
import { OrderStatusProps } from './type';

const statusConfig: Record<
  string,
  {
    text: string;
    textStyle: string;
  }
> = {
  pending: {
    text: 'Готовится',
    textStyle: '#E52B1A'
  },
  done: {
    text: 'Выполнен',
    textStyle: '#00CCCC'
  },
  created: {
    text: 'Создан',
    textStyle: '#F2F2F3'
  }
};

const defaultStatus = {
  text: 'Создан',
  textStyle: '#F2F2F3'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const currentStatus = statusConfig[status] || defaultStatus;

  return (
    <OrderStatusUI
      text={currentStatus.text}
      textStyle={currentStatus.textStyle}
    />
  );
};
