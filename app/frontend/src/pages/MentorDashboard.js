import React, { useState, useContext, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Bell,
  Upload,
  LogOut,
  GraduationCap,
  Star,
  TrendingUp
} from 'lucide-react';
import ChatComponent from '../components/ChatComponent';

function MentorDashboard() {
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
    { id: 'students', label: 'My Students', icon: Users, path: '/students' },
    { id: 'attendance', label: 'Attendance', icon: FileText, path: '/attendance' },
    { id: 'marks', label: 'Marks', icon: TrendingUp, path: '/marks' },
    { id: 'feedback', label: 'Feedback', icon: Star, path: '/feedback' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
    { id: 'circulars', label: 'Circulars', icon: Bell, path: '/circulars' },
  ];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <GraduationCap size={32} />
            <span>Mentor Panel</span>
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mentor</div>
              </div>
              <div className="user-avatar">{user.full_name.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/students" element={<MyStudents />} />
            <Route path="/attendance" element={<AttendanceManagement />} />
            <Route path="/marks" element={<MarksManagement />} />
            <Route path="/feedback" element={<FeedbackManagement />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/circulars" element={<Circulars />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const { token, API, user } = useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        axios.get(`${API}/stats/mentor`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/assignments/mentor/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(statsRes.data);
      setStudents(studentsRes.data.students || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 mb-4">
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #1e40af, #1e3a8a)' }}>
          <div className="stat-label">Assigned Students</div>
          <div className="stat-value" data-testid="assigned-students">{stats?.assigned_students || 0}</div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
          <div className="stat-label">Feedback Given</div>
          <div className="stat-value" data-testid="total-feedback">{stats?.total_feedback || 0}</div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <div className="stat-label">Active Sessions</div>
          <div className="stat-value">0</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Students</h3>
        <div className="grid grid-cols-1">
          {students.slice(0, 5).map((student) => (
            <div key={student.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{student.full_name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {student.email} • {student.usn}
                  </div>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyStudents() {
  const { token, API, user } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/assignments/mentor/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students || []);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>USN</th>
              <th>Email</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} data-testid={`student-row-${student.id}`}>
                <td>{student.full_name}</td>
                <td>{student.usn || 'N/A'}</td>
                <td>{student.email}</td>
                <td>{student.department || 'N/A'}</td>
                <td>{student.semester || 'N/A'}</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AttendanceManagement() {
  const { token, API } = useContext(AppContext);
  const [uploadType, setUploadType] = useState('manual');
  const [file, setFile] = useState(null);
  const [manualData, setManualData] = useState({
    student_usn: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present'
  });

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API}/attendance/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Attendance uploaded successfully');
      setFile(null);
    } catch (error) {
      toast.error('Failed to upload attendance');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/attendance`, manualData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Attendance recorded successfully');
      setManualData({
        student_usn: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present'
      });
    } catch (error) {
      toast.error('Failed to record attendance');
    }
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="flex gap-2 mb-4">
          <button
            className={`btn ${uploadType === 'manual' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setUploadType('manual')}
            data-testid="manual-upload-button"
          >
            Manual Entry
          </button>
          <button
            className={`btn ${uploadType === 'upload' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setUploadType('upload')}
            data-testid="csv-upload-button"
          >
            <Upload size={18} /> CSV/Excel Upload
          </button>
        </div>

        {uploadType === 'manual' ? (
          <form onSubmit={handleManualSubmit}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Student USN</label>
                <input
                  type="text"
                  className="form-input"
                  value={manualData.student_usn}
                  onChange={(e) => setManualData({ ...manualData, student_usn: e.target.value })}
                  required
                  data-testid="student-usn-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  value={manualData.subject}
                  onChange={(e) => setManualData({ ...manualData, subject: e.target.value })}
                  required
                  data-testid="subject-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={manualData.date}
                  onChange={(e) => setManualData({ ...manualData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={manualData.status}
                  onChange={(e) => setManualData({ ...manualData, status: e.target.value })}
                  data-testid="status-select"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" data-testid="submit-attendance-button">
              Record Attendance
            </button>
          </form>
        ) : (
          <div>
            <div className="form-group">
              <label className="form-label">Upload CSV/Excel File</label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="form-input"
                data-testid="file-input"
              />
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Expected columns: student_usn, subject, date, status
              </div>
            </div>
            <button onClick={handleFileUpload} className="btn btn-primary" data-testid="upload-file-button">
              <Upload size={18} /> Upload File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MarksManagement() {
  const { token, API } = useContext(AppContext);
  const [uploadType, setUploadType] = useState('manual');
  const [file, setFile] = useState(null);
  const [manualData, setManualData] = useState({
    student_usn: '',
    subject: '',
    semester: 1,
    marks_type: 'IA1',
    marks_obtained: '',
    max_marks: ''
  });

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API}/marks/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Marks uploaded successfully');
      setFile(null);
    } catch (error) {
      toast.error('Failed to upload marks');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/marks`, manualData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Marks recorded successfully');
      setManualData({
        student_usn: '',
        subject: '',
        semester: 1,
        marks_type: 'IA1',
        marks_obtained: '',
        max_marks: ''
      });
    } catch (error) {
      toast.error('Failed to record marks');
    }
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="flex gap-2 mb-4">
          <button
            className={`btn ${uploadType === 'manual' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setUploadType('manual')}
          >
            Manual Entry
          </button>
          <button
            className={`btn ${uploadType === 'upload' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setUploadType('upload')}
          >
            <Upload size={18} /> CSV/Excel Upload
          </button>
        </div>

        {uploadType === 'manual' ? (
          <form onSubmit={handleManualSubmit}>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Student USN</label>
                <input
                  type="text"
                  className="form-input"
                  value={manualData.student_usn}
                  onChange={(e) => setManualData({ ...manualData, student_usn: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  value={manualData.subject}
                  onChange={(e) => setManualData({ ...manualData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  className="form-input"
                  value={manualData.semester}
                  onChange={(e) => setManualData({ ...manualData, semester: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Marks Type</label>
                <select
                  className="form-select"
                  value={manualData.marks_type}
                  onChange={(e) => setManualData({ ...manualData, marks_type: e.target.value })}
                >
                  <option value="IA1">IA 1</option>
                  <option value="IA2">IA 2</option>
                  <option value="IA3">IA 3</option>
                  <option value="Assignment">Assignment</option>
                  <option value="VTU">VTU</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Marks Obtained</label>
                <input
                  type="number"
                  className="form-input"
                  value={manualData.marks_obtained}
                  onChange={(e) => setManualData({ ...manualData, marks_obtained: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Maximum Marks</label>
                <input
                  type="number"
                  className="form-input"
                  value={manualData.max_marks}
                  onChange={(e) => setManualData({ ...manualData, max_marks: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Record Marks
            </button>
          </form>
        ) : (
          <div>
            <div className="form-group">
              <label className="form-label">Upload CSV/Excel File</label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="form-input"
              />
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Expected columns: student_usn, subject, semester, marks_type, marks_obtained, max_marks
              </div>
            </div>
            <button onClick={handleFileUpload} className="btn btn-primary">
              <Upload size={18} /> Upload File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackManagement() {
  const { token, API, user } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/assignments/mentor/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students || []);
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !feedbackText) {
      toast.error('Please select a student and enter feedback');
      return;
    }

    try {
      await axios.post(
        `${API}/feedback`,
        {
          student_id: selectedStudent,
          feedback_text: feedbackText
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Feedback submitted successfully');
      setSelectedStudent('');
      setFeedbackText('');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Provide Feedback</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Student</label>
          <select
            className="form-select"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
            data-testid="student-select"
          >
            <option value="">Choose a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name} ({student.usn})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Feedback</label>
          <textarea
            className="form-input"
            rows="6"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            required
            placeholder="Enter your feedback here..."
            data-testid="feedback-textarea"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" data-testid="submit-feedback-button">
          <Star size={18} /> Submit Feedback
        </button>
      </form>
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_audience: 'students'
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
      setFormData({ title: '', content: '', target_audience: 'students' });
      fetchCirculars();
    } catch (error) {
      toast.error('Failed to post circular');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Bell size={18} /> Post Circular
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
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                className="form-select"
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              >
                <option value="students">Students Only</option>
                <option value="all">All</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                <Bell size={18} /> Post Circular
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1">
        {circulars.map((circular) => (
          <div key={circular.id} className="card">
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                  {circular.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {circular.content}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Posted: {new Date(circular.created_at).toLocaleDateString()}
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

export default MentorDashboard;
