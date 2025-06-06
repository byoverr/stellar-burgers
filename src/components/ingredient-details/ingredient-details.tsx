import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { selectIngredients } from '../../slices/ingredientsSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { openDetailsModal } from '../../slices/modalSlice';

export const IngredientDetails: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (!params.id) {
      navigate('/', { replace: true });
    } else if (location.state?.background) {
      dispatch(openDetailsModal());
    }
  }, [params.id, location, navigate, dispatch]);

  const ingredients = useAppSelector(selectIngredients);
  const ingredientData =
    ingredients && ingredients.length > 0
      ? ingredients.find((item) => item._id === params.id)
      : undefined;

  if (!ingredients || ingredients.length === 0) {
    return <Preloader />;
  }

  if (!ingredientData) {
    navigate('/', { replace: true });
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
