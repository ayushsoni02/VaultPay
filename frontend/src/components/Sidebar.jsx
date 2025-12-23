import { useNavigate } from "react-router-dom";
import DarkMode from "../icons/DarkMode";
import HistoryIcon from "../icons/HistoryIcon";
import SettingIcon from "../icons/Settingicon";
import UserIcon from "../icons/UserIcon";
import SidebarItem from "./SidebarItems";
import { Button } from "./Button";

export default function Sidebar() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/signin");
  }

  return (
    <div className="h-screen bg-white border-r w-64 fixed left-0 top-0 border-gray-100 shadow-sm flex flex-col z-50">
      <div className="flex items-center gap-3 px-8 pt-8 pb-4">
        <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
          V
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">VaultPay</span>
      </div>

      <div className="pt-6 px-4 space-y-2 flex-grow">
        <SidebarItem text="Dashboard" icon={<UserIcon />} active />
        <SidebarItem text="Transactions" icon={<HistoryIcon />} />
        <SidebarItem text="Settings" icon={<SettingIcon />} />
        <SidebarItem text="Appearance" icon={<DarkMode />} />
      </div>

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-5M12 12h9" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}