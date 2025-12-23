import { useEffect, useState } from "react";
import axios from "axios";

export const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/account/history", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTransactions(response.data.transactions);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching history:", error);
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="text-center text-gray-500 py-4">Loading history...</div>;

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p>No transactions yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-3 pl-2">Details</th>
                            <th className="pb-3 text-right pr-2">Amount</th>
                            <th className="pb-3 text-right pr-2">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="group hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'received' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {tx.type === 'received' ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">
                                                {tx.type === 'received' ? 'Received from' : 'Sent to'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {tx.otherParty ? `${tx.otherParty.firstName} ${tx.otherParty.lastName}` : 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className={`py-4 text-right pr-2 font-semibold text-sm ${tx.type === 'received' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.type === 'received' ? '+' : '-'} Rs. {tx.amount}
                                </td>
                                <td className="py-4 text-right pr-2 text-xs text-gray-400">
                                    {new Date(tx.date).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
