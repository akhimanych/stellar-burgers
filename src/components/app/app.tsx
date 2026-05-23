import { FC, useEffect, ReactElement } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import {
  AppHeader,
  IngredientDetails,
  OrderInfo,
  Modal,
  ProtectedRoute
} from '@components';

import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';
import styles from './app.module.css';

type AppRoute = {
  path: string;
  element: ReactElement;
};

const guestRoutes: AppRoute[] = [
  {
    path: '/login',
    element: (
      <ProtectedRoute onlyUnAuth>
        <Login />
      </ProtectedRoute>
    )
  },
  {
    path: '/register',
    element: (
      <ProtectedRoute onlyUnAuth>
        <Register />
      </ProtectedRoute>
    )
  },
  {
    path: '/forgot-password',
    element: (
      <ProtectedRoute onlyUnAuth>
        <ForgotPassword />
      </ProtectedRoute>
    )
  },
  {
    path: '/reset-password',
    element: (
      <ProtectedRoute onlyUnAuth>
        <ResetPassword />
      </ProtectedRoute>
    )
  }
];

const privateRoutes: AppRoute[] = [
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile/orders',
    element: (
      <ProtectedRoute>
        <ProfileOrders />
      </ProtectedRoute>
    )
  }
];

const modalRoutes: AppRoute[] = [
  {
    path: '/ingredients/:id',
    element: (
      <Modal title='Детали ингредиента' onClose={() => window.history.back()}>
        <IngredientDetails />
      </Modal>
    )
  },
  {
    path: '/feed/:number',
    element: (
      <Modal title='Инфо заказа' onClose={() => window.history.back()}>
        <OrderInfo />
      </Modal>
    )
  },
  {
    path: '/profile/orders/:number',
    element: (
      <ProtectedRoute>
        <Modal title='Инфо заказа' onClose={() => window.history.back()}>
          <OrderInfo />
        </Modal>
      </ProtectedRoute>
    )
  }
];

const App: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.loading
  );
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const closeModal = () => {
    navigate(-1);
  };

  const renderedModalRoutes = modalRoutes.map(({ path, element }) => {
    const modalElement =
      path === '/ingredients/:id' ? (
        <Modal title='Детали ингредиента' onClose={closeModal}>
          <IngredientDetails />
        </Modal>
      ) : path === '/feed/:number' ? (
        <Modal title='Инфо заказа' onClose={closeModal}>
          <OrderInfo />
        </Modal>
      ) : (
        <ProtectedRoute>
          <Modal title='Инфо заказа' onClose={closeModal}>
            <OrderInfo />
          </Modal>
        </ProtectedRoute>
      );

    return <Route key={path} path={path} element={modalElement} />;
  });

  if (isIngredientsLoading || !isAuthChecked) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {guestRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {privateRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && <Routes>{renderedModalRoutes}</Routes>}
    </div>
  );
};

export default App;
