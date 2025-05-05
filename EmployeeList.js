import React, { useEffect, useState } from 'react';
import EmployeeForm from './EmployeeForm';

function EmployeeList({ token }) {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async (query = '') => {
    try {
      const url = query ? '/employees/search?q=' + encodeURIComponent(query) : '/employees';
      const response = await fetch(url, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await response.json();
      if (response.ok) {
        setEmployees(data);
      } else {
        alert(data.message || 'Failed to fetch employees');
      }
    } catch (err) {
      alert('Server error while fetching employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchQuery);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const response = await fetch('/employees/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await response.json();
      if (response.ok) {
        fetchEmployees();
      } else {
        alert(data.message || 'Failed to delete employee');
      }
    } catch (err) {
      alert('Server error while deleting employee');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    fetchEmployees();
  };

  return (
    <div>
      <h2>Employee List</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={() => { setSearchQuery(''); fetchEmployees(); }}>Clear</button>
      </form>
      <button onClick={handleAdd}>Add New Employee</button>
      {showForm && (
        <EmployeeForm
          token={token}
          employee={editingEmployee}
          onClose={handleFormClose}
        />
      )}
      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Employee Type</th>
            <th>Profile Pic</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 && (
            <tr>
              <td colSpan="6">No employees found.</td>
            </tr>
          )}
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.employeeType}</td>
              <td>
                {emp.profilePic ? (
                  <img src={emp.profilePic} alt="Profile" width="50" />
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
