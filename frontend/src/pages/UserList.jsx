import { getUsers } from "../api";
import { useEffect, useState } from "react";

export function UserList() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadAllUsers() {
      const data = await getUsers();
      setUsers(data);
    }
    loadAllUsers();
  }, []);

  return (
    <>
      {users.map((user) => {
        return (
          <>
          <h1>{user.name}</h1>
          <h1>{user.email}</h1>
          <h1>{user.role}</h1>
          <h1>{user.dateCreated}</h1>
          </>
        )
      })}
    </>
  )
}