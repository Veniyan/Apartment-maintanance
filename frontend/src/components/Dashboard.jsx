import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [user, setUser] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/');
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleNavClick = (section) => {
        setActiveSection(section);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Requests</h3>
                            <div className="value">24</div>
                        </div>
                        <div className="stat-card">
                            <h3>Pending</h3>
                            <div className="value">8</div>
                        </div>
                        <div className="stat-card">
                            <h3>Completed</h3>
                            <div className="value">16</div>
                        </div>
                        <div className="stat-card">
                            <h3>Residents</h3>
                            <div className="value">42</div>
                        </div>
                    </div>
                );
            case 'maintenance':
                return (
                    <div className="content-section">
                        <h2>Maintenance Requests</h2>
                        <p>View and manage maintenance requests here.</p>
                    </div>
                );
            case 'residents':
                return (
                    <div className="content-section">
                        <h2>Residents</h2>
                        <p>Manage resident information here.</p>
                    </div>
                );
            case 'messages':
                return (
                    <div className="content-section">
                        <h2>Messages</h2>
                        <p>View and send messages here.</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="content-section">
                        <h2>Settings</h2>
                        <p>Manage your account settings here.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const getSectionTitle = () => {
        switch (activeSection) {
            case 'dashboard':
                return 'Dashboard';
            case 'maintenance':
                return 'Maintenance Requests';
            case 'residents':
                return 'Residents';
            case 'messages':
                return 'Messages';
            case 'settings':
                return 'Settings';
            default:
                return 'Dashboard';
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
                                onClick={() => handleNavClick('maintenance')}
                                className={`nav-link ${activeSection === 'maintenance' ? 'active' : ''}`}
                            >
                                Maintenance Requests
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={() => handleNavClick('residents')}
                                className={`nav-link ${activeSection === 'residents' ? 'active' : ''}`}
                            >
                                Residents
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
                                onClick={() => handleNavClick('settings')}
                                className={`nav-link ${activeSection === 'settings' ? 'active' : ''}`}
                            >
                                Settings
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

export default Dashboard;
