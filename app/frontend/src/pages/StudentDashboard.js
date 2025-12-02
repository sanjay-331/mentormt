import React, { useState, useContext, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  MessageSquare,
  Bell,
  User,
  LogOut,
  GraduationCap,
  Star,
  Calendar,
  Award
} from 'lucide-react';
import ChatComponent from '../components/ChatComponent';

function StudentDashboard() {
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
    { id: 'attendance', label: 'Attendance', icon: Calendar, path: '/attendance' },
    { id: 'marks', label: 'Marks', icon: TrendingUp, path: '/marks' },
    { id: 'feedback', label: 'Feedback', icon: Star, path: '/feedback' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
    { id: 'circulars', label: 'Circulars', icon: Bell, path: '/circulars' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <GraduationCap size={32} />
            <span>Student Portal</span>
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
          <button className="btn btn-outline w-full" onClick={logout} data-testid="logout-button">
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Student</div>
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
            <Route path="/attendance" element={<AttendanceView />} />
            <Route path="/marks" element={<MarksView />} />
            <Route path="/feedback" element={<FeedbackView />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/circulars" element={<Circulars />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const { token, API, user } = useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, mentorRes] = await Promise.all([
        axios.get(`${API}/stats/student`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/assignments/student/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(statsRes.data);
      setMentor(mentorRes.data.mentor);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="grid grid-cols-3 mb-4">
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #1e40af, #1e3a8a)' }}>
          <div className="stat-label">Attendance</div>
          <div className="stat-value" data-testid="attendance-percentage">
            {stats?.attendance_percentage || 0}%
          </div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
          <div className="stat-label">Average Marks</div>
          <div className="stat-value" data-testid="average-marks">
            {stats?.average_marks_percentage || 0}%
          </div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <div className="stat-label">Subjects</div>
          <div className="stat-value" data-testid="total-subjects">{stats?.total_subjects || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 mb-4">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={24} /> My Mentor
          </h3>
          {mentor ? (
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {mentor.full_name}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                {mentor.email}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {mentor.department}
              </div>
              <button className="btn btn-primary mt-2" style={{ marginTop: '1rem' }}>
                <MessageSquare size={18} /> Message Mentor
              </button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No mentor assigned yet</p>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={24} /> Performance
          </h3>
          <div style={{ padding: '1rem 0' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Attendance</span>
                <span style={{ fontWeight: 600 }}>{stats?.attendance_percentage || 0}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    width: `${stats?.attendance_percentage || 0}%`,
                    transition: 'width 0.3s'
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Academic Performance</span>
                <span style={{ fontWeight: 600 }}>{stats?.average_marks_percentage || 0}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--secondary), var(--accent))',
                    width: `${stats?.average_marks_percentage || 0}%`,
                    transition: 'width 0.3s'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceView() {
  const { token, API, user } = useContext(AppContext);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${API}/attendance/student/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Attendance Records</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id} data-testid={`attendance-row-${record.id}`}>
                <td>{record.subject}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      record.status === 'present'
                        ? 'badge-success'
                        : record.status === 'absent'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {record.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MarksView() {
  const { token, API, user } = useContext(AppContext);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const response = await axios.get(`${API}/marks/student/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMarks(response.data);
    } catch (error) {
      toast.error('Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Marks Records</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Semester</th>
              <th>Type</th>
              <th>Marks Obtained</th>
              <th>Max Marks</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((record) => (
              <tr key={record.id} data-testid={`marks-row-${record.id}`}>
                <td>{record.subject}</td>
                <td>{record.semester}</td>
                <td>
                  <span className="badge badge-info">{record.marks_type}</span>
                </td>
                <td>{record.marks_obtained}</td>
                <td>{record.max_marks}</td>
                <td>
                  <span style={{ fontWeight: 600 }}>
                    {((record.marks_obtained / record.max_marks) * 100).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeedbackView() {
  const { token, API, user } = useContext(AppContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API}/feedback/student/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(response.data);
    } catch (error) {
      toast.error('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1">
        {feedbacks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Star size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No feedback received yet</p>
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="card" data-testid={`feedback-${feedback.id}`}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.25rem',
                    flexShrink: 0
                  }}
                >
                  <Star size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </div>
                  <p style={{ lineHeight: 1.6, marginBottom: 0 }}>{feedback.feedback_text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Messages() {
  const { user } = useContext(AppContext);
  return <ChatComponent currentUser={user} />;
}

function Circulars() {
  const { token, API } = useContext(AppContext);
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1">
        {circulars.map((circular) => (
          <div key={circular.id} className="card" data-testid={`circular-${circular.id}`}>
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <Bell size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  {circular.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {circular.content}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Posted: {new Date(circular.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const { token, API, user } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    phone: user.phone || '',
    department: user.department || '',
    semester: user.semester || '',
    usn: user.usn || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/users/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>My Profile</h3>
      
      {!editing ? (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '0 auto 1rem' }}>
              {user.full_name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Name</div>
            <div style={{ color: 'var(--text-secondary)' }}>{formData.full_name}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Email</div>
            <div style={{ color: 'var(--text-secondary)' }}>{user.email}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>USN</div>
            <div style={{ color: 'var(--text-secondary)' }}>{formData.usn || 'Not set'}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Department</div>
            <div style={{ color: 'var(--text-secondary)' }}>{formData.department || 'Not set'}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Semester</div>
            <div style={{ color: 'var(--text-secondary)' }}>{formData.semester || 'Not set'}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Phone</div>
            <div style={{ color: 'var(--text-secondary)' }}>{formData.phone || 'Not set'}</div>
          </div>
          <button className="btn btn-primary" onClick={() => setEditing(true)} data-testid="edit-profile-button">
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">USN</label>
            <input
              type="text"
              className="form-input"
              value={formData.usn}
              onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-input"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Semester</label>
            <input
              type="number"
              min="1"
              max="8"
              className="form-input"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" data-testid="save-profile-button">
              Save Changes
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default StudentDashboard;
