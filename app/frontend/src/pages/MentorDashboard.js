// import React, { useState, useContext, useEffect } from 'react';
// import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
// import { AppContext } from '../App';
// import axios from 'axios';
// import { toast } from 'sonner';
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   MessageSquare,
//   Bell,
//   Upload,
//   LogOut,
//   GraduationCap,
//   Star,
//   TrendingUp
// } from 'lucide-react';
// import ChatComponent from '../components/ChatComponent';

// function MentorDashboard() {
//   const { user, logout, token, API } = useContext(AppContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [currentPage, setCurrentPage] = useState('overview');

//   useEffect(() => {
//     const path = location.pathname.split('/')[1] || 'overview';
//     setCurrentPage(path);
//   }, [location]);

//   const navItems = [
//     { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/' },
//     { id: 'students', label: 'My Students', icon: Users, path: '/students' },
//     { id: 'attendance', label: 'Attendance', icon: FileText, path: '/attendance' },
//     { id: 'marks', label: 'Marks', icon: TrendingUp, path: '/marks' },
//     { id: 'feedback', label: 'Feedback', icon: Star, path: '/feedback' },
//     { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
//     { id: 'circulars', label: 'Circulars', icon: Bell, path: '/circulars' },
//   ];

//   return (
//     <div className="dashboard">
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <div className="sidebar-logo">
//             <GraduationCap size={32} />
//             <span>Mentor Panel</span>
//           </div>
//         </div>

//         <div className="sidebar-nav">
//           {navItems.map((item) => (
//             <div
//               key={item.id}
//               className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
//               onClick={() => navigate(item.path)}
//               data-testid={`nav-${item.id}`}
//             >
//               <item.icon size={20} />
//               {item.label}
//             </div>
//           ))}
//         </div>

//         <div className="sidebar-footer" style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
//           <button className="btn btn-outline w-full" onClick={logout} data-testid="logout-button">
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </div>

//       <div className="main-content">
//         <div className="top-bar">
//           <h1 className="page-title">
//             {navItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
//           </h1>
//           <div className="user-menu">
//             <div className="user-info">
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.full_name}</div>
//                 <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mentor</div>
//               </div>
//               <div className="user-avatar">{user.full_name.charAt(0).toUpperCase()}</div>
//             </div>
//           </div>
//         </div>

