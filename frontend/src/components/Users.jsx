import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/user/bulk?filter=" + filter)
      .then((response) => {
        // console.log("hi response here is",response.data.user);
        setUsers(response.data.user);
      });
  }, [filter]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="mt-4 mb-10">
        <input
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </div>
    </>
  );
};

function User({ user }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 items-center p-2 border-b border-gray-300">
      {/* Avatar and Username */}
      <div className="flex items-center space-x-3">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex items-center justify-center text-lg font-semibold text-gray-700">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-medium text-gray-800 whitespace-nowrap overflow-hidden">
            {user.username}
          </span>

          <Button
            onClick={() =>
              navigate(`/send?id=${user.id}&name=${user.username}`)
            }
            label="Send Money"
            className="w-auto px-4 py-2 text-sm"
          />
        </div>
      </div>
      {/* Send Money Button */}
    </div>
  );
}
