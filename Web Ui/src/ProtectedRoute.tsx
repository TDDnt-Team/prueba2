import { useGlobalState } from "./modules/User-Authentication/domain/authStates";
import { useNavigate } from "react-router-dom";
import React, { ReactNode, useEffect } from "react";
import {VITE_API} from "../config.ts";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRouteComponent({ children }: Readonly<ProtectedRouteProps>) {
  const authData = useGlobalState("authData")[0];
  const navigate = useNavigate();
  console.log("API_URL = ", VITE_API);
  useEffect(() => {
    if (authData.userEmail == "" && authData.userEmail != null) {
      navigate("/login");
    }
  }, [authData]);

  return <React.Fragment>{children}</React.Fragment>;
}

export default ProtectedRouteComponent;
