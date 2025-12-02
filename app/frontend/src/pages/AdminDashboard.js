import React, { useState, useContext, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UsersRound,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  Search,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Download
} from 'lucide-react';

function AdminDashboard() {
  const { user, logout, token, API } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('overview');

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'overview';
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

function Overview() {
  const { token, API } = useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="grid grid-cols-4 mb-4">
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #1e40af, #1e3a8a)' }}>
          <div className="stat-label">Total Students</div>
          <div className="stat-value" data-testid="total-students">{stats?.total_students || 0}</div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
          <div className="stat-label">Total Mentors</div>
          <div className="stat-value" data-testid="total-mentors">{stats?.total_mentors || 0}</div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <div className="stat-label">Assignments</div>
          <div className="stat-value" data-testid="total-assignments">{stats?.total_assignments || 0}</div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
          <div className="stat-label">Circulars</div>
          <div className="stat-value" data-testid="total-circulars">{stats?.total_circulars || 0}</div>
        </div>
      </div>

      <div className="card mt-4">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Quick Actions</h3>
        <div className="grid grid-cols-3">
          <button className="btn btn-primary">
            <UserPlus size={18} /> Add Student
          </button>
          <button className="btn btn-secondary">
            <UserPlus size={18} /> Add Mentor
          </button>
          <button className="btn btn-outline">
            <Bell size={18} /> Post Circular
          </button>
        </div>
      </div>
    </div>
  );
}

function Students() {
  const { token, API } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div></div>
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
              {students.map((student) => (
                <tr key={student.id} data-testid={`student-row-${student.id}`}>
                  <td>{student.full_name}</td>
                  <td>{student.email}</td>
                  <td>{student.usn || 'N/A'}</td>
                  <td>{student.department || 'N/A'}</td>
                  <td>{student.semester || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.375rem 0.75rem' }}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '0.375rem 0.75rem', borderColor: '#dc2626', color: '#dc2626' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Mentors() {
  const { token, API } = useContext(AppContext);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <button className="btn btn-primary" data-testid="add-mentor-button">
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
              {mentors.map((mentor) => (
                <tr key={mentor.id} data-testid={`mentor-row-${mentor.id}`}>
                  <td>{mentor.full_name}</td>
                  <td>{mentor.email}</td>
                  <td>{mentor.employee_id || 'N/A'}</td>
                  <td>{mentor.department || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.375rem 0.75rem' }}>
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
      toast.error('Failed to create assignment');
    }
  };

  return (
    <div>
      <div className="card mb-4">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New Assignment</h3>
        
        <div className="form-group">
          <label className="form-label">Select Mentor</label>
          <select
            className="form-select"
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            data-testid="mentor-select"
          >
            <option value="">Choose a mentor</option>
            {mentors.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.full_name} ({mentor.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Select Students (up to 20)</label>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem' }}>
            {students.map((student) => (
              <div key={student.id} style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id={student.id}
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
                <label htmlFor={student.id} style={{ cursor: 'pointer', margin: 0 }}>
                  {student.full_name} - {student.email}
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
      toast.error('Failed to post circular');
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
        <div className="card mb-4">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Post New Circular</h3>
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
            <div style={{ display: 'flex', gap: '1rem' }}>
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
        </div>
      )}

      <div className="grid grid-cols-1">
        {circulars.map((circular) => (
          <div key={circular.id} className="card" data-testid={`circular-${circular.id}`}>
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                  {circular.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {circular.content}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Target: {circular.target_audience}</span>
                  <span>Posted: {new Date(circular.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <span className="badge badge-info">{circular.target_audience}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
