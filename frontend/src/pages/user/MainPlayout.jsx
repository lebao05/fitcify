import { useContext } from "react";
import HeaderBar from "../../components/user/HeaderBar";
import Display from "../../components/user/DisPlay";
import Sidebar from "../../components/user/SideBar";

const MainPlayout = () => {
  return (
    <div>
      <HeaderBar />
      <div className="h-screen bg-black">
        <div className="h-[100%] flex">
          <Sidebar />
          <Display></Display>
        </div>
      </div>
    </div>
  );
};

export default MainPlayout;
