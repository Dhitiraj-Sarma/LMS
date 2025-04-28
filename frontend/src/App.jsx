import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboard from "./pages/instructor";
import StudentHomePage from "./pages/student/home";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import NotFound from "./pages/not-found";
import AddNewCourse from "./pages/instructor/add-new-course";

function App() {
  const { auth } = useContext(AuthContext);
  return (
    <div>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              authenticated={auth?.authenticate}
              element={<AuthPage />}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <RouteGuard
              authenticated={auth?.authenticate}
              user={auth?.user}
              element={<InstructorDashboard />}
            />
          }
        />
        <Route
          path="/instructor/create-new-course"
          element={
            <RouteGuard
              authenticated={auth?.authenticate}
              user={auth?.user}
              element={<AddNewCourse />}
            />
          }
        />
        <Route
          path="/"
          element={
            <RouteGuard
              authenticated={auth?.authenticate}
              user={auth?.user}
              element={<StudentViewCommonLayout />}
            />
          }
        >
          <Route path="" element={<StudentHomePage />} />
          <Route path="home" element={<StudentHomePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
