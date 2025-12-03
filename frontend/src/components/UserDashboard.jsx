import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const [user, setUser] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [requests, setRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({ title: '', description: '', priority: 'LOW' });
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [payments, setPayments] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(''); // Empty string means "All Months"
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (!storedUser || storedRole !== 'USER') {
            navigate('/');
        } else {
            setUser(storedUser);
            fetchRequests(storedUser);
        }
    }, [navigate]);

    const fetchRequests = async (username) => {
        try {
            const response = await fetch(`http://localhost:8081/api/maintenance/user/${username}`);
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/chat/history/${user}/admin`);
            if (response.ok) {
                setChatMessages(await response.json());
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const calculatePaymentSummary = () => {
        const totalBilled = payments.reduce((sum, p) => sum + p.amount, 0);
        const totalPaid = payments.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0);
        const isFullyPaid = totalBilled > 0 && totalBilled === totalPaid;

        return { totalBilled, totalPaid, isFullyPaid };
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/');
    };

    const handleNavClick = (section) => {
        setActiveSection(section);
        setMessage('');
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8081/api/maintenance?username=${user}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRequest),
            });

            if (response.ok) {
                setMessage('Request submitted successfully!');
                setNewRequest({ title: '', description: '', priority: 'LOW' });
                fetchRequests(user);
                setTimeout(() => {
                    setMessage('');
                    setActiveSection('requests');
                }, 1500);
            } else {
                setMessage('Failed to submit request.');
            }
        } catch (error) {
            setMessage('Error submitting request.');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile)) return;

        try {
            let fileData = null;

            // Upload file if selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const uploadResponse = await fetch('http://localhost:8081/api/files/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadResponse.ok) {
                    fileData = await uploadResponse.json();
                } else {
                    alert('Failed to upload file');
                    return;
                }
            }

            // Send message with or without file
            const messageData = {
                content: newMessage.trim() || (fileData ? `Sent a file: ${fileData.fileName}` : ''),
                ...(fileData && {
                    fileUrl: fileData.fileUrl,
                    fileName: fileData.fileName,
                    fileType: fileData.fileType,
                    fileSize: fileData.fileSize
                })
            };

            const response = await fetch(`http://localhost:8081/api/chat/send?senderUsername=${user}&recipientUsername=admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });

            if (response.ok) {
                setNewMessage('');
                setSelectedFile(null);
                fetchChatHistory();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10MB limit');
                return;
            }
            setSelectedFile(file);
        }
    };

    useEffect(() => {
        if (activeSection === 'messages') {
            fetchChatHistory();
            const interval = setInterval(fetchChatHistory, 5000); // Poll every 5 seconds
            return () => clearInterval(interval);
        } else if (activeSection === 'payments') {
            fetchPayments();
        }
    }, [activeSection, user]);

    const getStats = () => {
        const total = requests.length;
        const pending = requests.filter(r => r.status === 'PENDING').length;
        const completed = requests.filter(r => r.status === 'COMPLETED').length;
        const inProgress = requests.filter(r => r.status === 'IN_PROGRESS').length;
        return { total, pending, completed, inProgress };
    };

    const stats = getStats();

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>My Requests</h3>
                            <div className="value">{stats.total}</div>
                        </div>
                        <div className="stat-card">
                            <h3>Pending</h3>
                            <div className="value">{stats.pending}</div>
                        </div>
                        <div className="stat-card">
                            <h3>In Progress</h3>
                            <div className="value">{stats.inProgress}</div>
                        </div>
                        <div className="stat-card">
                            <h3>Completed</h3>
                            <div className="value">{stats.completed}</div>
                        </div>
                    </div>
                );
            case 'requests':
                return (
                    <div className="content-section">
                        <h2>My Maintenance Requests</h2>
                        {requests.length === 0 ? (
                            <p>No requests found.</p>
                        ) : (
                            <div className="requests-list">
                                {requests.map(request => (
                                    <div key={request.id} className="request-card">
                                        <div className="request-header">
                                            <h3>{request.title}</h3>
                                            <span className={`status-badge ${request.status.toLowerCase()}`}>{request.status}</span>
                                        </div>
                                        <p>{request.description}</p>
                                        <div className="request-footer">
                                            <span className={`priority-badge ${request.priority.toLowerCase()}`}>{request.priority} Priority</span>
                                            <span className="date">{new Date(request.requestDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'new-request':
                return (
                    <div className="content-section">
                        <h2>Submit New Request</h2>
                        {message && <div className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</div>}
                        <form onSubmit={handleRequestSubmit} className="request-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={newRequest.title}
                                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newRequest.description}
                                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                                    required
                                    rows="4"
                                />
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    value={newRequest.priority}
                                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Request</button>
                        </form>
                    </div>
                );
            case 'messages':
                return (
                    <div className="content-section">
                        <h2>Messages with Admin</h2>
                        <div className="chat-container">
                            <div className="messages-list">
                                {chatMessages.length === 0 ? (
                                    <p className="no-messages">No messages yet. Start a conversation!</p>
                                ) : (
                                    chatMessages.map(msg => (
                                        <div key={msg.id} className={`message ${msg.sender.username === user ? 'sent' : 'received'}`}>
                                            <div className="message-content">{msg.content}</div>
                                            {msg.fileUrl && (
                                                <div className="message-attachment">
                                                    {msg.fileType && msg.fileType.startsWith('image/') ? (
                                                        <img
                                                            src={`http://localhost:8081${msg.fileUrl}`}
                                                            alt={msg.fileName}
                                                            className="message-image"
                                                        />
                                                    ) : (
                                                        <a
                                                            href={`http://localhost:8081${msg.fileUrl}`}
                                                            download={msg.fileName}
                                                            className="file-download-link"
                                                        >
                                                            📎 {msg.fileName} ({(msg.fileSize / 1024).toFixed(2)} KB)
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                            <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <form onSubmit={handleSendMessage} className="chat-input-form">
                                <input
                                    type="file"
                                    id="file-input-user"
                                    onChange={handleFileSelect}
                                    accept="image/*,.pdf,.doc,.docx"
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="file-input-user" className="file-attach-btn" title="Attach file">
                                    📎
                                </label>
                                {selectedFile && (
                                    <span className="selected-file-name">
                                        {selectedFile.name}
                                        <button
                                            type="button"
                                            onClick={() => setSelectedFile(null)}
                                            className="remove-file-btn"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                <input
                                    id="chat-input"
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <button id="chat-send-btn" type="submit" className="btn btn-primary">Send</button>
                            </form>
                        </div>
                    </div>
                );
            case 'payments':
                const summary = calculatePaymentSummary();
                return (
                    <div className="content-section">
                        <h2>Maintenance Payments</h2>

                        <div className="payment-controls">
                            <div className="month-selector">
                                <label>Select Month: </label>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="form-control"
                                />
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedMonth('')}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Show All
                                </button>
                            </div>
                        </div>

                        {selectedMonth && (
                            <div className="payment-summary-cards">
                                <div className="stat-card">
                                    <h3>Total Billed</h3>
                                    <div className="value">₹{summary.totalBilled}</div>
                                </div>
                                <div className="stat-card">
                                    <h3>Total Paid</h3>
                                    <div className="value">₹{summary.totalPaid}</div>
                                </div>
                                <div className="stat-card">
                                    <h3>Status</h3>
                                    <div className={`value ${summary.isFullyPaid ? 'text-success' : 'text-warning'}`}>
                                        {summary.isFullyPaid ? 'Fully Paid' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Payment Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center' }}>No payments found for this period.</td>
                                        </tr>
                                    ) : (
                                        payments.map(payment => (
                                            <tr key={payment.id}>
                                                <td>{payment.month}</td>
                                                <td>₹{payment.amount}</td>
                                                <td>
                                                    <span className={`status-badge ${payment.isPaid ? 'completed' : 'pending'}`}>
                                                        {payment.isPaid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </td>
                                                <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="content-section">
                        <h2>My Profile</h2>
                        <div className="profile-info">
                            <p><strong>Username:</strong> {user}</p>
                            <p><strong>Role:</strong> User</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const getSectionTitle = () => {
        switch (activeSection) {
            case 'dashboard': return 'Dashboard';
            case 'requests': return 'My Requests';
            case 'new-request': return 'New Request';
            case 'messages': return 'Messages';
            case 'payments': return 'Payments';
            case 'profile': return 'My Profile';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Apartment App</h2>
                </div>
                <nav>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <button
                                onClick={() => handleNavClick('dashboard')}
                                className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                            >
                                Dashboard
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={() => handleNavClick('requests')}
                                className={`nav-link ${activeSection === 'requests' ? 'active' : ''}`}
                            >
                                My Requests
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={() => handleNavClick('new-request')}
                                className={`nav-link ${activeSection === 'new-request' ? 'active' : ''}`}
                            >
                                New Request
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={() => handleNavClick('messages')}
                                className={`nav-link ${activeSection === 'messages' ? 'active' : ''}`}
                            >
                                Messages
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={() => handleNavClick('payments')}
                                className={`nav-link ${activeSection === 'payments' ? 'active' : ''}`}
                            >
                                Payments
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={() => handleNavClick('profile')}
                                className={`nav-link ${activeSection === 'profile' ? 'active' : ''}`}
                            >
                                My Profile
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <div className="dashboard-header">
                    <h1>{getSectionTitle()}</h1>
                    <div className="user-info">
                        <div className="user-avatar">
                            {user.charAt(0).toUpperCase()}
                        </div>
                        <span>{user}</span>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                {renderContent()}
            </main>
        </div>
    );
}

export default UserDashboard;
