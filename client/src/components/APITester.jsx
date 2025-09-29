import React, { useState } from 'react';
import './APITester.css';

const APITester = ({ projectId }) => {
    const [request, setRequest] = useState({
        method: 'GET',
        url: '',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        body: '{}'
    });
    const [response, setResponse] = useState(null);
    const [history, setHistory] = useState([]);

    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

    const sendRequest = async () => {
        try {
            const headers = {};
            request.headers.forEach(header => {
                if (header.key && header.value) {
                    headers[header.key] = header.value;
                }
            });

            const startTime = Date.now();
            const apiResponse = await fetch(request.url, {
                method: request.method,
                headers: headers,
                body: ['POST', 'PUT', 'PATCH'].includes(request.method) ? request.body : undefined
            });

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const responseData = {
                status: apiResponse.status,
                statusText: apiResponse.statusText,
                headers: Object.fromEntries(apiResponse.headers.entries()),
                body: await apiResponse.text(),
                time: responseTime,
                size: JSON.stringify(response).length
            };

            setResponse(responseData);

            // Add to history
            setHistory(prev => [{
                id: Date.now(),
                method: request.method,
                url: request.url,
                status: apiResponse.status,
                time: responseTime,
                timestamp: new Date().toLocaleTimeString()
            }, ...prev.slice(0, 9)]);
        } catch (error) {
            setResponse({
                error: error.message,
                time: 0,
                status: 0
            });
        }
    };

    const addHeader = () => {
        setRequest(prev => ({
            ...prev,
            headers: [...prev.headers, { key: '', value: '' }]
        }));
    };

    const updateHeader = (index, field, value) => {
        setRequest(prev => ({
            ...prev,
            headers: prev.headers.map((header, i) => 
                i === index ? { ...header, [field]: value } : header
            )
        }));
    };

    const removeHeader = (index) => {
        setRequest(prev => ({
            ...prev,
            headers: prev.headers.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="api-tester">
            <div className="tester-container">
                <div className="request-panel">
                    <h3>API Tester</h3>
                    
                    <div className="request-config">
                        <select 
                            value={request.method}
                            onChange={(e) => setRequest({...request, method: e.target.value})}
                        >
                            {methods.map(method => (
                                <option key={method} value={method}>{method}</option>
                            ))}
                        </select>
                        
                        <input
                            type="text"
                            value={request.url}
                            onChange={(e) => setRequest({...request, url: e.target.value})}
                            placeholder="https://api.example.com/endpoint"
                        />
                        
                        <button onClick={sendRequest} className="send-btn">
                            Send
                        </button>
                    </div>

                    <div className="headers-section">
                        <h4>Headers</h4>
                        {request.headers.map((header, index) => (
                            <div key={index} className="header-row">
                                <input
                                    type="text"
                                    value={header.key}
                                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                    placeholder="Header name"
                                />
                                <input
                                    type="text"
                                    value={header.value}
                                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                    placeholder="Header value"
                                />
                                <button 
                                    onClick={() => removeHeader(index)}
                                    className="remove-header"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button onClick={addHeader} className="add-header">
                            + Add Header
                        </button>
                    </div>

                    {['POST', 'PUT', 'PATCH'].includes(request.method) && (
                        <div className="body-section">
                            <h4>Request Body</h4>
                            <textarea
                                value={request.body}
                                onChange={(e) => setRequest({...request, body: e.target.value})}
                                placeholder='{"key": "value"}'
                                rows="6"
                            />
                        </div>
                    )}
                </div>

                <div className="response-panel">
                    <h3>Response</h3>
                    
                    {response && (
                        <div className="response-info">
                            <div className="status-line">
                                <span className={`status status-${response.status}`}>
                                    Status: {response.status} {response.statusText}
                                </span>
                                <span className="response-time">Time: {response.time}ms</span>
                                <span className="response-size">Size: {response.size}B</span>
                            </div>

                            {response.error ? (
                                <div className="response-error">
                                    Error: {response.error}
                                </div>
                            ) : (
                                <>
                                    <div className="response-headers">
                                        <h4>Headers:</h4>
                                        <pre>{JSON.stringify(response.headers, null, 2)}</pre>
                                    </div>
                                    
                                    <div className="response-body">
                                        <h4>Body:</h4>
                                        <pre>{response.body}</pre>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="history-panel">
                <h4>Request History</h4>
                {history.map(item => (
                    <div key={item.id} className="history-item">
                        <span className={`method method-${item.method}`}>{item.method}</span>
                        <span className="history-url">{item.url}</span>
                        <span className={`status status-${item.status}`}>{item.status}</span>
                        <span className="history-time">{item.time}ms</span>
                        <span className="history-timestamp">{item.timestamp}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default APITester;