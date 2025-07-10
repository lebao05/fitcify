import { useContext } from "react";
import HeaderBar from "../../components/user/HeaderBar";

const MainPlayout = () => {
  return (
    <div>
      <HeaderBar />
      <div className="h-screen bg-black">
        <div className="h-[100%] flex"></div>
      </div>
    </div>
  );
};

export default MainPlayout;
