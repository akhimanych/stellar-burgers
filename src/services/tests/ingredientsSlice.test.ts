import ingredientsSlice, { fetchIngredients } from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const loadingState = {
    ...initialState,
    loading: true
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Краторная булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: '',
      image_large: '',
      image_mobile: ''
    },
    {
      _id: '2',
      name: 'Биокотлета',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: '',
      image_large: '',
      image_mobile: ''
    }
  ];

  test('pending: loading = true, error = null', () => {
    const action = { type: fetchIngredients.pending.type };
    const newState = ingredientsSlice.reducer(initialState, action);

    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
    expect(newState.ingredients).toEqual([]);
  });

  test('fulfilled: записывает данные, loading = false', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const newState = ingredientsSlice.reducer(loadingState, action);

    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
    expect(newState.ingredients).toEqual(mockIngredients);
    expect(newState.ingredients).toHaveLength(2);
  });

  test('rejected: записывает ошибку, loading = false', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const newState = ingredientsSlice.reducer(loadingState, action);

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(errorMessage);
    expect(newState.ingredients).toEqual([]);
  });

  test('rejected без message: использует сообщение по умолчанию', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: {}
    };
    const newState = ingredientsSlice.reducer(loadingState, action);

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Ошибка загрузки');
    expect(newState.ingredients).toEqual([]);
  });
});
