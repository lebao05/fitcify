import { useContext } from "react";
import HeaderBar from "../../components/user/HeaderBar";
import Display from "../../components/user/DisPlay";
import Sidebar from "../../components/user/SideBar";

const MainPlayout = () => {
  return (
    <div>
      <HeaderBar />
      <div className="flex flex-col h-screen bg-black">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Display></Display>
        </div>
      </div>
    </div>
  );
};

export default MainPlayout;