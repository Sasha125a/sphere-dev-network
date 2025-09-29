import React, { useState, useEffect } from 'react';
import './HomeScreen.css';

const HomeScreen = ({ onNavigate }) => {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        deployedProjects: 0
    });

    useEffect(() => {
        loadProjects();
        simulateStats();
    }, []);

    const loadProjects = () => {
        try {
            const savedProjects = JSON.parse(localStorage.getItem('sphereDevProjects') || '[]');
            setProjects(savedProjects.slice(0, 3));
        } catch (error) {
            console.error('Error loading projects:', error);
            setProjects([]);
        }
    };

    const simulateStats = () => {
        const savedProjects = JSON.parse(localStorage.getItem('sphereDevProjects') || '[]');
        setStats({
            totalProjects: savedProjects.length,
            activeProjects: savedProjects.filter(p => p.status === 'active').length,
            deployedProjects: savedProjects.filter(p => p.status === 'deployed').length
        });
    };

    const quickActions = [
        {
            title: '3D Sphere',
            description: 'Explore projects in virtual space',
            icon: '🌐',
            action: () => onNavigate('sphere'),
            color: '#00ffff'
        },
        {
            title: 'New Project',
            description: 'Create a new project',
            icon: '🚀',
            action: () => onNavigate('create-project'),
            color: '#ff6b6b'
        },
        {
            title: 'All Projects',
            description: 'View all your projects',
            icon: '📁',
            action: () => onNavigate('projects'),
            color: '#4ecdc4'
        },
        {
            title: 'Terminal',
            description: 'Command line interface',
            icon: '⌨️',
            action: () => onNavigate('terminal'),
            color: '#45b7d1'
        }
    ];

    return (
        <div className="home-screen">
            {/* Header */}
            <header className="home-header">
                <div className="header-content">
                    <h1>🌐 SphereDev Network</h1>
                    <p>Your Virtual Internet Development Environment</p>
                </div>
                <div className="user-info">
                    <div className="user-avatar">👨‍💻</div>
                    <span>Developer</span>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <h3>{stats.totalProjects}</h3>
                        <p>Total Projects</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-info">
                        <h3>{stats.activeProjects}</h3>
                        <p>Active</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🌍</div>
                    <div className="stat-info">
                        <h3>{stats.deployedProjects}</h3>
                        <p>Deployed</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-info">
                        <h3>100%</h3>
                        <p>Performance</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <section className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    {quickActions.map((action, index) => (
                        <div 
                            key={index}
                            className="action-card"
                            onClick={action.action}
                            style={{ '--accent-color': action.color }}
                        >
                            <div className="action-icon" style={{ backgroundColor: action.color }}>
                                {action.icon}
                            </div>
                            <div className="action-content">
                                <h3>{action.title}</h3>
                                <p>{action.description}</p>
                            </div>
                            <div className="action-arrow">→</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Projects */}
            <section className="recent-projects">
                <div className="section-header">
                    <h2>Recent Projects</h2>
                    <button 
                        className="view-all-btn"
                        onClick={() => onNavigate('projects')}
                    >
                        View All
                    </button>
                </div>
                
                {projects.length > 0 ? (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <div key={project.id} className="project-card">
                                <div className="project-header">
                                    <h3>{project.name}</h3>
                                    <span className={`project-status ${project.status || 'active'}`}>
                                        {project.status || 'Active'}
                                    </span>
                                </div>
                                <p className="project-description">
                                    {project.description || 'No description provided'}
                                </p>
                                <div className="project-meta">
                                    <span>Type: {project.type}</span>
                                    <span>Template: {project.template}</span>
                                </div>
                                <div className="project-actions">
                                    <button 
                                        className="btn-primary"
                                        onClick={() => console.log('Open project:', project.id)}
                                    >
                                        Open
                                    </button>
                                    <button 
                                        className="btn-secondary"
                                        onClick={() => onNavigate('terminal')}
                                    >
                                        Terminal
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📁</div>
                        <h3>No Projects Yet</h3>
                        <p>Create your first project to get started</p>
                        <button 
                            className="btn-primary"
                            onClick={() => onNavigate('create-project')}
                        >
                            Create Project
                        </button>
                    </div>
                )}
            </section>

            {/* System Status */}
            <section className="system-status">
                <h2>System Status</h2>
                <div className="status-grid">
                    <div className="status-item online">
                        <div className="status-indicator"></div>
                        <span>Virtual Hosting</span>
                    </div>
                    <div className="status-item online">
                        <div className="status-indicator"></div>
                        <span>Database</span>
                    </div>
                    <div className="status-item online">
                        <div className="status-indicator"></div>
                        <span>File System</span>
                    </div>
                    <div className="status-item online">
                        <div className="status-indicator"></div>
                        <span>Network</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeScreen;