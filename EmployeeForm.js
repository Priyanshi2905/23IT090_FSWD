import React, { useState, useEffect } from 'react';

function EmployeeForm({ token, employee, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeType: 'Full-Time',
    profilePic: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        employeeType: employee.employeeType || 'Full-Time',
        profilePic: null,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        employeeType: 'Full-Time',
        profilePic: null,
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setFormData({ ...formData, profilePic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { name, email, phone, employeeType, profilePic } = formData;

    if (!name || !email || !phone || !employeeType) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append('name', name);
      formPayload.append('email', email);
      formPayload.append('phone', phone);
      formPayload.append('employeeType', employeeType);
      if (profilePic) {
        formPayload.append('profilePic', profilePic);
      }

      const url = employee ? '/employees/' + employee._id : '/employees';
      const method = employee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formPayload,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to save employee');
      } else {
        onClose();
      }
    } catch (err) {
      setError('Server error while saving employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
      <h3>{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone:</label><br />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Employee Type:</label><br />
          <select name="employeeType" value={formData.employeeType} onChange={handleChange} required>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contractor">Contractor</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
        <div>
          <label>Profile Picture:</label><br />
          <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
