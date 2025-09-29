import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import SphereScreen from './screens/SphereScreen.jsx';
import ProjectsScreen from './screens/ProjectsScreen.jsx';
import CreateProjectScreen from './screens/CreateProjectScreen.jsx';
import TerminalScreen from './screens/TerminalScreen.jsx';
import EditorScreen from './screens/EditorScreen.jsx';
import './App.css';

function App() {
    const [currentScreen, setCurrentScreen] = useState('home');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'home':
                return <HomeScreen onNavigate={setCurrentScreen} />;
            case 'sphere':
                return <SphereScreen onNavigate={setCurrentScreen} />;
            case 'projects':
                return <ProjectsScreen onNavigate={setCurrentScreen} />;
            case 'create-project':
                return <CreateProjectScreen onNavigate={setCurrentScreen} />;
            case 'terminal':
                return <TerminalScreen onNavigate={setCurrentScreen} />;
            case 'editor':
                return <EditorScreen onNavigate={setCurrentScreen} />;
            default:
                return <HomeScreen onNavigate={setCurrentScreen} />;
        }
    };

    if (isLoading) {
        return (
            <div className="app-loading">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <h1>🌐 SphereDev Network</h1>
                    <p>Initializing virtual environment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            {renderScreen()}
        </div>
    );
}

export default App;
