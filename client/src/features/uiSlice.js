import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Spinner states
    spinner: {
      isLoading: false,
      message: '',
    },
    // Notification states
    notification: {
      show: false,
      type: 'info', // 'success', 'error', 'warning', 'info'
      title: '',
      message: '',
      duration: 3000, // auto-dismiss after 3 seconds
    },
    // Modal states
    modals: {
      mpesa: false,
      confirm: false,
      generic: false,
    },
    // Footer visibility
    footerVisible: true,
  },
  reducers: {
    // Spinner actions
    showSpinner: (state, action) => {
      state.spinner.isLoading = true;
      state.spinner.message = action.payload?.message || 'Loading...';
    },
    hideSpinner: (state) => {
      state.spinner.isLoading = false;
      state.spinner.message = '';
    },
    
    // Notification actions
    showNotification: (state, action) => {
      state.notification.show = true;
      state.notification.type = action.payload.type || 'info';
      state.notification.title = action.payload.title || '';
      state.notification.message = action.payload.message || '';
      state.notification.duration = action.payload.duration || 3000;
    },
    hideNotification: (state) => {
      state.notification.show = false;
    },
    
    // Modal actions
    showMpesaModal: (state) => {
      state.modals.mpesa = true;
    },
    hideMpesaModal: (state) => {
      state.modals.mpesa = false;
    },
    showConfirmModal: (state) => {
      state.modals.confirm = true;
    },
    hideConfirmModal: (state) => {
      state.modals.confirm = false;
    },
    showGenericModal: (state) => {
      state.modals.generic = true;
    },
    hideGenericModal: (state) => {
      state.modals.generic = false;
    },
    hideAllModals: (state) => {
      state.modals.mpesa = false;
      state.modals.confirm = false;
      state.modals.generic = false;
    },
    
    // Footer actions
    showFooter: (state) => {
      state.footerVisible = true;
    },
    hideFooter: (state) => {
      state.footerVisible = false;
    },
    
    // Utility actions
    resetUI: (state) => {
      state.spinner.isLoading = false;
      state.spinner.message = '';
      state.notification.show = false;
      state.modals.mpesa = false;
      state.modals.confirm = false;
      state.modals.generic = false;
      state.footerVisible = true;
    },
  },
});

export const {
  showSpinner,
  hideSpinner,
  showNotification,
  hideNotification,
  showMpesaModal,
  hideMpesaModal,
  showConfirmModal,
  hideConfirmModal,
  showGenericModal,
  hideGenericModal,
  hideAllModals,
  showFooter,
  hideFooter,
  resetUI,
} = uiSlice.actions;

// Selectors
export const selectSpinner = (state) => state.ui.spinner;
export const selectNotification = (state) => state.ui.notification;
export const selectModals = (state) => state.ui.modals;
export const selectFooterVisible = (state) => state.ui.footerVisible;

export default uiSlice.reducer;
