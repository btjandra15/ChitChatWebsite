import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Leftbar from '../../components/LeftBar/Leftbar';
import './Payment.scss';
import { DarkModeContext } from '../../context/darkModeContext';
import axios from 'axios';
import Cookies from 'universal-cookie';
import OutstandingCharges from './components/OutstandingCharges';
import { updateUser } from '../../utils/updateUser';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Payment = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const { darkMode } = useContext(DarkModeContext);
  const [transactionAmount, setTransactionAmount] = useState(0);

  const [outstandingCharges, setOutstandingCharges] = useState([
    { amount: 20, warning: 'Late payment' },
    { amount: 10, warning: 'Overdraft fee' },
  ]);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setLoggedIn(false);
  }

  const handleAddFunds = () => {
    if (transactionAmount > 0) {
      updateUser(userData._id, 'balance', userData.balance + transactionAmount)
      setTransactionAmount(0);
      alert(`Successfully added ${transactionAmount}`)
    }else{
      alert("Please put an amount greater than 0!");
    }
  };

  const handleWithdrawFunds = () => {
    // if (transactionAmount > 0 && transactionAmount <= balance) {
    //   setBalance(balance - transactionAmount);
    //   setTransactionAmount(0);
    // }
  };

  const handlePayWarning = () => {
    // Call the API to update user's warning count and subtract the charge
    axios.put(`http://localhost:3001/update-user/${userData._id}`, {
      fieldToUpdate: 'warningCount',
      newValue: 0,
    })
    .then(() => {
      // Subtract the charge from the user's balance
      updateUser(userData._id, 'balance', userData.balance - 100);
      // Reload the page to reflect the updated balance
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error updating user warnings:', error);
    });
  };

  const handlePayCharge = (amount, index) => {
    // Call the API to update user's balance
    const updatedBalance = userData.balance - amount;
    updateUser(userData._id, 'balance', updatedBalance);

    // Remove the charge from the chargesAmount array
    const updatedCharges = [...userData.chargesAmount];
    updatedCharges.splice(index, 1);
    updateUser(userData._id, 'chargesAmount', updatedCharges);

    // Reload the page to reflect the updated balance and charges
    window.location.reload();
  };

  // const handlePayCharge = (index) => {
  //   // const updatedCharges = [...outstandingCharges];
  //   // const chargeToPay = updatedCharges[index];

  //   // if (balance >= chargeToPay.amount) {
  //   //   setBalance(balance - chargeToPay.amount);
  //   //   updatedCharges.splice(index, 1);
  //   //   setOutstandingCharges(updatedCharges);
  //   // } else {
  //   //   alert('Insufficient balance to pay this charge');
  //   // }
  // };

  useEffect(() => {
    const loggedInUserConfig = {
        method: "GET",
        url: `http://localhost:3001/get-user`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    //Checks the current logged in user
    axios(loggedInUserConfig)
        .then((res) => {
            setLoggedIn(true);
            setUserData(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
   }, [])

   const formatCurrency = (value) => {
    // Check if value is a number and not null
    if (value !== null && !isNaN(value)) {
      return Number(value).toFixed(2);
    }
    return "0.00";
  };

  return (
    <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
      {/* NAVBAR CONTENT */}
      <Navbar loggedIn={loggedIn} userData={userData}/>

      <div className="main-content">
          {/* LEFTBAR CONTENT */}
          <Leftbar loggedIn={loggedIn} userData={userData} logout={logout}/>

          {/* MIDDLE CONTENT */}
          <div style={{flex: 12}}>
              <div className='middleBar'>
                <div className="payment-container">
                    <div className="main-content">
                            <h2>
                          {userData
                            ? `${
                                userData.firstName
                              }'s Account Balance: $${formatCurrency(userData.balance)}`
                            : null}
                        </h2>
                        <h3>
                          Charges Due: $
                          {userData ? formatCurrency(userData.chargesAmount) : null}
                        </h3>

                      <div className="transaction-section">
                        <input
                          type="number"
                          value={transactionAmount}
                          onChange={(e) => setTransactionAmount(parseInt(e.target.value) || 0)}
                        />

                        <div className="funds">
                          <button onClick={handleAddFunds}>Add Funds</button>
                          <button onClick={handleWithdrawFunds} className='withdraw-funds-button'>Withdraw Funds</button>
                        </div>
                      </div>

                      <div className="outstanding-charges">
                        {userData && (
                          <OutstandingCharges user={userData} onPayWarning={handlePayWarning} onPayCharge={handlePayCharge} />
                        )}
                      </div>
                    </div>

                    <div className="ads-section">
                      <h3>Run Ads/Post Job Applications</h3>
                      Add content for running ads or job applications
                    </div>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Payment;
