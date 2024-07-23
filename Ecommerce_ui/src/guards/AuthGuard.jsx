import React, { useEffect } from "react";
import useLoggedInUser from "../custom-hooks/useLoggedInUser";
import { useNavigate } from "react-router-dom";

const AuthGuard = (props) => {
  const isLoggedIn = useLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  //   useEffect(() => {
  //     const handleContextmenu = (e) => {
  //       e.preventDefault();
  //     };
  //     document.addEventListener("contextmenu", handleContextmenu);
  //     return function cleanup() {
  //       document.removeEventListener("contextmenu", handleContextmenu);
  //     };
  //   }, []);

  return <>{isLoggedIn && props.children}</>;
};

export default AuthGuard;
