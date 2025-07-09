import Layout from "../components/common/Layout";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
}
