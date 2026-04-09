import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, isAuthenticated, logout } from '../utils/api';

function AdminDashboard() {
    const [user] = useState(() => localStorage.getItem('user') || '');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [allRequests, setAllRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedChatUser, setSelectedChatUser] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [payments, setPayments] = useState([]);
    const [newPayment, setNewPayment] = useState({ username: '', month: '', amount: '' });
    const [newUser, setNewUser] = useState({ username: '', email: '', role: 'USER' });

    // Expense Tracker State
    // Expense Tracker State
    const [expenses, setExpenses] = useState([]);
    const [allExpenses, setAllExpenses] = useState([]);
    const [expenseMonth, setExpenseMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: '', category: 'Maintenance' });

    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const [requestsRes, usersRes] = await Promise.all([
                api.get('/maintenance'),
                api.get('/users')
            ]);

            if (requestsRes.ok) {
                setAllRequests(await requestsRes.json());
            }
            if (usersRes.ok) {
                setUsers(await usersRes.json());
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    const fetchChatHistory = useCallback(async (targetUser) => {
        if (!targetUser || !user) return;

        try {
            const response = await api.get(`/chat/history/${user}/${targetUser}`);
            if (response.ok) {
                setChatMessages(await response.json());
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    }, [user]);

    const fetchPayments = useCallback(async () => {
        try {
            const response = await api.get('/payments');
            if (response.ok) {
                setPayments(await response.json());
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    }, []);

    const fetchExpenses = useCallback(async () => {
        if (!expenseMonth) return;

        const [year, month] = expenseMonth.split('-');
        try {
            const response = await api.get(`/expenses/month/${year}/${month}`);
            if (response.ok) {
                setExpenses(await response.json());
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }, [expenseMonth]);

    const fetchAllExpenses = useCallback(async () => {
        try {
            const response = await api.get('/expenses');
            if (response.ok) {
                setAllExpenses(await response.json());
            }
        } catch (error) {
            console.error('Error fetching all expenses:', error);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (!isAuthenticated() || !storedUser || storedRole !== 'ADMIN') {
            navigate('/');
        } else {
            const timeoutId = setTimeout(() => {
                fetchData();
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [fetchData, navigate]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/expenses', newExpense);
            if (response.ok) {
                setNewExpense({ description: '', amount: '', date: '', category: 'Maintenance' });
                fetchExpenses();
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users', newUser);

            const result = await response.json();

            if (response.ok) {
                alert(`User created successfully!\nUsername: ${result.username}\nDefault password: ${result.defaultPassword}`);
                setNewUser({ username: '', email: '', role: 'USER' });
                await fetchData();
            } else {
                alert(`Failed to create user: ${result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user');
        }
    };

    useEffect(() => {
        if (activeSection === 'expenses') {
            const timeoutId = setTimeout(() => {
                fetchExpenses();
                fetchAllExpenses();
                fetchPayments(); // Ensure we have payments for income calculation
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [activeSection, fetchAllExpenses, fetchExpenses, fetchPayments]);

    const handleLogout = () => {
        logout();
    };

    const handleNavClick = (section) => {
        setActiveSection(section);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await api.put(`/maintenance/${id}/status`, { status: newStatus });

            if (response.ok) {
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !selectedChatUser) return;

        try {
            let fileData = null;

            // Upload file if selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const uploadResponse = await api.postFile('/files/upload', formData);

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

            const response = await api.post(`/chat/send?senderUsername=${user}&recipientUsername=${selectedChatUser}`, messageData);

            if (response.ok) {
                setNewMessage('');
                setSelectedFile(null);
                fetchChatHistory(selectedChatUser);
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

    const handlePaymentStatusUpdate = async (paymentId, isPaid) => {
        try {
            const response = await api.put(`/payments/${paymentId}/status`, {
                isPaid: isPaid,
                paymentDate: isPaid ? new Date().toISOString().split('T')[0] : null
            });

            if (response.ok) {
                fetchPayments();
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        console.log('Creating payment with:', newPayment);

        try {
            const currentDate = new Date();
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const paymentData = {
                month: newPayment.month,
                amount: parseFloat(newPayment.amount),
                isPaid: false,
                dueDate: lastDayOfMonth.toISOString().split('T')[0]
            };

            console.log('Sending payment data:', paymentData);
            console.log('URL:', `http://localhost:8081/api/payments?username=${newPayment.username}`);

            const response = await api.post(`/payments?username=${newPayment.username}`, paymentData);

            console.log('Response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Payment created successfully:', result);
                alert('Payment created successfully!');
                setNewPayment({ username: '', month: '', amount: '' });
                fetchPayments();
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert(`Failed to create payment: ${errorText}`);
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleDeletePayment = async (paymentId) => {
        if (!window.confirm('Are you sure you want to delete this payment record?')) {
            return;
        }

        try {
            const response = await api.delete(`/payments/${paymentId}`);

            if (response.ok) {
                alert('Payment deleted successfully!');
                fetchPayments();
            } else {
                const errorText = await response.text();
                alert(`Failed to delete payment: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
            alert(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        if (activeSection === 'messages' && selectedChatUser) {
            const timeoutId = setTimeout(() => {
                fetchChatHistory(selectedChatUser);
            }, 0);
            const interval = setInterval(() => fetchChatHistory(selectedChatUser), 5000);
            return () => {
                clearTimeout(timeoutId);
                clearInterval(interval);
            };
        } else if (activeSection === 'payments') {
            const timeoutId = setTimeout(() => {
                fetchPayments();
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [activeSection, fetchChatHistory, fetchPayments, selectedChatUser]);

    const getStats = () => {
        const totalUsers = users.length;
        const totalRequests = allRequests.length;
        const pendingRequests = allRequests.filter(r => r.status === 'PENDING').length;
        const completedToday = allRequests.filter(r =>
            r.status === 'COMPLETED' &&
            new Date(r.requestDate).toDateString() === new Date().toDateString()
        ).length;
        return { totalUsers, totalRequests, pendingRequests, completedToday };
    };


    const stats = getStats();

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Users</h3>
                            <div className="value">{stats.totalUsers}</div>
                        </div>
                        <div className="stat-card">
                            <h3>Total Requests</h3>
                            <div className="value">{stats.totalRequests}</div>
                        </div>
                        <div className="stat-card">
                            <h3>Pending Requests</h3>
                            <div className="value">{stats.pendingRequests}</div>
                        </div>
                        <div className="stat-card">
                            <h3>Completed Today</h3>
                            <div className="value">{stats.completedToday}</div>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className="content-section">
                        <h2>User Management</h2>

                        <div className="form-section">
                            <h3>Add New User</h3>
                            <form onSubmit={handleAddUser} className="payment-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            value={newUser.username}
                                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>Add User</button>
                                    </div>
                                </div>
                                <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
                                    New users are created with the default password <strong>welcome123</strong>.
                                </p>
                            </form>
                        </div>

                        <div className="table-container" style={{ marginTop: '30px' }}>
                            <h3>Current Users</h3>

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.username}</td>
                                            <td>{u.email}</td>
                                            <td><span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                                            <td>
                                                {u.role !== 'ADMIN' && (
                                                    <button
                                                        className="btn-small"
                                                        onClick={() => {
                                                            setSelectedChatUser(u.username);
                                                            setActiveSection('messages');
                                                        }}
                                                    >
                                                        Message
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'requests':
                return (
                    <div className="content-section">
                        <h2>All Maintenance Requests</h2>
                        <div className="requests-list">
                            {allRequests.map(request => (
                                <div key={request.id} className="request-card">
                                    <div className="request-header">
                                        <div>
                                            <h3>{request.title}</h3>
                                            <small>Requested by: {request.user?.username}</small>
                                        </div>
                                        <select
                                            value={request.status}
                                            onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                                            className={`status-select ${request.status.toLowerCase()}`}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>
                                    <p>{request.description}</p>
                                    <div className="request-footer">
                                        <span className={`priority-badge ${request.priority.toLowerCase()}`}>{request.priority} Priority</span>
                                        <span className="date">{new Date(request.requestDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'messages':
                return (
                    <div className="content-section">
                        <h2>Messages</h2>
                        <div className="chat-layout">
                            <div className="chat-users-list">
                                <h3>Users</h3>
                                {users.filter(u => u.role !== 'ADMIN').map(u => (
                                    <div
                                        key={u.id}
                                        className={`chat-user-item ${selectedChatUser === u.username ? 'active' : ''}`}
                                        onClick={() => setSelectedChatUser(u.username)}
                                    >
                                        <div className="user-avatar small">{u.username.charAt(0).toUpperCase()}</div>
                                        <span>{u.username}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-main">
                                {selectedChatUser ? (
                                    <>
                                        <div className="chat-header">
                                            <h3>Chat with {selectedChatUser}</h3>
                                        </div>
                                        <div className="messages-list">
                                            {chatMessages.length === 0 ? (
                                                <p className="no-messages">No messages yet.</p>
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
                                                id="file-input"
                                                onChange={handleFileSelect}
                                                accept="image/*,.pdf,.doc,.docx"
                                                style={{ display: 'none' }}
                                            />
                                            <label htmlFor="file-input" className="file-attach-btn" title="Attach file">
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
                                    </>
                                ) : (
                                    <div className="no-chat-selected">
                                        <p>Select a user to start chatting</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'reports':
                return (
                    <div className="content-section">
                        <h2>Reports & Analytics</h2>
                        <p>View system reports and analytics.</p>
                    </div>
                );
            case 'payments':
                return (
                    <div className="content-section">
                        <h2>Maintenance Payments</h2>

                        <div className="form-section">
                            <h3>Create Payment Record</h3>
                            <form onSubmit={handleCreatePayment} className="payment-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <select
                                            value={newPayment.username}
                                            onChange={(e) => setNewPayment({ ...newPayment, username: e.target.value })}
                                            required
                                        >
                                            <option value="">Select User</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.username}>{u.username}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Billing Month</label>
                                        <input
                                            type="month"
                                            value={newPayment.month}
                                            onChange={(e) => setNewPayment({ ...newPayment, month: e.target.value })}
                                            required
                                        />
                                        <small style={{ color: 'var(--text-secondary)' }}>
                                            Choose the month and year from the picker.
                                        </small>
                                    </div>
                                    <div className="form-group">
                                        <label>Amount (₹)</label>
                                        <input
                                            type="number"
                                            value={newPayment.amount}
                                            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>Create Payment</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="table-container" style={{ marginTop: '30px' }}>
                            <h3>Payment Records</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Month</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(payment => (
                                        <tr key={payment.id}>
                                            <td>{payment.user?.username}</td>
                                            <td>{payment.month}</td>
                                            <td>₹{payment.amount}</td>
                                            <td onClick={() => handlePaymentStatusUpdate(payment.id, !payment.isPaid)} style={{ cursor: 'pointer' }}>
                                                <span className={`status-badge ${payment.isPaid ? 'completed' : 'pending'}`}>
                                                    {payment.isPaid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-small btn-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeletePayment(payment.id);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="content-section">
                        <h2>System Settings</h2>
                        <p>Configure system-wide settings and preferences.</p>
                    </div>
                );
            case 'expenses': {
                // Calculate Income from Payments
                const filteredPayments = payments.filter(p => p.month === expenseMonth && p.isPaid);
                const totalIncome = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

                // Calculate Expenses
                const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

                const netBalance = totalIncome - totalExpense;

                return (
                    <div className="content-section">
                        <div className="payment-controls">
                            <div className="month-selector">
                                <label>Select Month: </label>
                                <input
                                    type="month"
                                    value={expenseMonth}
                                    onChange={(e) => setExpenseMonth(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="payment-summary-cards">
                            <div className="stat-card">
                                <h3>Total Income</h3>
                                <div className="value text-success">₹{totalIncome}</div>
                            </div>
                            <div className="stat-card">
                                <h3>Total Expense</h3>
                                <div className="value text-warning">₹{totalExpense}</div>
                            </div>
                            <div className="stat-card">
                                <h3>Net Balance</h3>
                                <div className={`value ${netBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                                    ₹{netBalance}
                                </div>
                            </div>
                        </div>

                        <div className="expense-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="income-column">
                                <h3>Income (Maintenance)</h3>
                                <div className="table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPayments.length === 0 ? (
                                                <tr><td colSpan="3">No income recorded.</td></tr>
                                            ) : (
                                                filteredPayments.map(p => (
                                                    <tr key={p.id}>
                                                        <td>{p.user?.username}</td>
                                                        <td>₹{p.amount}</td>
                                                        <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="expense-column">
                                <h3>Expenses</h3>
                                <form onSubmit={handleAddExpense} className="add-expense-form" style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={newExpense.description}
                                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                        required
                                        className="form-control"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={newExpense.amount}
                                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        required
                                        className="form-control"
                                        style={{ width: '100px' }}
                                    />
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </form>

                                <div className="table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Description</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.length === 0 ? (
                                                <tr><td colSpan="2">No expenses recorded.</td></tr>
                                            ) : (
                                                expenses.map(e => (
                                                    <tr key={e.id}>
                                                        <td>{e.description}</td>
                                                        <td>₹{e.amount}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Total Lifetime Balance */}
                        <div className="total-balance-section" style={{ marginTop: '30px', padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                            <h3>Total Lifetime Balance</h3>
                            <div style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '15px' }}>
                                <span className={payments.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0) - allExpenses.reduce((sum, e) => sum + e.amount, 0) >= 0 ? 'text-success' : 'text-danger'}>
                                    ₹{payments.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0) - allExpenses.reduce((sum, e) => sum + e.amount, 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            }
            default:
                return null;
        }
    };

    const getSectionTitle = () => {
        switch (activeSection) {
            case 'dashboard': return 'Admin Dashboard';
            case 'users': return 'User Management';
            case 'requests': return 'All Maintenance Requests';
            case 'messages': return 'Messages';
            case 'payments': return 'Payments';
            case 'expenses': return 'Expense Tracker';


            default: return 'Admin Dashboard';
        }
    };

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
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
                                onClick={() => handleNavClick('users')}
                                className={`nav-link ${activeSection === 'users' ? 'active' : ''}`}
                            >
                                User Management
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={() => handleNavClick('requests')}
                                className={`nav-link ${activeSection === 'requests' ? 'active' : ''}`}
                            >
                                All Requests
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
                                onClick={() => handleNavClick('expenses')}
                                className={`nav-link ${activeSection === 'expenses' ? 'active' : ''}`}
                            >
                                Expense Tracker
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <div className="dashboard-header">
                    <h1>{getSectionTitle()}</h1>
                    <div className="user-info">
                        <div className="admin-badge">ADMIN</div>
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

export default AdminDashboard;
