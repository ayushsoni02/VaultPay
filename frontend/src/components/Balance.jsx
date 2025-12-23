export const Balance = ({ value, userName }) => {
    return (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl max-w-sm transform transition hover:scale-105 duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-purple-200 text-sm font-medium mb-1">Total Balance</p>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Rs. {value}
                    </h2>
                </div>
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" />
                    </svg>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-purple-200 uppercase tracking-wider">Account Holder</span>
                    <span className="font-semibold tracking-wide">{userName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-6 w-10 bg-white/20 rounded"></div>
                    <span className="text-xs text-purple-200">**** 4242</span>
                </div>
            </div>
        </div>
    );
}