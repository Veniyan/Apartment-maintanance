import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get('content-type') || '';
      const hasJsonBody = contentType.includes('application/json');
      const data = hasJsonBody ? await response.json() : null;

      if (response.ok) {
        if (!data?.token) {
          setError('Login failed: server did not return a valid login response.');
          return;
        }

        // Store JWT token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', data.role);

        // Redirect based on role
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        if (response.status === 403) {
          setError('Login is being blocked by the backend. Please restart the backend and try again.');
          return;
        }

        if (typeof data === 'string' && data.trim()) {
          setError(data);
        } else if (data?.message) {
          setError(data.message);
        } else {
          setError('Invalid credentials. Please try again.');
        }
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
      console.error('Login error:', err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: passwordForm.username,
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const text = await response.text();

      if (response.ok) {
        setPasswordMessage(text || 'Password updated successfully.');
        setPasswordForm({
          username: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setPasswordError(text || 'Unable to update password.');
      }
    } catch (err) {
      setPasswordError('Unable to connect to server. Please try again later.');
      console.error('Password change error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Apartment Maintenance</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </form>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: '12px', width: '100%' }}
          onClick={() => {
            setShowPasswordReset((value) => !value);
            setPasswordMessage('');
            setPasswordError('');
          }}
        >
          Forgot / Change Password
        </button>

        {showPasswordReset && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '12px' }}>Change Password</h3>
            {passwordMessage && <div className="success-message">{passwordMessage}</div>}
            {passwordError && <div className="error-message">{passwordError}</div>}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="reset-username">Username</label>
                <input
                  type="text"
                  id="reset-username"
                  value={passwordForm.username}
                  onChange={(e) => setPasswordForm({ ...passwordForm, username: e.target.value })}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="old-password">Old Password</label>
                <input
                  type="password"
                  id="old-password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter your new password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
