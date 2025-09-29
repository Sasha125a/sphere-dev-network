import React, { useState } from 'react';
import './CreateProjectModal.css';

const CreateProjectModal = ({ isOpen, onClose, onCreate, coordinates }) => {
    const [projectData, setProjectData] = useState({
        name: '',
        type: 'website',
        template: 'blank',
        domain: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({
            ...projectData,
            coordinates,
            createdAt: new Date().toISOString()
        });
        setProjectData({ name: '', type: 'website', template: 'blank', domain: '', description: '' });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Создать новый проект</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название проекта:</label>
                        <input
                            type="text"
                            value={projectData.name}
                            onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Тип проекта:</label>
                        <select
                            value={projectData.type}
                            onChange={(e) => setProjectData({...projectData, type: e.target.value})}
                        >
                            <option value="website">Веб-сайт</option>
                            <option value="api">API Сервер</option>
                            <option value="webapp">Веб-приложение</option>
                            <option value="microservice">Микросервис</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Шаблон:</label>
                        <select
                            value={projectData.template}
                            onChange={(e) => setProjectData({...projectData, template: e.target.value})}
                        >
                            <option value="blank">Чистый проект</option>
                            <option value="react">React App</option>
                            <option value="nodejs">Node.js API</option>
                            <option value="static">Статический сайт</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Доменное имя:</label>
                        <input
                            type="text"
                            value={projectData.domain}
                            onChange={(e) => setProjectData({...projectData, domain: e.target.value})}
                            placeholder="my-project.spheredev"
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea
                            value={projectData.description}
                            onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                            rows="3"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Отмена</button>
                        <button type="submit" className="primary">Создать проект</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;