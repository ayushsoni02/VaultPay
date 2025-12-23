import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState } from 'react';

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [isTransferring, setIsTransferring] = useState(false);
    const [transferSuccess, setTransferSuccess] = useState(false);

    const handleTransfer = async () => {
        setIsTransferring(true);
        try {
            await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setTransferSuccess(true);
        } catch (error) {
            console.error("Transfer failed", error);
            setIsTransferring(false); // Only reset if failed
        }
    };

    if (transferSuccess) {
        return (
            <div className="flex justify-center h-screen bg-gray-50 items-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-96 text-center space-y-6">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Transfer Successful!</h2>
                    <p className="text-gray-500">You successfully sent <b>Rs. {amount}</b> to <b>{name}</b>.</p>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-lg"
                    >
                        Done
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-center h-screen bg-gray-50">
            <div className="h-full flex flex-col justify-center">
                <div className="border border-gray-100 max-w-md p-4 space-y-8 w-96 bg-white shadow-xl rounded-2xl relative">

                    {/* Close Button (X icon) */}
                    <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        onClick={() => navigate(-1)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex flex-col space-y-1.5 p-6 pb-2">
                        <h2 className="text-3xl font-bold text-center text-gray-900">Send Money</h2>
                    </div>

                    <div className="p-6 pt-0">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
                                {name && name[0].toUpperCase()}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
                                    placeholder="Enter amount"
                                />
                            </div>

                            {/* Transfer Button */}
                            <button
                                onClick={handleTransfer}
                                className={`justify-center rounded-xl text-sm font-medium transition-all h-12 px-4 py-2 w-full 
                                    ${isTransferring ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"} 
                                    text-white`}
                                disabled={isTransferring}
                            >
                                {isTransferring ? "Processing..." : "Initiate Transfer"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
