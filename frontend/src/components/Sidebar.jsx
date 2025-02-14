import { useNavigate } from "react-router-dom";
import DarkMode from "../icons/DarkMode";
import HistoryIcon from "../icons/HistoryIcon";
import SettingIcon from "../icons/Settingicon";
import UserIcon from "../icons/UserIcon";
import SidebarItem from "./SidebarItems";
import { Button } from "./Button";



export default function Sidebar(){
    const navigate = useNavigate();
  function logout(){
        localStorage.removeItem("token");
        navigate("/signin");
    }

    return <div className="h-screen bg-white border-r w-72 fixed right-0 top-0 border-gray-100 shadow-2xl pl-6 flex flex-col">
          <div className="flex text-2xl font-bold text-gray-800 items-center pt-8">
           {/* <div className="pr-2 text-purple-600">
            <Logo />
            </div> */}
            VaultPay
          </div>
        <div className="pt-8 pl-4">
            <SidebarItem text="Users" icon={<UserIcon/>}/>
            <SidebarItem text="Setting" icon={<SettingIcon/>}/>
            <SidebarItem text="DarkMode" icon={<DarkMode/>}/>
            <SidebarItem text="History" icon={<HistoryIcon/>}/>
            </div> 
            <div className="mt-auto pr-6 px-4 pb-6">
             <Button fullWidth={true} variant="primary" text="logout" onClick={logout} label="logout"></Button> 
            </div>
    </div>
}