import { Outlet } from "react-router-dom";
import StudentHeader from "./header";

function StudentViewCommonLayout() {
  return (
    <div>
      <StudentHeader />
      <Outlet />
    </div>
  );
}

export default StudentViewCommonLayout;
