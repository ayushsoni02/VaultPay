import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const debounce = setTimeout(() => {
            setLoading(true);
            axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    setUsers(response.data.user || []);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching users:", error);
                    setLoading(false);
                });
        }, 300); // 300ms debounce

        return () => clearTimeout(debounce);
    }, [filter]);

    return (
        <div className="flex flex-col h-full">
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users by name..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm"
                />
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 max-h-[400px] scrollbar-thin scrollbar-thumb-gray-200">
                {loading ? (
                    <div className="text-center py-4 text-gray-400">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">No users found</div>
                ) : (
                    users.map(user => <User key={user._id} user={user} />)
                )}
            </div>
        </div>
    );
}

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group" onClick={() => navigate("/send?id=" + user._id + "&name=" + user.firstName)}>
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                    {user.firstName[0].toUpperCase()}
                </div>
                <div>
                    <div className="font-semibold text-gray-800 text-sm">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-gray-500">User</div>
                </div>
            </div>

            <button className="bg-gray-100 text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-600 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </div>
    );
}