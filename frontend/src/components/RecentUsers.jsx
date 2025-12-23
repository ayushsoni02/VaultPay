import { useEffect, useState } from "react";
import UserIcon from "../icons/UserIcon"; // Assuming we can reuse or I'll pick a simple one
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const RecentUsers = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // For "Recent", we'll just fetch a few users for now as a mockup of "recent" interactions
        axios.get("http://localhost:3000/api/v1/user/bulk?filter=")
            .then(response => {
                // Just take first 5 for "Recent" mock
                setUsers(response.data.user.slice(0, 10) || []);
            })
            .catch(e => console.error(e));
    }, []);

    if (users.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Send</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex items-center justify-center min-w-[4rem] h-16 w-16 rounded-full bg-purple-100 border-2 border-dashed border-purple-300 text-purple-600 cursor-pointer hover:bg-purple-200 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>

                {users.map(user => (
                    <div
                        key={user._id}
                        onClick={() => navigate("/send?id=" + user._id + "&name=" + user.firstName)}
                        className="flex flex-col items-center gap-2 cursor-pointer group min-w-[4rem]"
                    >
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 group-hover:ring-2 ring-purple-500 transition overflow-hidden bg-cover"
                            style={{ backgroundImage: `url(https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName})` }}>
                            {/* Fallback if image fails or just use text if prefer */}
                        </div>
                        <span className="text-xs font-medium text-gray-600 truncate max-w-[4rem]">{user.firstName}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
