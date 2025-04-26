import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboard from "./pages/instructor";
import StudentHomePage from "./pages/student/home";

function App() {
  const { auth } = useContext(AuthContext);
  return (
    <div>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              authenticated={auth?.authenticated}
              element={<AuthPage />}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <RouteGuard
              authenticated={auth?.authenticated}
              user={auth?.user}
              element={<InstructorDashboard />}
            />
          }
        />
        <Route
          path="/home"
          element={
            <RouteGuard
              authenticated={auth?.authenticated}
              user={auth?.user}
              element={<StudentHomePage />}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
