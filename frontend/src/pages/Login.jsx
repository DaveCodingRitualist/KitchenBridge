import React, { useState } from "react";
import "./Login.css";
import { useLogin } from "../hooks/useLogin";
import logo from "../assets/kitchen-connect-logo.png";
import { useAuthContext } from "../hooks/useAuthContext";
  import { useEffect } from "react";

const Login = () => {
  const [companyName, setCompanyName] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const { login, error, isLoading } = useLogin();



// Inside Login component
const [users, setUsers] = useState([]);

useEffect(() => {
  const fetchUsers = async () => {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user/login`);
    const data = await response.json();
    setUsers(data);
  };

  fetchUsers();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(companyName, loginCode);
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <img className="logo" src={logo} alt="Kitchen Connect logo" />
      <h3>Login</h3>

      <label>Select Your Restaurant, Hotel, or Venue:</label>
      <select
        className="input-login"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
      >
        <option value="">-- Select Business Name --</option>
        
        {users && users.map((u) => (
         <div key={u._id}>
           <option value={u.companyName}>{u.companyName}</option> 
         </div>
        ))}
      </select>

      <label>Login Code:</label>

      <input
        className="input-login"
        type="password"
        inputMode="numeric"
        // pattern="[0-9]*"
        placeholder="Enter 6-digit code"
        value={loginCode}
        onChange={(e) => setLoginCode(e.target.value)}
        maxLength={6}
        required
      />

      <button disabled={isLoading}>Log in</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default Login;
