
import React from 'react';
import './Modal.css';

interface ModalAlertProps {
  title: string;
  message: string;
  onClose: () => void;
}

const NoBalanceTransactionModal: React.FC<ModalAlertProps> = ({ title, message, onClose }) => {
  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2 className='modal-title'>{title}</h2>
        <p className='modal-message'>{message}</p>
        <button className='modal-close-btn' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NoBalanceTransactionModal;
