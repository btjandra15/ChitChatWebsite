import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Leftbar from '../../components/LeftBar/Leftbar';
import './Payment.scss';

const Payment = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [balance, setBalance] = useState(100);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [outstandingCharges, setOutstandingCharges] = useState([
    { amount: 20, warning: 'Late payment' },
    { amount: 10, warning: 'Overdraft fee' },
  ]);

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
      alert('Insufficient balance to pay this charge');
    }
  };

  return (
    <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <div className="container">
        <Leftbar />
        <div className="payment-container">
          <div className="main-content">
            <h2>User's Account Balance: ${balance}</h2>

            <div className="transaction-section">
              <input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(parseInt(e.target.value) || 0)}
              />
              <button onClick={handleAddFunds}>Add Funds</button>
              <button onClick={handleWithdrawFunds}>Withdraw Funds</button>
            </div>

            <div className="outstanding-charges">
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
          <div className="ads-section">
            <h3>Run Ads/Post Job Applications</h3>
            {/* Add content for running ads or job applications */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
