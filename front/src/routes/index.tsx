import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ReactElement } from "react";
import { LoginPage } from "../pages/LoginPage";
import { Dashboard } from "../pages/Dashboard";

type PrivateRouteProps = {
  children: ReactElement;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={{ pathname: "/" }} />
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
