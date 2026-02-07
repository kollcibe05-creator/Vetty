import React from 'react';
import { useSelector } from 'react-redux';
import { selectModals } from '../features/uiSlice';
import MpesaModal from './MpesaModal';

const ModalRoot = () => {
  const modals = useSelector(selectModals);

  return (
    <>
      {modals.mpesa && <MpesaModal />}
      {/* Add other modals here as they are created */}
    </>
  );
};

export default ModalRoot;
