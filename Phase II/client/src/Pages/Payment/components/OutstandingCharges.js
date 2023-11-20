import React, { useState } from 'react'
import './OutstandingCharges.scss'

const OutstandingCharges = () => {
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
            </ul>
        </div>
    )
}

export default OutstandingCharges