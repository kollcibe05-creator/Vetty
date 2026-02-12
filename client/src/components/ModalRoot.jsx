import React from 'react';
import { useSelector } from 'react-redux';
import { selectModals } from '../features/uiSlice';
import MpesaModal from './MpesaModal';

const ModalRoot = () => {
  const modals = useSelector(selectModals);

  return (
    <>
      {modals.mpesa && <MpesaModal />}
      {/*Other modals */}
    </>
  );
};

export default ModalRoot;
