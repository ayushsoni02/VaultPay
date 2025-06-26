import React, { useEffect, useState } from 'react';
import { Appbar } from '../components/Appbar';
import { Balance } from '../components/Balance';
import { Users } from '../components/Users';

function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [userName, setUserName] = useState("Guest"); // Default to "Guest"

  useEffect(() => {
    console.log("useEffect triggered");

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log("User API Response:", data);

        if (response.ok) {
          setUserName(data.firstName); // Assuming API returns { firstName: "John" }
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchBalance = async () => {
      console.log("Fetching balance...");
      try {
        const response = await fetch('http://localhost:3000/api/v1/account/balance', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Response received:", response);
    
        const data = await response.json();
        console.log("Balance API Response:", data);
    
        if (response.ok) {
          setBalance(data.balance);
        } else {
          console.error("Error fetching balance:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
    fetchBalance();
  }, []);

  return (
    <div>
      <Appbar userName={userName} />
      <div className="m-8">
        <Balance value={balance !== null ? balance : "Loading..."} />
        <Users />
      </div>
    </div>
  );
}

export default Dashboard;
