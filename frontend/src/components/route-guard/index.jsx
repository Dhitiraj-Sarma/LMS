import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  if (
    authenticated &&
    user?.role !== "admin" &&
    (location.pathname.includes("admin") || location.pathname.includes("auth"))
  ) {
    return <Navigate to="/home" />;
  }

  if (
    authenticated &&
    user?.role === "admin" &&
    !location.pathname.includes("admin")
  ) {
    return <Navigate to="/admin" />;
  }

  return <Fragment>{element}</Fragment>;
}