//         <div className="content-wrapper">
//           <Routes>
//             <Route path="/" element={<Overview />} />
//             <Route path="/students" element={<MyStudents />} />
//             <Route path="/attendance" element={<AttendanceManagement />} />
//             <Route path="/marks" element={<MarksManagement />} />
//             <Route path="/feedback" element={<FeedbackManagement />} />
//             <Route path="/messages" element={<Messages />} />
//             <Route path="/circulars" element={<Circulars />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Overview() {
//   const { token, API, user } = useContext(AppContext);
//   const [stats, setStats] = useState(null);
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [statsRes, studentsRes] = await Promise.all([
//         axios.get(`${API}/stats/mentor`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${API}/assignments/mentor/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
//       ]);
//       setStats(statsRes.data);
//       setStudents(studentsRes.data.students || []);
//     } catch (error) {
//       toast.error('Failed to fetch data');
//     }
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-3 mb-4">
//         <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #1e40af, #1e3a8a)' }}>
//           <div className="stat-label">Assigned Students</div>
//           <div className="stat-value" data-testid="assigned-students">{stats?.assigned_students || 0}</div>
//         </div>
//         <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
//           <div className="stat-label">Feedback Given</div>
//           <div className="stat-value" data-testid="total-feedback">{stats?.total_feedback || 0}</div>
//         </div>
//         <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
//           <div className="stat-label">Active Sessions</div>
//           <div className="stat-value">0</div>
//         </div>
//       </div>

//       <div className="card">
//         <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Students</h3>
//         <div className="grid grid-cols-1">
//           {students.slice(0, 5).map((student) => (
//             <div key={student.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div>
//                   <div style={{ fontWeight: 600 }}>{student.full_name}</div>
//                   <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
//                     {student.email} • {student.usn}
//                   </div>
//                 </div>
//                 <span className="badge badge-success">Active</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function MyStudents() {
//   const { token, API, user } = useContext(AppContext);
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get(`${API}/assignments/mentor/${user.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setStudents(response.data.students || []);
//     } catch (error) {
//       toast.error('Failed to fetch students');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card">
//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>USN</th>
//               <th>Email</th>
//               <th>Department</th>
//               <th>Semester</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((student) => (
//               <tr key={student.id} data-testid={`student-row-${student.id}`}>
//                 <td>{student.full_name}</td>
//                 <td>{student.usn || 'N/A'}</td>
//                 <td>{student.email}</td>
//                 <td>{student.department || 'N/A'}</td>
//                 <td>{student.semester || 'N/A'}</td>
//                 <td>
//                   <button className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
//                     View Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function AttendanceManagement() {
//   const { token, API } = useContext(AppContext);
//   const [uploadType, setUploadType] = useState('manual');
//   const [file, setFile] = useState(null);
//   const [manualData, setManualData] = useState({
//     student_usn: '',
//     subject: '',
//     date: new Date().toISOString().split('T')[0],
//     status: 'present'
//   });

//   const handleFileUpload = async () => {
//     if (!file) {
//       toast.error('Please select a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       await axios.post(`${API}/attendance/upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       toast.success('Attendance uploaded successfully');
//       setFile(null);
//     } catch (error) {
//       toast.error('Failed to upload attendance');
//     }
//   };

//   const handleManualSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API}/attendance`, manualData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.success('Attendance recorded successfully');
//       setManualData({
//         student_usn: '',
//         subject: '',
//         date: new Date().toISOString().split('T')[0],
//         status: 'present'
//       });
//     } catch (error) {
//       toast.error('Failed to record attendance');
//     }
//   };

//   return (
//     <div>
//       <div className="card mb-4">
//         <div className="flex gap-2 mb-4">
//           <button
//             className={`btn ${uploadType === 'manual' ? 'btn-primary' : 'btn-outline'}`}
//             onClick={() => setUploadType('manual')}
//             data-testid="manual-upload-button"
//           >
//             Manual Entry
//           </button>
//           <button
//             className={`btn ${uploadType === 'upload' ? 'btn-primary' : 'btn-outline'}`}
//             onClick={() => setUploadType('upload')}
//             data-testid="csv-upload-button"
//           >
//             <Upload size={18} /> CSV/Excel Upload
//           </button>
//         </div>

//         {uploadType === 'manual' ? (
//           <form onSubmit={handleManualSubmit}>
//             <div className="grid grid-cols-2">
//               <div className="form-group">
//                 <label className="form-label">Student USN</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={manualData.student_usn}
//                   onChange={(e) => setManualData({ ...manualData, student_usn: e.target.value })}
//                   required
//                   data-testid="student-usn-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Subject</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={manualData.subject}
//                   onChange={(e) => setManualData({ ...manualData, subject: e.target.value })}
//                   required
//                   data-testid="subject-input"
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Date</label>
//                 <input
//                   type="date"
//                   className="form-input"
//                   value={manualData.date}
//                   onChange={(e) => setManualData({ ...manualData, date: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Status</label>
//                 <select
//                   className="form-select"
//                   value={manualData.status}
//                   onChange={(e) => setManualData({ ...manualData, status: e.target.value })}
//                   data-testid="status-select"
//                 >
//                   <option value="present">Present</option>
//                   <option value="absent">Absent</option>
//                   <option value="leave">Leave</option>
//                 </select>
//               </div>
//             </div>
//             <button type="submit" className="btn btn-primary" data-testid="submit-attendance-button">
//               Record Attendance
//             </button>
//           </form>
//         ) : (
//           <div>
//             <div className="form-group">
//               <label className="form-label">Upload CSV/Excel File</label>
//               <input
//                 type="file"
//                 accept=".csv,.xlsx,.xls"
//                 onChange={(e) => setFile(e.target.files[0])}
//                 className="form-input"
//                 data-testid="file-input"
//               />
//               <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
//                 Expected columns: student_usn, subject, date, status
//               </div>
//             </div>
//             <button onClick={handleFileUpload} className="btn btn-primary" data-testid="upload-file-button">
//               <Upload size={18} /> Upload File
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function MarksManagement() {
//   const { token, API } = useContext(AppContext);
//   const [uploadType, setUploadType] = useState('manual');
//   const [file, setFile] = useState(null);
//   const [manualData, setManualData] = useState({
//     student_usn: '',
//     subject: '',
//     semester: 1,
//     marks_type: 'IA1',
//     marks_obtained: '',
//     max_marks: ''
//   });

//   const handleFileUpload = async () => {
//     if (!file) {
//       toast.error('Please select a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       await axios.post(`${API}/marks/upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       toast.success('Marks uploaded successfully');
//       setFile(null);
//     } catch (error) {
//       toast.error('Failed to upload marks');
//     }
//   };

//   const handleManualSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API}/marks`, manualData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.success('Marks recorded successfully');
//       setManualData({
//         student_usn: '',
//         subject: '',
//         semester: 1,
//         marks_type: 'IA1',
//         marks_obtained: '',
//         max_marks: ''
//       });
//     } catch (error) {
//       toast.error('Failed to record marks');
//     }
//   };

//   return (
//     <div>
//       <div className="card mb-4">
//         <div className="flex gap-2 mb-4">
//           <button
//             className={`btn ${uploadType === 'manual' ? 'btn-primary' : 'btn-outline'}`}
//             onClick={() => setUploadType('manual')}
//           >
//             Manual Entry
//           </button>
//           <button
//             className={`btn ${uploadType === 'upload' ? 'btn-primary' : 'btn-outline'}`}
//             onClick={() => setUploadType('upload')}
//           >
//             <Upload size={18} /> CSV/Excel Upload
//           </button>
//         </div>

//         {uploadType === 'manual' ? (
//           <form onSubmit={handleManualSubmit}>
//             <div className="grid grid-cols-2">
//               <div className="form-group">
//                 <label className="form-label">Student USN</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={manualData.student_usn}
//                   onChange={(e) => setManualData({ ...manualData, student_usn: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Subject</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={manualData.subject}
//                   onChange={(e) => setManualData({ ...manualData, subject: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Semester</label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="8"
//                   className="form-input"
//                   value={manualData.semester}
//                   onChange={(e) => setManualData({ ...manualData, semester: parseInt(e.target.value) })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Marks Type</label>
//                 <select
//                   className="form-select"
//                   value={manualData.marks_type}
//                   onChange={(e) => setManualData({ ...manualData, marks_type: e.target.value })}
//                 >
//                   <option value="IA1">IA 1</option>
//                   <option value="IA2">IA 2</option>
//                   <option value="IA3">IA 3</option>
//                   <option value="Assignment">Assignment</option>
//                   <option value="VTU">VTU</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Marks Obtained</label>
//                 <input
//                   type="number"
//                   className="form-input"
//                   value={manualData.marks_obtained}
//                   onChange={(e) => setManualData({ ...manualData, marks_obtained: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Maximum Marks</label>
//                 <input
//                   type="number"
//                   className="form-input"
//                   value={manualData.max_marks}
//                   onChange={(e) => setManualData({ ...manualData, max_marks: e.target.value })}
//                   required
//                 />
//               </div>
//             </div>
//             <button type="submit" className="btn btn-primary">
//               Record Marks
//             </button>
//           </form>
//         ) : (
//           <div>
//             <div className="form-group">
//               <label className="form-label">Upload CSV/Excel File</label>
//               <input
//                 type="file"
//                 accept=".csv,.xlsx,.xls"
//                 onChange={(e) => setFile(e.target.files[0])}
//                 className="form-input"
//               />
//               <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
//                 Expected columns: student_usn, subject, semester, marks_type, marks_obtained, max_marks
//               </div>
//             </div>
//             <button onClick={handleFileUpload} className="btn btn-primary">
//               <Upload size={18} /> Upload File
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function FeedbackManagement() {
//   const { token, API, user } = useContext(AppContext);
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [feedbackText, setFeedbackText] = useState('');

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get(`${API}/assignments/mentor/${user.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setStudents(response.data.students || []);
//     } catch (error) {
//       toast.error('Failed to fetch students');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedStudent || !feedbackText) {
//       toast.error('Please select a student and enter feedback');
//       return;
//     }

//     try {
//       await axios.post(
//         `${API}/feedback`,
//         {
//           student_id: selectedStudent,
//           feedback_text: feedbackText
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Feedback submitted successfully');
//       setSelectedStudent('');
//       setFeedbackText('');
//     } catch (error) {
//       toast.error('Failed to submit feedback');
//     }
//   };

//   return (
//     <div className="card">
//       <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Provide Feedback</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label className="form-label">Select Student</label>
//           <select
//             className="form-select"
//             value={selectedStudent}
//             onChange={(e) => setSelectedStudent(e.target.value)}
//             required
//             data-testid="student-select"
//           >
//             <option value="">Choose a student</option>
//             {students.map((student) => (
//               <option key={student.id} value={student.id}>
//                 {student.full_name} ({student.usn})
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label className="form-label">Feedback</label>
//           <textarea
//             className="form-input"
//             rows="6"
//             value={feedbackText}
//             onChange={(e) => setFeedbackText(e.target.value)}
//             required
//             placeholder="Enter your feedback here..."
//             data-testid="feedback-textarea"
//           ></textarea>
//         </div>
//         <button type="submit" className="btn btn-primary" data-testid="submit-feedback-button">
//           <Star size={18} /> Submit Feedback
//         </button>
//       </form>
//     </div>
//   );
// }

// function Messages() {
//   const { user } = useContext(AppContext);
//   return <ChatComponent currentUser={user} />;
// }

// function Circulars() {
//   const { token, API } = useContext(AppContext);
//   const [circulars, setCirculars] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     target_audience: 'students'
//   });

//   useEffect(() => {
//     fetchCirculars();
//   }, []);

//   const fetchCirculars = async () => {
//     try {
//       const response = await axios.get(`${API}/circulars`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setCirculars(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch circulars');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API}/circulars`, formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.success('Circular posted successfully');
//       setShowAddModal(false);
//       setFormData({ title: '', content: '', target_audience: 'students' });
//       fetchCirculars();
//     } catch (error) {
//       toast.error('Failed to post circular');
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <div></div>
//         <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
//           <Bell size={18} /> Post Circular
//         </button>
//       </div>

//       {showAddModal && (
//         <div className="card mb-4">
//           <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Post New Circular</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label className="form-label">Title</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Content</label>
//               <textarea
//                 className="form-input"
//                 rows="5"
//                 value={formData.content}
//                 onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//                 required
//               ></textarea>
//             </div>
//             <div className="form-group">
//               <label className="form-label">Target Audience</label>
//               <select
//                 className="form-select"
//                 value={formData.target_audience}
//                 onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
//               >
//                 <option value="students">Students Only</option>
//                 <option value="all">All</option>
//               </select>
//             </div>
//             <div style={{ display: 'flex', gap: '1rem' }}>
//               <button type="submit" className="btn btn-primary">
//                 <Bell size={18} /> Post Circular
//               </button>
//               <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       <div className="grid grid-cols-1">
//         {circulars.map((circular) => (
//           <div key={circular.id} className="card">
//             <div className="flex justify-between items-start">
//               <div style={{ flex: 1 }}>
//                 <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: 600 }}>
//                   {circular.title}
//                 </h4>
//                 <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
//                   {circular.content}
//                 </p>
//                 <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
//                   Posted: {new Date(circular.created_at).toLocaleDateString()}
//                 </div>
//               </div>
//               <span className="badge badge-info">{circular.target_audience}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default MentorDashboard;
import React, { useState, useContext, useEffect, useCallback } from 'react';
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
  TrendingUp,
  MessageCircle,
  X,
  ClipboardList,
  ChartBar,
  Gauge
} from 'lucide-react';
import ChatComponent from '../components/ChatComponent';

// --- Reusable Modal Component ---
function Modal({ title, children, isOpen, onClose, size = 'lg' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white p-6 rounded-xl shadow-2xl w-full ${sizeClasses[size]}`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// --- Student Detail Modal Component ---
function StudentDetailModal({ isOpen, onClose, studentId }) {
  const { token, API, user } = useContext(AppContext);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [marksRecords, setMarksRecords] = useState([]);
  const [feedbackRecords, setFeedbackRecords] = useState([]);
  const [ratingData, setRatingData] = useState({});

  // Rating State
  const [newRating, setNewRating] = useState({
    attendance_rating: 0,
    marks_rating: 0,
    overall_rating: 0,
  });
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const fetchData = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const [
        userRes,
        attendanceRes,
        marksRes,
        feedbackRes,
        ratingRes,
      ] = await Promise.all([
        axios.get(`${API}/users/${studentId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/attendance/student/${studentId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/marks/student/${studentId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/feedback/student/${studentId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/ratings/student/${studentId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setStudentData(userRes.data);
      setAttendanceRecords(attendanceRes.data);
      setMarksRecords(marksRes.data);
      setFeedbackRecords(feedbackRes.data);
      setRatingData(ratingRes.data);
      setNewRating(prev => ({
        ...prev,
        attendance_rating: ratingRes.data.attendance_rating || 0,
        marks_rating: ratingRes.data.marks_rating || 0,
        overall_rating: ratingRes.data.overall_rating || 0,
      }));
    } catch (error) {
      toast.error('Failed to fetch student details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [studentId, token, API]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    } else {
      // Reset state when closing
      setStudentData(null);
      setLoading(true);
      setActiveTab('summary');
    }
  }, [isOpen, fetchData]);

  // Calculate Attendance Percentage
  const totalAttendance = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const attendancePercentage = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(1) : 0;
  const attendanceColor = attendancePercentage >= 80 ? '#10b981' : attendancePercentage >= 65 ? '#f59e0b' : '#ef4444';

  // Calculate Marks Summary
  const totalMaxMarks = marksRecords.reduce((sum, r) => sum + r.max_marks, 0);
  const totalObtainedMarks = marksRecords.reduce((sum, r) => sum + r.marks_obtained, 0);
  const marksPercentage = totalMaxMarks > 0 ? ((totalObtainedMarks / totalMaxMarks) * 100).toFixed(1) : 0;
  const marksColor = marksPercentage >= 70 ? '#10b981' : marksPercentage >= 50 ? '#f59e0b' : '#ef4444';

  const handleRatingChange = (name, value) => {
    const rating = Math.max(0, Math.min(5, parseInt(value, 10) || 0));
    setNewRating(prev => ({ ...prev, [name]: rating }));
  };

  const handleRatingSubmit = async () => {
    if (isSubmittingRating || !studentId) return;
    setIsSubmittingRating(true);

    const payload = {
      student_id: studentId,
      mentor_id: user.id,
      ...newRating
    };

    try {
      const response = await axios.post(`${API}/ratings`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Performance rating submitted successfully!');
      setRatingData(response.data);
    } catch (error) {
      toast.error('Failed to submit rating.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (loading) {
    return <Modal isOpen={isOpen} onClose={onClose} title="Loading Student Details">
      <div className="text-center p-8 text-gray-500">Fetching data...</div>
    </Modal>;
  }

  const renderAttendanceTable = () => (
    <div className="table-container max-h-96 overflow-y-auto">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Recorded By</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.length === 0 ? (
            <tr><td colSpan="4" className="text-center text-gray-500">No attendance records found.</td></tr>
          ) : (
            attendanceRecords.map((r, index) => (
              <tr key={r.id || index}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.subject}</td>
                <td><span className={`badge ${r.status === 'present' ? 'badge-success' : r.status === 'absent' ? 'badge-danger' : 'badge-info'}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
                <td>{r.recorded_by}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderMarksTable = () => (
    <div className="table-container max-h-96 overflow-y-auto">
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Semester</th>
            <th>Type</th>
            <th>Marks</th>
            <th>Max Marks</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {marksRecords.length === 0 ? (
            <tr><td colSpan="6" className="text-center text-gray-500">No marks records found.</td></tr>
          ) : (
            marksRecords.map((r, index) => (
              <tr key={r.id || index}>
                <td>{r.subject}</td>
                <td>{r.semester}</td>
                <td>{r.marks_type}</td>
                <td>{r.marks_obtained}</td>
                <td>{r.max_marks}</td>
                <td>{((r.marks_obtained / r.max_marks) * 100).toFixed(1)}%</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderFeedbackSection = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold border-b pb-2">Recorded Feedback</h4>
      {feedbackRecords.length === 0 ? (
        <p className="text-gray-500">No past feedback recorded for this student by any mentor.</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {feedbackRecords.map((f) => (
            <div key={f.id} className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm italic">{f.feedback_text}</p>
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>Mentor ID: {f.mentor_id.substring(0, 8)}...</span>
                <span>{new Date(f.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <h4 className="text-lg font-semibold border-b pb-2 pt-4">Rate Performance (1-5 Scale)</h4>
      <div className="grid grid-cols-3 gap-4">
        {['attendance_rating', 'marks_rating', 'overall_rating'].map(field => (
          <div className="form-group" key={field}>
            <label className="form-label capitalize">{field.replace('_', ' ')}</label>
            <input
              type="number"
              min="0"
              max="5"
              className="form-input"
              name={field}
              value={newRating[field]}
              onChange={(e) => handleRatingChange(field, e.target.value)}
              required
            />
            <div className="text-xs text-gray-500 mt-1">Current Stored: {ratingData[field] || 'N/A'}</div>
          </div>
        ))}
      </div>
      <button 
        onClick={handleRatingSubmit} 
        className="btn btn-primary" 
        disabled={isSubmittingRating}
      >
        {isSubmittingRating ? 'Submitting...' : 'Submit/Update Rating'}
      </button>

      <p className="text-xs text-red-500 pt-2">Note: Submitting a new rating will overwrite the previous rating for this student by any mentor.</p>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Student Details: ${studentData.full_name}`} 
      size="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 border-l-4 border-indigo-500 bg-indigo-50 col-span-1 md:col-span-2">
          <h5 className="font-semibold text-gray-700">Student Info</h5>
          <p className="text-sm mt-1">**USN:** {studentData.usn}</p>
          <p className="text-sm">**Email:** {studentData.email}</p>
          <p className="text-sm">**Dept:** {studentData.department}</p>
          <p className="text-sm">**Semester:** {studentData.semester}</p>
        </div>

        <div className="card p-4 border-l-4 border-green-500 bg-green-50">
          <h5 className="font-semibold text-gray-700 flex items-center gap-2"><ClipboardList size={16} /> Attendance</h5>
          <div className="text-2xl font-bold mt-1" style={{ color: attendanceColor }}>{attendancePercentage}%</div>
          <p className="text-xs text-gray-500">{presentCount} / {totalAttendance} Days Present</p>
        </div>
        <div className="card p-4 border-l-4 border-yellow-500 bg-yellow-50">
          <h5 className="font-semibold text-gray-700 flex items-center gap-2"><TrendingUp size={16} /> Marks Average</h5>
          <div className="text-2xl font-bold mt-1" style={{ color: marksColor }}>{marksPercentage}%</div>
          <p className="text-xs text-gray-500">{totalObtainedMarks.toFixed(1)} / {totalMaxMarks.toFixed(1)} Total Marks</p>
        </div>
      </div>

      <div className="flex border-b mb-4">
        <button className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>
          <Gauge size={18} /> Performance Summary
        </button>
        <button className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
          <ClipboardList size={18} /> Attendance Records
        </button>
        <button className={`tab-button ${activeTab === 'marks' ? 'active' : ''}`} onClick={() => setActiveTab('marks')}>
          <ChartBar size={18} /> Marks Records
        </button>
        <button className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
          <MessageCircle size={18} /> Feedback & Rating
        </button>
      </div>

      <div className="tab-content p-2">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-4">
              <h4 className="text-lg font-semibold border-b pb-2 mb-3">Overall Performance Rating</h4>
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">{ratingData.overall_rating || 0}/5</div>
              <p className="text-sm text-gray-600">This rating reflects the mentor's holistic view of the student's progress and attitude.</p>
              <p className="text-xs text-gray-500 mt-2">Last updated by Mentor ID: {ratingData.mentor_id ? `${ratingData.mentor_id.substring(0, 8)}...` : 'N/A'}</p>
            </div>
            <div className="card p-4">
              <h4 className="text-lg font-semibold border-b pb-2 mb-3">Latest Feedback</h4>
              <div className="max-h-32 overflow-y-auto">
                {feedbackRecords.length > 0 ? (
                  <p className="italic text-gray-700">"{feedbackRecords[feedbackRecords.length - 1].feedback_text}"</p>
                ) : (
                  <p className="text-gray-500">No recent feedback available.</p>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'attendance' && renderAttendanceTable()}
        {activeTab === 'marks' && renderMarksTable()}
        {activeTab === 'feedback' && renderFeedbackSection()}
      </div>
    </Modal>
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
      <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #1e40af, #1e3a8a)', color: 'white' }}>
          <div className="stat-label text-center ">Assigned Students</div>
          <div className="stat-value text-center" data-testid="assigned-students">{stats?.assigned_students || 0}</div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: 'white' }}>
          <div className="stat-label text-center">Feedback Given</div>
          <div className="stat-value text-center" data-testid="total-feedback">{stats?.total_feedback || 0}</div>
        </div>
        <div className="card stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>
          <div className="stat-label text-center">Active Sessions</div>
          <div className="stat-value text-center">0</div>
        </div>
      </div>

      <div className="card p-6">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>Recent Students</h3>
        <div className="grid grid-cols-1">
          {students.length === 0 ? (
            <div className="text-center p-4 text-gray-500">No students currently assigned.</div>
          ) : (
            students.slice(0, 5).map((student) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function MyStudents() {
  const { token, API, user } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
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

  const handleViewDetails = (studentId) => {
    setSelectedStudentId(studentId);
    setShowDetailModal(true);
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading Assigned Students...</div>;

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
            {students.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-gray-500">No students are currently assigned to you.</td></tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} data-testid={`student-row-${student.id}`}>
                  <td>{student.full_name}</td>
                  <td>{student.usn || 'N/A'}</td>
                  <td>{student.email}</td>
                  <td>{student.department || 'N/A'}</td>
                  <td>{student.semester || 'N/A'}</td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => handleViewDetails(student.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <StudentDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        studentId={selectedStudentId}
      />
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
      <div className="card mb-4 p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <button type="submit" className="btn btn-primary mt-4" data-testid="submit-attendance-button">
              Record Attendance
            </button>
          </form>
        ) : (
          <div className="space-y-4">
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
          'Content-Type': 'multipart/form-form'
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
      <div className="card mb-4 p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <button type="submit" className="btn btn-primary mt-4">
              Record Marks
            </button>
          </form>
        ) : (
          <div className="space-y-4">
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
    <div className="card p-6">
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Provide General Feedback</h3>
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
            <option value="">--- Choose a student ---</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name} ({student.usn})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Feedback Text</label>
          <textarea
            className="form-input"
            rows="6"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            required
            placeholder="Enter your feedback here (e.g., areas of improvement, strengths)..."
            data-testid="feedback-textarea"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" data-testid="submit-feedback-button">
          <Star size={18} /> Submit Feedback
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 pt-4 border-t">
        **Note on Ratings:** To submit or update Attendance, Marks, or Overall Performance Ratings (1-5 scale), please go to the "My Students" tab and click "View Details" for the student. The rating form is located in the "Feedback & Rating" section of the student profile.
      </p>
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
      toast.error(error.response?.data?.detail || 'Failed to post circular');
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
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Post New Circular"
          size="lg"
        >
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
            <div className="flex justify-end space-x-4 mt-4">
              <button type="submit" className="btn btn-primary">
                <Bell size={18} /> Post Circular
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {circulars.map((circular) => (
          <div key={circular.id} className="card p-5">
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                  {circular.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
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

function MentorDashboard() {
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
    { id: 'students', label: 'My Students', icon: Users, path: '/students' },
    { id: 'attendance', label: 'Attendance', icon: FileText, path: '/attendance' },
    { id: 'marks', label: 'Marks', icon: TrendingUp, path: '/marks' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/feedback' },
    { id: 'circulars', label: 'Circulars', icon: Bell, path: '/circulars' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, path: '/messages' },
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
            >
              <item.icon size={20} />
              {item.label}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button
            className="btn btn-outline w-full"
            onClick={logout}
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
              <div className="user-avatar">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
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
            <Route path="/circulars" element={<Circulars />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;