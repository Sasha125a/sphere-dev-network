import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import './SphereScreen.css';

const SphereScreen = ({ onNavigate }) => {
    const mountRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Загрузка проектов
        const savedProjects = JSON.parse(localStorage.getItem('sphereDevProjects') || '[]');
        setProjects(savedProjects);

        // Инициализация Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        // Создание сферы
        const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x0066ff,
            transparent: true,
            opacity: 0.1,
            wireframe: false
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        // Создание сетки (меридианы и параллели)
        const createGridLines = () => {
            const material = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
            
            // Меридианы
            for (let i = 0; i < 12; i++) {
                const points = [];
                const longitude = (i * Math.PI) / 6;
                
                for (let lat = -Math.PI/2; lat <= Math.PI/2; lat += 0.1) {
                    const x = 3 * Math.cos(lat) * Math.cos(longitude);
                    const y = 3 * Math.sin(lat);
                    const z = 3 * Math.cos(lat) * Math.sin(longitude);
                    points.push(new THREE.Vector3(x, y, z));
                }
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                scene.add(line);
            }

            // Параллели
            for (let i = -6; i <= 6; i++) {
                const points = [];
                const latitude = (i * Math.PI) / 12;
                
                for (let lon = 0; lon <= 2 * Math.PI; lon += 0.1) {
                    const x = 3 * Math.cos(latitude) * Math.cos(lon);
                    const y = 3 * Math.sin(latitude);
                    const z = 3 * Math.cos(latitude) * Math.sin(lon);
                    points.push(new THREE.Vector3(x, y, z));
                }
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                scene.add(line);
            }
        };

        createGridLines();

        // Создание точек проектов
        const createProjectNodes = () => {
            const nodes = [];
            
            projects.forEach((project, index) => {
                // Равномерное распределение точек на сфере
                const phi = Math.acos(-1 + (2 * index) / Math.max(projects.length, 1));
                const theta = Math.sqrt(Math.max(projects.length, 1) * Math.PI) * phi;
                
                const x = 3.2 * Math.sin(phi) * Math.cos(theta);
                const y = 3.2 * Math.sin(phi) * Math.sin(theta);
                const z = 3.2 * Math.cos(phi);
                
                const geometry = new THREE.SphereGeometry(0.1, 8, 8);
                const material = new THREE.MeshBasicMaterial({ 
                    color: getProjectColor(project.type),
                    transparent: true,
                    opacity: 0.8
                });
                
                const node = new THREE.Mesh(geometry, material);
                node.position.set(x, y, z);
                node.userData = { project, index };
                scene.add(node);
                nodes.push(node);
            });
            
            return nodes;
        };

        const nodes = createProjectNodes();

        // Позиционирование камеры
        camera.position.z = 8;

        // Обработка кликов
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(nodes);
            
            if (intersects.length > 0) {
                const node = intersects[0].object;
                setSelectedNode(node.userData.project);
            } else {
                setSelectedNode(null);
            }
        };

        window.addEventListener('click', handleClick);

        // Анимация
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Медленное вращение сферы
            sphere.rotation.y += 0.002;
            nodes.forEach(node => {
                node.rotation.y += 0.005;
            });
            
            renderer.render(scene, camera);
        };
        animate();

        // Обработка изменения размера
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Очистка
        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [projects]);

    const getProjectColor = (type) => {
        const colors = {
            website: 0x00ff00,    // Зеленый
            webapp: 0xff6b6b,     // Красный
            api: 0x4ecdc4,        // Бирюзовый
            microservice: 0x45b7d1 // Синий
        };
        return colors[type] || 0xffffff;
    };

    const getProjectIcon = (type) => {
        const icons = {
            website: '🌐',
            webapp: '🚀',
            api: '🔗',
            microservice: '⚙️'
        };
        return icons[type] || '📁';
    };

    return (
        <div className="sphere-screen">
            {/* Панель управления */}
            <div className="sphere-controls">
                <button 
                    className="back-button"
                    onClick={() => onNavigate('home')}
                >
                    ← Back to Home
                </button>
                <h1>3D Project Sphere</h1>
                <div className="sphere-info">
                    <p>Click on project nodes to view details</p>
                    <div className="projects-count">
                        {projects.length} projects in sphere
                    </div>
                </div>
            </div>

            {/* Контейнер для Three.js */}
            <div ref={mountRef} className="sphere-container" />

            {/* Панель выбранного проекта */}
            {selectedNode && (
                <div className="project-panel">
                    <div className="project-header">
                        <span className="project-icon">
                            {getProjectIcon(selectedNode.type)}
                        </span>
                        <h3>{selectedNode.name}</h3>
                        <button 
                            className="close-button"
                            onClick={() => setSelectedNode(null)}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="project-details">
                        <div className="detail-item">
                            <strong>Type:</strong> {selectedNode.type}
                        </div>
                        <div className="detail-item">
                            <strong>Template:</strong> {selectedNode.template}
                        </div>
                        <div className="detail-item">
                            <strong>Domain:</strong> {selectedNode.domain || 'auto'}.spheredev
                        </div>
                        <div className="detail-item">
                            <strong>Created:</strong> {new Date(selectedNode.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    {selectedNode.description && (
                        <div className="project-description">
                            <strong>Description:</strong>
                            <p>{selectedNode.description}</p>
                        </div>
                    )}

                    <div className="project-actions">
                        <button className="btn-primary">Open Project</button>
                        <button className="btn-secondary">Open Terminal</button>
                        <button className="btn-secondary">Open Editor</button>
                    </div>
                </div>
            )}

            {/* Легенда */}
            <div className="sphere-legend">
                <h4>Project Types</h4>
                <div className="legend-items">
                    <div className="legend-item">
                        <div className="color-dot website"></div>
                        <span>Website</span>
                    </div>
                    <div className="legend-item">
                        <div className="color-dot webapp"></div>
                        <span>Web App</span>
                    </div>
                    <div className="legend-item">
                        <div className="color-dot api"></div>
                        <span>API</span>
                    </div>
                    <div className="legend-item">
                        <div className="color-dot microservice"></div>
                        <span>Microservice</span>
                    </div>
                </div>
            </div>

            {/* Пустое состояние */}
            {projects.length === 0 && (
                <div className="empty-sphere">
                    <div className="empty-content">
                        <div className="empty-icon">🌐</div>
                        <h3>No Projects Yet</h3>
                        <p>Create your first project to see it in the 3D sphere</p>
                        <button 
                            className="btn-primary"
                            onClick={() => onNavigate('create-project')}
                        >
                            Create Project
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SphereScreen;
