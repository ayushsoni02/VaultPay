export const Appbar = ({ onToggleSidebar, userName }) => {
    return (
      <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
          VaultPay App
        </div>
        <div className="flex">
          <div className="flex flex-col justify-center h-full mr-4">
            Hello, {userName}
          </div>
          <div
            className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2 cursor-pointer hover:bg-slate-300 transition-colors"
            onClick={onToggleSidebar}
          >
            <div className="flex flex-col justify-center h-full text-xl">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    );
  };
  