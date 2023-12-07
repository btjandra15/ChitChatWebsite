import React, { useState } from 'react';
import './TipProfileModal.scss';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const TipProfileModal = ({ isOpen, onClose, userData, reportInitiator }) => {
  const [tipAmount, setTipAmount] = useState(0);

  const handleSubmit = async () => {
    const currentTippedUserID = userData._id;
    const tipInitiatorID = reportInitiator._id;

    console.log(`${currentTippedUserID} | ${tipInitiatorID} | ${tipAmount}`);

    if(tipAmount > 0){
        setTipAmount(parseInt(tipAmount));
        
        if(reportInitiator.balance <= 0){
            alert("You have no money to tip this user! Add funds in the payment page");
            return;
        }

        const updateTipAmountConfig = {
            method: "POST",
            url: `http://localhost:3001/tip-user`,
            data: {
                currentTippedUserID: currentTippedUserID,
                tipInitiatorID: tipInitiatorID,
                tipAmount: tipAmount
            },
            headers: {
                Authorization: `Bearer: ${token}`
            }
        }

        axios(updateTipAmountConfig)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            })

        alert("You have successfully tipped the user");
    }else{
        alert("Tip an amount greater than 0");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="modal">
        <button className="close" onClick={onClose}>
          X
        </button>
        <h2>Tip Profile</h2>

        <input type="number" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)} className='tip-box'/>

        <button className="submit" onClick={handleSubmit}>
          Tip User
        </button>
      </div>
    </div>
  );
};

export default TipProfileModal;