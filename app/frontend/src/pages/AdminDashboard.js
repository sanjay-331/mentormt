import React, { useState, useContext, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  UserCheck,
  UsersRound,
  Bell,
  LogOut,
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  UserPlus,
} from 'lucide-react';

// --- Reusable Modal Component ---
function Modal({ title, children, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// --- Add User Modal Component (Reusable for Student/Mentor/Admin) ---
function AddUserModal({ isOpen, onClose, roleToCreate, onUserAdded }) {
  const { token, API } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    role: roleToCreate || 'student',
    usn: '',
    employee_id: '',
    department: '',
    semester: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: roleToCreate || 'student' }));
  }, [roleToCreate, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      email: formData.email,
      full_name: formData.full_name,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === 'student') {
      dataToSend.usn = formData.usn;
      dataToSend.semester = parseInt(formData.semester);
    } else if (formData.role === 'mentor') {
      dataToSend.employee_id = formData.employee_id;
    }

    dataToSend.department = formData.department;
    dataToSend.phone = formData.phone;

    try {
      await axios.post(`${API}/auth/register`, dataToSend);
      toast.success(`${formData.full_name} (${formData.role}) added successfully.`);
      onUserAdded();
      onClose();
      setFormData({
        email: '',
        full_name: '',
        password: '',
        role: roleToCreate || 'student',
        usn: '',
        employee_id: '',
        department: '',
        semester: '',
        phone: ''
      });
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to add user. Check email or server logs.');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = formData.role === 'student';
  const isMentor = formData.role === 'mentor';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add New ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="full_name">Full Name</label>
            <input type="text" className="form-input" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input type="email" className="form-input" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input type="password" className="form-input" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone</label>
            <input type="text" className="form-input" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="department">Department</label>
            <input type="text" className="form-input" id="department" name="department" value={formData.department} onChange={handleChange} required />
          </div>

          {isStudent && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="usn">USN</label>
                <input type="text" className="form-input" id="usn" name="usn" value={formData.usn} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="semester">Semester</label>
                <input type="number" className="form-input" id="semester" name="semester" value={formData.semester} onChange={handleChange} required min="1" max="8" />
              </div>
            </>
          )}

          {isMentor && (
            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="employee_id">Employee ID</label>
              <input type="text" className="form-input" id="employee_id" name="employee_id" value={formData.employee_id} onChange={handleChange} required />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// --- Overview Component ---
function Overview() {
  const { token, API } = useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading Dashboard Data...</div>;

  return (
    <div>
      <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #1e40af, #1e3a8a)', color: 'white' }}>
          <div className="stat-label text-center">Total Students</div>
          <div className="stat-value text-center" data-testid="total-students">{stats?.total_students || 0}</div>
        </div>
        <div className="card stat-card " style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: 'white' }}>
          <div className="stat-label text-center">Total Mentors</div>
          <div className="stat-value text-center" data-testid="total-mentors">{stats?.total_mentors || 0}</div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>
          <div className="stat-label text-center">Assignments</div>
          <div className="stat-value text-center" data-testid="total-assignments">{stats?.total_assignments || 0}</div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white' }}>
          <div className="stat-label text-center">Circulars</div>
          <div className="stat-value text-center" data-testid="total-circulars">{stats?.total_circulars || 0}</div>
        </div>
      </div>

      <div className="card mt-4 p-6">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="btn btn-primary" onClick={() => navigate('/students')} data-testid="quick-add-student">
            <UserPlus size={18} /> Add/Manage Students
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/mentors')} data-testid="quick-add-mentor">
            <UserPlus size={18} /> Add/Manage Mentors
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/circulars')} data-testid="quick-post-circular">
            <Bell size={18} /> Post Circular
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Students Component ---
function Students() {
  const { token, API } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/users?role=student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete student: ${userName}? This action cannot be undone.`)) {
      return;
    }
    try {
      await axios.delete(`${API}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${userName} deleted successfully.`);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete user.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${students.length} Students found`}</div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          data-testid="add-student-button"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>USN</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Loading students...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No students found.</td></tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} data-testid={`student-row-${student.id}`}>
                    <td>{student.full_name}</td>
                    <td>{student.email}</td>
                    <td>{student.usn || 'N/A'}</td>
                    <td>{student.department || 'N/A'}</td>
                    <td>{student.semester || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.375rem 0.75rem' }} onClick={() => { setUserToEdit(student); setShowEditModal(true); }}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.375rem 0.75rem', borderColor: '#dc2626', color: '#dc2626' }} onClick={() => handleDeleteUser(student.id, student.full_name)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        roleToCreate="student"
        onUserAdded={fetchStudents}
      />
      {userToEdit && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setUserToEdit(null); }}
          user={userToEdit}
          onUserUpdated={fetchStudents}
        />
      )}
    </div>
  );
}

