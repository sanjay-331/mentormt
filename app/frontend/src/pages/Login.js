import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

function Login() {
  const { login, API } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(
          `${API}/auth/login?email=${formData.email}&password=${formData.password}`
        );
        login(response.data.access_token, response.data.user);
        toast.success('Welcome back!');
      } else {
        const response = await axios.post(`${API}/auth/register`, formData);
        login(response.data.access_token, response.data.user);
        toast.success('Account created successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-branding">
          <GraduationCap size={48} />
          <h1>Student Mentor-Mentee System</h1>
          <p>Empowering education through effective mentorship and guidance</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-box" data-testid="login-box">
          <div className="login-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to your account' : 'Join our mentoring platform'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="form-input"
                    data-testid="full-name-input"
                    required={!isLogin}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select"
                    data-testid="role-select"
                    required={!isLogin}
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                data-testid="email-input"
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                data-testid="password-input"
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              data-testid="submit-button"
              disabled={loading}
            >
              {loading ? (
                <span>Processing...</span>
              ) : isLogin ? (
                <><LogIn size={18} /> Sign In</>
              ) : (
                <><UserPlus size={18} /> Sign Up</>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-auth"
                data-testid="toggle-auth-button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          min-height: 100vh;
        }

        .login-left {
          flex: 1;
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: white;
        }

        .login-branding {
          max-width: 500px;
          text-align: center;
        }

        .login-branding svg {
          margin-bottom: 1.5rem;
        }

        .login-branding h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .login-branding p {
          font-size: 1.125rem;
          opacity: 0.9;
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #f8fafc;
        }

        .login-box {
          width: 100%;
          max-width: 440px;
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .login-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .login-header h2 {
          font-size: 1.875rem;
          margin-bottom: 0.5rem;
          color: #1e293b;
        }

        .login-header p {
          color: #64748b;
          font-size: 0.875rem;
        }

        .login-form {
          margin-bottom: 1.5rem;
        }

        .w-full {
          width: 100%;
        }

        .login-footer {
          text-align: center;
          font-size: 0.875rem;
          color: #64748b;
        }

        .toggle-auth {
          background: none;
          border: none;
          color: #1e40af;
          font-weight: 600;
          cursor: pointer;
          margin-left: 0.5rem;
          transition: color 0.2s;
        }

        .toggle-auth:hover {
          color: #1e3a8a;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .login-left {
            display: none;
          }
          .login-right {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
