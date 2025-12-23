import { useNavigate } from "react-router-dom";
import dashboardMockup from "../assets/dashboard_mockup.png";

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Navigation */}
            <nav className="flex justify-between items-center py-6 px-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                    <span className="text-xl font-bold text-gray-900">VaultPay</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate("/signin")} className="text-gray-600 font-medium hover:text-gray-900 transition">Sign In</button>
                    <button onClick={() => navigate("/signup")} className="bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-200">
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 pt-16 pb-24 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                    The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Payments</span> <br /> is Here.
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Experience lightning-fast transfers, secure transactions, and a dashboard designed for the modern world. Join thousands of users today.
                </p>
                <div className="flex justify-center gap-4 mb-16">
                    <button onClick={() => navigate("/signup")} className="bg-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-700 transition shadow-xl shadow-purple-600/30">
                        Create Free Account
                    </button>
                    <button onClick={() => navigate("/signin")} className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg border border-gray-200 hover:bg-gray-50 transition">
                        View Demo
                    </button>
                </div>

                {/* Dashboard Mockup */}
                <div className="relative mx-auto max-w-5xl rounded-2xl p-2 bg-gradient-to-b from-gray-200 to-gray-50 shadow-2xl overflow-hidden">
                    <div className="rounded-xl overflow-hidden bg-white">
                        <img src={dashboardMockup} alt="Dashboard Preview" className="w-full h-auto object-cover" />
                    </div>
                    {/* Floating Elements (Decorative) */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
                    <FeatureCard
                        icon={<ShieldIcon />}
                        title="Bank-Grade Security"
                        description="Your money is protected by 256-bit encryption and advanced fraud detection systems."
                    />
                    <FeatureCard
                        icon={<ZapIcon />}
                        title="Instant Transfers"
                        description="Send money to anyone, anywhere, in seconds. No holding periods, no hidden fees."
                    />
                    <FeatureCard
                        icon={<UsersIcon />}
                        title="Social Payments"
                        description="Connect with friends, split bills, and manage expenses together seamlessly."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 mt-12">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="h-6 w-6 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">V</div>
                        <span className="font-bold text-gray-900">VaultPay</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                        &copy; 2024 VaultPay Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function ShieldIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
    )
}

function ZapIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
    )
}

function UsersIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
    )
}