// --- Mentors Component ---
function Mentors() {
  const { token, API } = useContext(AppContext);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/users?role=mentor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMentors(response.data);
    } catch (error) {
      toast.error('Failed to fetch mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete mentor: ${userName}? This action cannot be undone.`)) {
      return;
    }
    try {
      await axios.delete(`${API}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${userName} deleted successfully.`);
      fetchMentors();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete user.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${mentors.length} Mentors found`}</div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          data-testid="add-mentor-button"
        >
          <Plus size={18} /> Add Mentor
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center">Loading mentors...</td></tr>
              ) : mentors.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No mentors found.</td></tr>
              ) : (
                mentors.map((mentor) => (
                  <tr key={mentor.id} data-testid={`mentor-row-${mentor.id}`}>
                    <td>{mentor.full_name}</td>
                    <td>{mentor.email}</td>
                    <td>{mentor.employee_id || 'N/A'}</td>
                    <td>{mentor.department || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.375rem 0.75rem' }} onClick={() => { setUserToEdit(mentor); setShowEditModal(true); }}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.375rem 0.75rem', borderColor: '#dc2626', color: '#dc2626' }} onClick={() => handleDeleteUser(mentor.id, mentor.full_name)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        roleToCreate="mentor"
        onUserAdded={fetchMentors}
      />
      {userToEdit && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setUserToEdit(null); }}
          user={userToEdit}
          onUserUpdated={fetchMentors}
        />
      )}
    </div>
  );
}

// --- Edit User Modal Component (Reusable) ---
function EditUserModal({ isOpen, onClose, user, onUserUpdated }) {
  const { token, API } = useContext(AppContext);
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    department: user.department || '',
    phone: user.phone || '',
    usn: user.usn || '',
    employee_id: user.employee_id || '',
    semester: user.semester || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = { ...formData };
    if (user.role === 'student' && dataToSend.semester) {
      dataToSend.semester = parseInt(dataToSend.semester);
    }
    Object.keys(dataToSend).forEach(key => (dataToSend[key] === '' || dataToSend[key] === null) && delete dataToSend[key]);
    delete dataToSend.email;

    try {
      await axios.put(`${API}/users/${user.id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${user.full_name}'s details updated successfully.`);
      onUserUpdated();
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = user.role === 'student';
  const isMentor = user.role === 'mentor';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}: ${user.full_name}`}
    >
      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group col-span-2">
            <label className="form-label">Email (Immutable)</label>
            <input type="text" className="form-input bg-gray-100 cursor-not-allowed" value={user.email} disabled />
          </div>
          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="full_name">Full Name</label>
            <input type="text" className="form-input" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone</label>
            <input type="text" className="form-input" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="department">Department</label>
            <input type="text" className="form-input" id="department" name="department" value={formData.department} onChange={handleChange} required />
          </div>

          {isStudent && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="usn">USN</label>
                <input type="text" className="form-input" id="usn" name="usn" value={formData.usn} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="semester">Semester</label>
                <input type="number" className="form-input" id="semester" name="semester" value={formData.semester} onChange={handleChange} required min="1" max="8" />
              </div>
            </>
          )}

          {isMentor && (
            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="employee_id">Employee ID</label>
              <input type="text" className="form-input" id="employee_id" name="employee_id" value={formData.employee_id} onChange={handleChange} required />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// --- Assignments Component ---
function Assignments() {
  const { token, API } = useContext(AppContext);
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mentorsRes, studentsRes] = await Promise.all([
        axios.get(`${API}/users?role=mentor`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/users?role=student`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setMentors(mentorsRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleAssign = async () => {
    if (!selectedMentor || selectedStudents.length === 0) {
      toast.error('Please select a mentor and at least one student');
      return;
    }

    try {
      await axios.post(
        `${API}/assignments?mentor_id=${selectedMentor}&student_ids=${selectedStudents.join(',')}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Assignment created successfully');
      setSelectedMentor('');
      setSelectedStudents([]);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create assignment');
    }
  };

  return (
    <div>
      <div className="card mb-4 p-6">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Create New Assignment</h3>

        <div className="form-group">
          <label className="form-label">Select Mentor</label>
          <select
            className="form-select"
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            data-testid="mentor-select"
          >
            <option value="">--- Choose a mentor ---</option>
            {mentors.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.full_name} ({mentor.employee_id || mentor.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Select Students (Max 20)</label>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem' }}>
            {students.map((student) => (
              <div key={student.id} style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id={`student-${student.id}`}
                  checked={selectedStudents.includes(student.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (selectedStudents.length < 20) {
                        setSelectedStudents([...selectedStudents, student.id]);
                      } else {
                        toast.error('Maximum 20 students per mentor');
                      }
                    } else {
                      setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                    }
                  }}
                  style={{ marginRight: '0.75rem' }}
                />
                <label htmlFor={`student-${student.id}`} style={{ cursor: 'pointer', margin: 0 }}>
                  {student.full_name} ({student.usn || student.email})
                </label>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Selected: {selectedStudents.length}/20
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAssign}
          data-testid="assign-button"
        >
          <UsersRound size={18} /> Assign Students to Mentor
        </button>
      </div>
    </div>
  );
}

// --- Circulars Component ---
function Circulars() {
  const { token, API } = useContext(AppContext);
  const [circulars, setCirculars] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_audience: 'all'
  });

  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      const response = await axios.get(`${API}/circulars`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCirculars(response.data);
    } catch (error) {
      toast.error('Failed to fetch circulars');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/circulars`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Circular posted successfully');
      setShowAddModal(false);
      setFormData({ title: '', content: '', target_audience: 'all' });
      fetchCirculars();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to post circular');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          data-testid="add-circular-button"
        >
          <Plus size={18} /> Post Circular
        </button>
      </div>

      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Post New Circular"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="circular-title-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-input"
                rows="5"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                data-testid="circular-content-input"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                className="form-select"
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                data-testid="circular-audience-select"
              >
                <option value="all">All</option>
                <option value="students">Students Only</option>
                <option value="mentors">Mentors Only</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button type="submit" className="btn btn-primary" data-testid="post-circular-button">
                <Bell size={18} /> Post Circular
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {circulars.map((circular) => (
          <div key={circular.id} className="card p-5" data-testid={`circular-${circular.id}`}>
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                  {circular.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {circular.content}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Target: {circular.target_audience.charAt(0).toUpperCase() + circular.target_audience.slice(1)}</span>
                  <span>Posted: {new Date(circular.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <span className="badge badge-info">{circular.target_audience.charAt(0).toUpperCase() + circular.target_audience.slice(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main AdminDashboard Component ---
function AdminDashboard() {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('overview');

  useEffect(() => {
    const pathName = location.pathname.substring(1);
    const path = pathName.split('/')[0] || 'overview';
    setCurrentPage(path);
  }, [location]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/' },
    { id: 'students', label: 'Students', icon: GraduationCap, path: '/students' },
    { id: 'mentors', label: 'Mentors', icon: UserCheck, path: '/mentors' },
    { id: 'assignments', label: 'Assignments', icon: UsersRound, path: '/assignments' },
    { id: 'circulars', label: 'Circulars', icon: Bell, path: '/circulars' },
  ];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo" data-testid="sidebar-logo">
            <GraduationCap size={32} />
            <span>Admin Panel</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              data-testid={`nav-${item.id}`}
            >
              <item.icon size={20} />
              {item.label}
            </div>
          ))}
        </div>

        <div className="sidebar-footer" style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
          <button
            className="btn btn-outline w-full"
            onClick={logout}
            data-testid="logout-button"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <h1 className="page-title">
            {navItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
          </h1>
          <div className="user-menu">
            <div className="user-info">
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.full_name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
              <div className="user-avatar" data-testid="user-avatar">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/students" element={<Students />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/circulars" element={<Circulars />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;