import React, { useState } from 'react';
import './CreateProjectScreen.css';

const CreateProjectScreen = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'website',
        template: 'blank',
        domain: '',
        description: ''
    });

    const projectTypes = [
        { id: 'website', name: 'Website', icon: '🌐', description: 'Static website or landing page' },
        { id: 'webapp', name: 'Web Application', icon: '🚀', description: 'Interactive web application' },
        { id: 'api', name: 'API Server', icon: '🔗', description: 'REST API or GraphQL server' },
        { id: 'microservice', name: 'Microservice', icon: '⚙️', description: 'Small, focused service' }
    ];

    const templates = {
        website: [
            { id: 'blank', name: 'Blank Website', description: 'Empty HTML/CSS/JS template' },
            { id: 'portfolio', name: 'Portfolio', description: 'Personal portfolio template' },
            { id: 'business', name: 'Business', description: 'Corporate business template' }
        ],
        webapp: [
            { id: 'react', name: 'React App', description: 'React.js application' },
            { id: 'vue', name: 'Vue.js App', description: 'Vue.js application' },
            { id: 'angular', name: 'Angular App', description: 'Angular application' }
        ],
        api: [
            { id: 'nodejs', name: 'Node.js API', description: 'Express.js REST API' },
            { id: 'python', name: 'Python API', description: 'FastAPI or Flask' },
            { id: 'graphql', name: 'GraphQL', description: 'GraphQL API server' }
        ],
        microservice: [
            { id: 'basic', name: 'Basic Service', description: 'Simple microservice template' },
            { id: 'auth', name: 'Auth Service', description: 'Authentication service' }
        ]
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const project = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        // Save to localStorage
        const existingProjects = JSON.parse(localStorage.getItem('sphereDevProjects') || '[]');
        localStorage.setItem('sphereDevProjects', JSON.stringify([project, ...existingProjects]));

        alert('Project created successfully!');
        onNavigate('home');
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="create-project-screen">
            <div className="create-project-container">
                <header className="create-project-header">
                    <button 
                        className="back-button"
                        onClick={() => onNavigate('home')}
                    >
                        ← Back
                    </button>
                    <h1>Create New Project</h1>
                    <div className="header-steps">
                        <div className="step active">1. Details</div>
                        <div className="step">2. Configure</div>
                        <div className="step">3. Deploy</div>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="project-form">
                    {/* Project Name */}
                    <div className="form-section">
                        <label className="form-label">Project Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="my-awesome-project"
                            className="form-input"
                            required
                        />
                        <div className="form-hint">
                            This will be used as your project identifier
                        </div>
                    </div>

                    {/* Project Type */}
                    <div className="form-section">
                        <label className="form-label">Project Type *</label>
                        <div className="type-grid">
                            {projectTypes.map(type => (
                                <div
                                    key={type.id}
                                    className={`type-card ${formData.type === type.id ? 'selected' : ''}`}
                                    onClick={() => handleInputChange('type', type.id)}
                                >
                                    <div className="type-icon">{type.icon}</div>
                                    <div className="type-info">
                                        <h3>{type.name}</h3>
                                        <p>{type.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Template Selection */}
                    <div className="form-section">
                        <label className="form-label">Template *</label>
                        <div className="template-grid">
                            {templates[formData.type]?.map(template => (
                                <div
                                    key={template.id}
                                    className={`template-card ${formData.template === template.id ? 'selected' : ''}`}
                                    onClick={() => handleInputChange('template', template.id)}
                                >
                                    <h4>{template.name}</h4>
                                    <p>{template.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Domain */}
                    <div className="form-section">
                        <label className="form-label">Domain Name</label>
                        <div className="domain-input-group">
                            <input
                                type="text"
                                value={formData.domain}
                                onChange={(e) => handleInputChange('domain', e.target.value)}
                                placeholder="my-project"
                                className="form-input"
                            />
                            <span className="domain-suffix">.spheredev</span>
                        </div>
                        <div className="form-hint">
                            Leave empty for auto-generated domain
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-section">
                        <label className="form-label">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe your project..."
                            className="form-textarea"
                            rows="4"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => onNavigate('home')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-create"
                            disabled={!formData.name}
                        >
                            🚀 Create Project
                        </button>
                    </div>
                </form>

                {/* Preview */}
                <div className="project-preview">
                    <h3>Project Preview</h3>
                    <div className="preview-card">
                        <div className="preview-header">
                            <h4>{formData.name || 'Project Name'}</h4>
                            <span className="preview-type">{formData.type}</span>
                        </div>
                        <p className="preview-description">
                            {formData.description || 'No description provided'}
                        </p>
                        <div className="preview-details">
                            <div className="preview-detail">
                                <strong>Template:</strong> {formData.template}
                            </div>
                            <div className="preview-detail">
                                <strong>Domain:</strong> {formData.domain || 'auto-generated'}.spheredev
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectScreen;
