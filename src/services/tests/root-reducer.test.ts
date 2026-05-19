import { UnknownAction } from '@reduxjs/toolkit';
import ingredientsSlice from '../slices/ingredientsSlice';
import constructorSlice from '../slices/constructorSlice';
import userSlice from '../slices/userSlice';
import orderSlice from '../slices/orderSlice';
import feedSlice from '../slices/feedSlice';
import userOrdersSlice from '../slices/userOrdersSlice';

describe('rootReducer', () => {
  test('вызов с undefined и неизвестным экшеном возвращает начальное состояние', () => {
    const unknownAction: UnknownAction = { type: 'UNKNOWN_ACTION' };

    const state = {
      ingredients: ingredientsSlice.reducer(undefined, unknownAction),
      burgerConstructor: constructorSlice.reducer(undefined, unknownAction),
      user: userSlice.reducer(undefined, unknownAction),
      order: orderSlice.reducer(undefined, unknownAction),
      feed: feedSlice.reducer(undefined, unknownAction),
      userOrders: userOrdersSlice.reducer(undefined, unknownAction)
    };

    const expectedState = { ...state };

    expect(state).toEqual(expectedState);
  });
});
