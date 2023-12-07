import React, { useState } from 'react'
import './OutstandingCharges.scss'

const OutstandingCharges = ({ user, onPayWarning, onPayCharge }) => {
    const [outstandingCharges, setOutstandingCharges] = useState([
        { amount: 20, warning: 'Late payment' },
        { amount: 10, warning: 'Overdraft fee' },
    ]);

    const handlePayCharge = (index) => {
        // const updatedCharges = [...outstandingCharges];
        // const chargeToPay = updatedCharges[index];
    
        // if (balance >= chargeToPay.amount) {
        //   setBalance(balance - chargeToPay.amount);
        //   updatedCharges.splice(index, 1);
        //   setOutstandingCharges(updatedCharges);
        // } else {
        //   alert('Insufficient balance to pay this charge');
        // }
    };

    return (
        <div>
            <h3>Outstanding Charges:</h3>
            
            <ul>
                {outstandingCharges.map((charge, index) => (
                    <li key={index}>
                        <span>Amount: ${charge.amount}</span>
                        <span>Warning: {charge.warning}</span>
                        <button onClick={() => handlePayCharge(index)}>Pay</button>
                    </li>
                ))}
                {user && user.warningCount === 3 && (
                <li>
                    <span>Amount: $100</span>
                    <span>3 outstanding warnings</span>
                    <button onClick={onPayWarning}>Pay</button>
                </li>
                )}
                {user && user.chargesAmount.map((charge, index) => (
                    <li key={index}>
                        <span>Amount: ${charge}</span>
                        {charge === 10 && <span>Warning: Attempt to Create Job Post</span>}
                        <button onClick={() => {onPayCharge(charge, index)}}>Pay</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OutstandingCharges