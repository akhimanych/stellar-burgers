import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

export const orderBurger = createAsyncThunk('order/sendOrder', orderBurgerApi);

interface IOrderState {
  orderData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  orderData: null,
  orderRequest: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.orderRequest = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка при оформлении заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice;
