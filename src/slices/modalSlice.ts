import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../services/store';

type TModalState = {
  isDetailsModalOpen: boolean;
  isOrderModalOpen: boolean;
};

const initialState: TModalState = {
  isDetailsModalOpen: false,
  isOrderModalOpen: false
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openDetailsModal: (state) => {
      state.isDetailsModalOpen = true;
    },
    closeDetailsModal: (state) => {
      state.isDetailsModalOpen = false;
    },
    openOrderModal: (state) => {
      state.isOrderModalOpen = true;
    },
    closeOrderModal: (state) => {
      state.isOrderModalOpen = false;
    }
  }
});

export const selectIsDetailsModalOpen = (state: RootState) =>
  state.modal.isDetailsModalOpen;

export const selectIsOrderModalOpen = (state: RootState) =>
  state.modal.isOrderModalOpen;

export const {
  openDetailsModal,
  closeDetailsModal,
  openOrderModal,
  closeOrderModal
} = modalSlice.actions;

export default modalSlice.reducer;
