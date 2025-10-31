import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const RequireLoginAlert = ({ children }) => {
  const navigate = useNavigate();
  const alertShownRef = useRef(false);
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        navigate("/home", { replace: true, state: { showLogin: true } });
      }
    } else {
      setIsAllowed(true);
    }
  }, [navigate]);

  if (!isAllowed) return null;

  return children;
};

export default RequireLoginAlert;
