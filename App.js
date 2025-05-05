import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div>
        <h1>Employee Management System</h1>
        <Register />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <button onClick={handleLogout}>Logout</button>
      <EmployeeList token={token} />
    </div>
  );
}

export default App;
