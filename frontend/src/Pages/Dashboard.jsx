import React, { useEffect, useState } from 'react';
import { Appbar } from '../components/Appbar'; // We might not need Appbar if we have Sidebar + Header, but let's keep it or replace it with a Header
import { Balance } from '../components/Balance';
import { Users } from '../components/Users';
import { RecentUsers } from '../components/RecentUsers';
import { History } from '../components/History';
import { VaultCard } from '../components/VaultCard';
import Sidebar from '../components/Sidebar';
import axios from "axios";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [userName, setUserName] = useState("Guest");
  const [showUserModal, setShowUserModal] = useState(false);

  const fetchBalance = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/account/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        setVaultBalance(data.vaultBalance || 0);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.firstName);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
    fetchBalance();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">

        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {userName}!</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell or Profile Icon could go here */}
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-600">
              <span className="font-bold text-lg">{userName[0]}</span>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Balance + Actions) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Balance Card Section */}
            <section>
              <Balance value={balance} />
            </section>

            {/* Vault Section */}
            <section>
              <VaultCard vaultBalance={vaultBalance} refreshBalance={fetchBalance} />
            </section>

            {/* Quick Actions / Recent Users */}
            <section>
              <RecentUsers />
            </section>

            {/* Main Action Area */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Send Money</h3>
                <p className="text-gray-500 text-sm">Search for users and send payments instantly.</p>
              </div>
              <button
                onClick={() => setShowUserModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                Search Users
              </button>
            </div>
          </div>

          {/* Right Column (History) */}
          <div className="hidden lg:block space-y-6">
            <History />
          </div>
        </div>
      </div>

      {/* User Search Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg">Send Money</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <Users />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
