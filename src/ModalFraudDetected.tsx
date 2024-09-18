import React from 'react';
import './Modal.css';

interface ScamListModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const ScamListModal: React.FC<ScamListModalProps> = ({ title, message, onClose }) => {
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

export default ScamListModal;
