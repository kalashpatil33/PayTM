import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [bal, setBal] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    // Check if token exists in local storage
    if (!userToken) {
      // console.log("user token not found");
      navigate("/signin"); // Redirect to sign-in page if token doesn't exist
    } else {
      // Fetch balance if token exists
      // console.log("user token found",import.meta.env.VITE_API_URL);
      axios
        .get(import.meta.env.VITE_API_URL + "/api/v1/account/balance", {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        })
        .then((response) => {
          setBal(response.data.balance);
        })
        .catch((error) => {
          navigate("/signin");
        });
    }
  }, [navigate]);
  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={bal} />
        <Users />
      </div>
    </div>
  );
};