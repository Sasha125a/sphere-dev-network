import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import './ProjectMonitor.css';

const ProjectMonitor = ({ projectId }) => {
    const [metrics, setMetrics] = useState({
        cpu: 0,
        memory: 0,
        traffic: 0,
        requests: 0
    });
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const interval = setInterval(fetchMetrics, 2000);
        return () => clearInterval(interval);
    }, [projectId]);

    const fetchMetrics = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}/metrics`);
            const data = await response.json();
            
            setMetrics(data.current);
            setHistory(prev => [...prev.slice(-50), data.current]);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        }
    };

    const trafficData = {
        labels: history.map((_, i) => i),
        datasets: [
            {
                label: 'CPU Usage',
                data: history.map(m => m.cpu),
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)'
            },
            {
                label: 'Memory Usage',
                data: history.map(m => m.memory),
                borderColor: '#ff00ff',
                backgroundColor: 'rgba(255, 0, 255, 0.1)'
            }
        ]
    };

    const requestsData = {
        labels: ['Success', 'Errors', 'Pending'],
        datasets: [{
            data: [metrics.requests * 0.8, metrics.requests * 0.1, metrics.requests * 0.1],
            backgroundColor: ['#00ff00', '#ff0000', '#ffff00']
        }]
    };

    return (
        <div className="project-monitor">
            <h3>Real-time Monitoring</h3>
            
            <div className="metrics-grid">
                <div className="metric-card">
                    <h4>CPU Usage</h4>
                    <div className="metric-value">{metrics.cpu}%</div>
                    <div className="metric-bar">
                        <div 
                            className="metric-fill cpu" 
                            style={{ width: `${metrics.cpu}%` }}
                        ></div>
                    </div>
                </div>

                <div className="metric-card">
                    <h4>Memory Usage</h4>
                    <div className="metric-value">{metrics.memory}MB</div>
                    <div className="metric-bar">
                        <div 
                            className="metric-fill memory" 
                            style={{ width: `${Math.min(metrics.memory / 100, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="metric-card">
                    <h4>Network Traffic</h4>
                    <div className="metric-value">{metrics.traffic}KB/s</div>
                    <div className="metric-traffic">
                        <span>↑ {metrics.traffic * 0.3}KB/s</span>
                        <span>↓ {metrics.traffic * 0.7}KB/s</span>
                    </div>
                </div>

                <div className="metric-card">
                    <h4>Requests</h4>
                    <div className="metric-value">{metrics.requests}/min</div>
                    <div className="requests-stats">
                        <span style={{color: '#00ff00'}}>✓ 80%</span>
                        <span style={{color: '#ff0000'}}>✗ 10%</span>
                    </div>
                </div>
            </div>

            <div className="charts-row">
                <div className="chart-container">
                    <h4>Resource Usage Over Time</h4>
                    <Line data={trafficData} options={{ maintainAspectRatio: false }} />
                </div>
                
                <div className="chart-container">
                    <h4>Request Distribution</h4>
                    <Doughnut data={requestsData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

export default ProjectMonitor;