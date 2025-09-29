import React, { useState, useEffect } from 'react';
import './ProjectsScreen.css';

const ProjectsScreen = ({ onNavigate }) => {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        const savedProjects = JSON.parse(localStorage.getItem('sphereDevProjects') || '[]');
        setProjects(savedProjects);
    };

    const filteredProjects = projects
        .filter(project => {
            const matchesFilter = filter === 'all' || project.type === filter;
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               project.description?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

    const getProjectIcon = (type) => {
        const icons = {
            website: '🌐',
            webapp: '🚀',
            api: '🔗',
            microservice: '⚙️'
        };
        return icons[type] || '📁';
    };

    const getStatusColor = (status) => {
        const colors = {
            active: '#00ff00',
            inactive: '#ffaa00',
            deployed: '#00ffff',
            error: '#ff4444'
        };
        return colors[status] || '#666';
    };

    const deleteProject = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const updatedProjects = projects.filter(p => p.id !== projectId);
            setProjects(updatedProjects);
            localStorage.setItem('sphereDevProjects', JSON.stringify(updatedProjects));
        }
    };

    const projectStats = {
        total: projects.length,
        website: projects.filter(p => p.type === 'website').length,
        webapp: projects.filter(p => p.type === 'webapp').length,
        api: projects.filter(p => p.type === 'api').length,
        microservice: projects.filter(p => p.type === 'microservice').length
    };

    return (
        <div className="projects-screen">
            <header className="projects-header">
                <div className="header-content">
                    <button 
                        className="back-button"
                        onClick={() => onNavigate('home')}
                    >
                        ← Back
                    </button>
                    <h1>My Projects</h1>
                    <p>Manage and organize your development projects</p>
                </div>
                <button 
                    className="create-project-btn"
                    onClick={() => onNavigate('create-project')}
                >
                    + New Project
                </button>
            </header>

            {/* Статистика */}
            <div className="projects-stats">
                <div className="stat-card">
                    <div className="stat-number">{projectStats.total}</div>
                    <div className="stat-label">Total Projects</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{projectStats.website}</div>
                    <div className="stat-label">Websites</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{projectStats.webapp}</div>
                    <div className="stat-label">Web Apps</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{projectStats.api}</div>
                    <div className="stat-label">APIs</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{projectStats.microservice}</div>
                    <div className="stat-label">Microservices</div>
                </div>
            </div>

            {/* Фильтры и поиск */}
            <div className="projects-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="filters">
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Types</option>
                        <option value="website">Websites</option>
                        <option value="webapp">Web Apps</option>
                        <option value="api">APIs</option>
                        <option value="microservice">Microservices</option>
                    </select>

                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name A-Z</option>
                    </select>
                </div>
            </div>

            {/* Список проектов */}
            <div className="projects-list">
                {filteredProjects.length > 0 ? (
                    <div className="projects-grid">
                        {filteredProjects.map(project => (
                            <div key={project.id} className="project-card">
                                <div className="project-header">
                                    <div className="project-icon">
                                        {getProjectIcon(project.type)}
                                    </div>
                                    <div className="project-info">
                                        <h3 className="project-name">{project.name}</h3>
                                        <div className="project-meta">
                                            <span className="project-type">{project.type}</span>
                                            <span className="project-date">
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="project-status">
                                        <div 
                                            className="status-dot"
                                            style={{ backgroundColor: getStatusColor(project.status) }}
                                        ></div>
                                        <span>{project.status || 'active'}</span>
                                    </div>
                                </div>

                                {project.description && (
                                    <p className="project-description">
                                        {project.description}
                                    </p>
                                )}

                                <div className="project-details">
                                    <div className="detail">
                                        <strong>Template:</strong> {project.template}
                                    </div>
                                    <div className="detail">
                                        <strong>Domain:</strong> {project.domain || 'auto'}.spheredev
                                    </div>
                                </div>

                                <div className="project-actions">
                                    <button 
                                        className="btn-primary"
                                        onClick={() => onNavigate('editor')}
                                    >
                                        Open Editor
                                    </button>
                                    <button 
                                        className="btn-secondary"
                                        onClick={() => onNavigate('terminal')}
                                    >
                                        Terminal
                                    </button>
                                    <button 
                                        className="btn-tertiary"
                                        onClick={() => deleteProject(project.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📁</div>
                        <h3>No Projects Found</h3>
                        <p>
                            {searchTerm || filter !== 'all' 
                                ? 'Try adjusting your search or filters'
                                : 'Create your first project to get started'
                            }
                        </p>
                        {!searchTerm && filter === 'all' && (
                            <button 
                                className="btn-primary"
                                onClick={() => onNavigate('create-project')}
                            >
                                Create Project
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Быстрые действия */}
            <div className="quick-actions-bar">
                <button 
                    className="quick-action"
                    onClick={() => onNavigate('sphere')}
                >
                    <span className="action-icon">🌐</span>
                    <span>3D View</span>
                </button>
                <button 
                    className="quick-action"
                    onClick={() => onNavigate('terminal')}
                >
                    <span className="action-icon">⌨️</span>
                    <span>Terminal</span>
                </button>
                <button 
                    className="quick-action"
                    onClick={() => onNavigate('editor')}
                >
                    <span className="action-icon">💻</span>
                    <span>Editor</span>
                </button>
            </div>
        </div>
    );
};

export default ProjectsScreen;
