import { useEffect, useState } from "react"
import { Button } from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const Users = () => {
    // Replace with backend call
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        setLoading(true);
        axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log("Users received:", response.data);
                setUsers(response.data.user || []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setError(error);
                setLoading(false);
            });
    }, [filter]);

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error loading users: {error.message}</div>;
    if (users.length === 0) return <div>No users found</div>;

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input onChange={(e) => {
                setFilter(e.target.value)
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"/>
        </div>
        <div>
        {users.map(user => <User key={user._id} user={user} />)}
        </div>
    </>
}

function User({user}) {
    const navigate = useNavigate();
    console.log("Rendering user:", user); 

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-full">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={() => {
                console.log("Send button clicked for user:", user._id);
                navigate("/send?id=" + user._id + "&name=" + user.firstName);
            }} 
            label={"Send Money"}
            />
        </div>
    </div>
}