import { useState } from "react";
import axios from "axios";

export const VaultCard = ({ vaultBalance, refreshBalance }) => {
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState("deposit"); // 'deposit' or 'withdraw'
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransaction = async () => {
        if (!amount || Number(amount) <= 0) return;
        setLoading(true);
        try {
            const endpoint = mode === "deposit"
                ? "http://localhost:3000/api/v1/account/vault/deposit"
                : "http://localhost:3000/api/v1/account/vault/withdraw";

            await axios.post(endpoint, {
                amount: Number(amount)
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            setAmount("");
            setShowModal(false);
            refreshBalance();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Transaction failed");
        }
        setLoading(false);
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <span className="text-sm font-medium tracking-wide">Secure Vault</span>
                </div>
                <h3 className="text-3xl font-bold">Rs. {vaultBalance}</h3>
            </div>

            <div className="mt-8 flex gap-3">
                <button
                    onClick={() => { setMode("deposit"); setShowModal(true); }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-medium transition backdrop-blur-sm border border-white/10"
                >
                    Lock Money
                </button>
                <button
                    onClick={() => { setMode("withdraw"); setShowModal(true); }}
                    className="flex-1 bg-transparent hover:bg-white/5 text-gray-300 py-2 rounded-lg text-sm font-medium transition border border-gray-600"
                >
                    Unlock
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-gray-900 shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-4">
                            {mode === "deposit" ? "Lock Money into Vault" : "Unlock Money"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {mode === "deposit"
                                ? "Money locked in Vault cannot be spent until you unlock it."
                                : "Unlocking money sends it back to your main balance."}
                        </p>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-purple-600 outline-none py-2"
                                placeholder="0"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTransaction}
                                disabled={loading}
                                className="flex-1 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
                            >
                                {loading ? "Processing..." : (mode === "deposit" ? "Lock Funds" : "Unlock Funds")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
