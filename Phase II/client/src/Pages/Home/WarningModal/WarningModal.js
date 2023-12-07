import React, { useState } from 'react';
import './WarningModal.scss';

const WarningModal = ({ userId, onConfirm }) => {
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = (action) => {
        setConfirmed(true);
        onConfirm(userId, action);
    };

    return (
        <div className="overlay">
            <div className="modal">
                <h2>You have 3 or more warnings. Choose an option:</h2>
                <button className="submit" onClick={() => handleConfirm('payFine')}>
                    Pay Fine
                </button>
                <button className="submit" onClick={() => handleConfirm('removeFromSystem')}>
                    Remove from System
                </button>
                {confirmed && <p>Processing...</p>}
            </div>
        </div>
    );
};

export default WarningModal;

