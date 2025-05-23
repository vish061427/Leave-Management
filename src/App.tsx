import { useState } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

// import { LeaveProvider } from "./context/LeaveContext";
import { getRoutes } from "./helpers/routes";
import type { User } from './types';

import Login from "./pages/Login";

function AppRoutes({ user }: { user: User | null }) {
  const routes = useRoutes(getRoutes(user));
  return routes;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

 

  // async function handleLogin(username: string, password: string): Promise<User | undefined> {
  //   const found = users.find(u => u.username === username && u.password === password);
  //   console.log('Login found user:', found);
  //   if (found) {
  //     setCurrentUser(found);
  //     localStorage.setItem('userName', found.displayName);
  //     localStorage.setItem('userId', found.id.toString());
  //   }
  //   return found;
  // }
  async function handleLogin(username: string, password: string): Promise<User | undefined> {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!res.ok) {
        // Optionally, you can parse the error message here
        return undefined;
      }
  
      const data = await res.json();
      const user = data.user as User;
  
      setCurrentUser(user);
      localStorage.setItem("userId", user.id.toString());
      localStorage.setItem("userName", user.displayName);
      localStorage.setItem("token", data.access_token); // store JWT token
  
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      return undefined;
    }
  }
  


  return (
    <Router>
      {currentUser ? (
        <AppRoutes user={currentUser} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Router>
  );
  
}
