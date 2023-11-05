import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import "./Payment.scss";

const Payment = () => {
  const [balance, setBalance] = useState(100);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [outstandingCharges, setOutstandingCharges] = useState([
    { amount: 20, warning: 'Late payment' },
    { amount: 10, warning: 'Overdraft fee' },
  ]);
  const loggedIn = true; // Replace with your logic to determine user's logged-in status

  const handleAddFunds = () => {
    if (transactionAmount > 0) {
      setBalance(balance + transactionAmount);
      setTransactionAmount(0);
    }
  };

  const handleWithdrawFunds = () => {
    if (transactionAmount > 0 && transactionAmount <= balance) {
      setBalance(balance - transactionAmount);
      setTransactionAmount(0);
    }
  };

  const handlePayCharge = (index) => {
    const updatedCharges = [...outstandingCharges];
    const chargeToPay = updatedCharges[index];

    if (balance >= chargeToPay.amount) {
      setBalance(balance - chargeToPay.amount);
      updatedCharges.splice(index, 1);
      setOutstandingCharges(updatedCharges);
    } else {
      // Handle insufficient balance scenario
      // For example: Show a message to the user
      alert('Insufficient balance to pay this charge');
    }
  };

  return (
    <div className="payment-container">
      <div className="main-content" style={{ display: 'flex' }}>
        <div className='middleBar' style={{ flex: 1 }}>
          <h2>User's Account Balance: ${loggedIn ? balance : 'Login to view balance'}</h2>
          <div className="transaction-section">
            <input
              type="number"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(parseInt(e.target.value))}
            />
            <button onClick={handleAddFunds}>Add Funds</button>
            <button onClick={handleWithdrawFunds}>Withdraw Funds</button>
          </div>
          <div className="outstanding-charges" style={{ width: '50%' }}>
            <h3>Outstanding Charges:</h3>
            <ul>
              {outstandingCharges.map((charge, index) => (
                <li key={index}>
                  <span>Amount: ${charge.amount}</span>
                  <span>Warning: {charge.warning}</span>
                  <button onClick={() => handlePayCharge(index)}>Pay</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ads-section" style={{ flex: 1 }}>
          <h3>Run Ads/Post Job Applications</h3>
          {/* Add content for running ads or job applications */}
        </div>
      </div>
    </div>
  );
};

export default Payment;
