import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SphereScene = ({ onNodeClick }) => {
    const mountRef = useRef(null);
    const [scene] = useState(new THREE.Scene());
    const [camera] = useState(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const [renderer] = useState(new THREE.WebGLRenderer({ antialias: true }));
    const [intersectionPoints, setIntersectionPoints] = useState([]);

    useEffect(() => {
        // Настройка рендерера
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x001122); // Темно-синий фон
        mountRef.current.appendChild(renderer.domElement);

        // Создание сферы с параллелями и меридианами
        createSphereWithGrid();

        // Камера и управление
        camera.position.z = 5;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Обработка кликов
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            
            if (intersects.length > 0) {
                const point = intersects[0].point;
                const intersection = findClosestIntersection(point);
                if (intersection && onNodeClick) {
                    onNodeClick(intersection);
                }
            }
        };

        window.addEventListener('click', handleClick);

        // Анимация
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('click', handleClick);
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    const createSphereWithGrid = () => {
        // Основная сфера (прозрачная)
        const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x0066ff,
            transparent: true,
            opacity: 0.3,
            wireframe: false
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        // Параллели и меридианы
        const gridMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
        
        // Меридианы (вертикальные)
        for (let i = 0; i < 12; i++) {
            const meridian = createMeridian(2, i * Math.PI / 6);
            scene.add(meridian);
        }

        // Параллели (горизонтальные)
        for (let i = -5; i <= 5; i++) {
            const parallel = createParallel(2, i * Math.PI / 12);
            scene.add(parallel);
        }

        // Точки пересечения
        const points = calculateIntersectionPoints();
        setIntersectionPoints(points);
        createIntersectionPoints(points);
    };

    const createMeridian = (radius, longitude) => {
        const points = [];
        for (let lat = -Math.PI/2; lat <= Math.PI/2; lat += 0.1) {
            const x = radius * Math.cos(lat) * Math.cos(longitude);
            const y = radius * Math.sin(lat);
            const z = radius * Math.cos(lat) * Math.sin(longitude);
            points.push(new THREE.Vector3(x, y, z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x00ffff }));
    };

    const createParallel = (radius, latitude) => {
        const points = [];
        for (let lon = 0; lon <= 2 * Math.PI; lon += 0.1) {
            const x = radius * Math.cos(latitude) * Math.cos(lon);
            const y = radius * Math.sin(latitude);
            const z = radius * Math.cos(latitude) * Math.sin(lon);
            points.push(new THREE.Vector3(x, y, z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x00ffff }));
    };

    const calculateIntersectionPoints = () => {
        const points = [];
        const parallels = [-Math.PI/2, -Math.PI/3, -Math.PI/6, 0, Math.PI/6, Math.PI/3, Math.PI/2];
        const meridians = Array.from({length: 12}, (_, i) => i * Math.PI / 6);

        parallels.forEach(lat => {
            meridians.forEach(lon => {
                const x = 2 * Math.cos(lat) * Math.cos(lon);
                const y = 2 * Math.sin(lat);
                const z = 2 * Math.cos(lat) * Math.sin(lon);
                points.push({ x, y, z, lat, lon });
            });
        });

        return points;
    };

    const createIntersectionPoints = (points) => {
        points.forEach(point => {
            const geometry = new THREE.SphereGeometry(0.05, 8, 8);
            const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(point.x, point.y, point.z);
            sphere.userData = { type: 'intersection', coordinates: point };
            scene.add(sphere);
        });
    };

    const findClosestIntersection = (point) => {
        let closest = null;
        let minDistance = Infinity;

        intersectionPoints.forEach(intersection => {
            const distance = point.distanceTo(
                new THREE.Vector3(intersection.x, intersection.y, intersection.z)
            );
            if (distance < minDistance && distance < 0.2) {
                minDistance = distance;
                closest = intersection;
            }
        });

        return closest;
    };

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default SphereScene;