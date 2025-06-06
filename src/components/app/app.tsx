import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { NotFound404 } from '@pages';
import { Modal } from '@components';
import { OrderInfo } from '@components';
import { IngredientDetails } from '@components';
import { ProtectedRoute } from '@components';
import { AppHeader } from '@components';
import styles from './app.module.css';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useEffect } from 'react';
import { deleteCookie, getCookie } from '../../utils/cookie';
import {
  fetchIngredients,
  selectIngredients
} from '../../slices/ingredientsSlice';
import { checkUserAuth, init } from '../../slices/usersSlice';
import { fetchFeeds, selectOrders } from '../../slices/ordersSlice';
import { closeDetailsModal } from '../../slices/modalSlice';

function App() {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const token = getCookie('accessToken');

  const dispatch = useAppDispatch();

  const ingredients = useAppSelector(selectIngredients);
  const feed = useAppSelector(selectOrders);

  useEffect(() => {
    if (token) {
      dispatch(checkUserAuth())
        .unwrap()
        .catch(() => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        });
    } else {
      dispatch(init());
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (!ingredients || ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [ingredients, dispatch]);

  useEffect(() => {
    if (!feed || feed.length === 0) {
      dispatch(fetchFeeds());
    }
  }, [feed, dispatch]);

  const handleModalClose = () => {
    navigate(-1);
    dispatch(closeDetailsModal());
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* TODO: много работы( init, auth ) */}
      <main className={styles.main}>
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />

          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />

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
      </main>
      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={handleModalClose} title='Детали заказа'>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={handleModalClose} title='Детали ингредиента'>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal onClose={handleModalClose} title='Детали заказа'>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
