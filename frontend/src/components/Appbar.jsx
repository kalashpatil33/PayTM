import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./Button";
import { Link, useNavigate } from "react-router-dom";

export const Appbar = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/signin"); // Redirect to sign-in page if token doesn't exist
    } else {
      axios
        .get(import.meta.env.VITE_API_URL + "/api/v1/user/getUser", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setUser(response.data.username);
        });
    }
  }, []);
  const signOutHandler = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };
  return (
    <div className="shadow h-14 flex justify-between items-center md:px-10 ">
      <Link to={"/dashboard"}>
        <div className="flex flex-col justify-center h-full ml-4 font-bold">
          PayTM App
        </div>
      </Link>
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col justify-center h-full mr-4">
          <div className="rounded-full h-10 w-10 p-4 bg-slate-200 flex justify-center mr-2">
            <div className="flex flex-col justify-center h-full text-xl">
              {/* {console.log("what is this",user)} */}
              {user.toUpperCase().charAt(0)}
            </div>
          </div>
        </div>
        <div className="my-8 py-2 border-red-20">
          <Button label={"Sign Out"} onClick={signOutHandler} />
        </div>
      </div>
    </div>
  );
};
