import React, { useState } from 'react';
import { X, Server, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, resetApiBaseUrl, api } from '../services/api';

export default function ApiConfigModal({ isOpen, onClose, onConfigSaved, showToast }) {
  const [url, setUrl] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      setApiBaseUrl(url);
      const res = await api.checkHealth();
      setTestResult({
        success: true,
        message: `Connected successfully! Server response: "${res}"`,
      });
      showToast('Backend connection verified!', 'success');
    } catch (err) {
      console.error('Test connection error:', err);
      setTestResult({
        success: false,
        message: `Could not connect to ${url}. Make sure your Spring Boot server is running on port 2131 (e.g. mvn spring-boot:run). Error: ${err.message}`,
      });
      showToast('Connection failed', 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setApiBaseUrl(url);
    showToast('API URL saved', 'success');
    onConfigSaved(url);
    onClose();
  };

  const handleReset = () => {
    const defaultUrl = resetApiBaseUrl();
    setUrl(defaultUrl);
    setTestResult(null);
    showToast('Reset to default URL (http://localhost:2131)', 'info');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Server size={18} color="var(--primary)" />
            <span>Backend Server Settings</span>
          </h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            The Spring Boot backend is configured in <code>application.properties</code> on port <code>2131</code>. You can test or update the backend URL here.
          </p>

          <div className="form-group">
            <label className="form-label">Spring Boot API Base URL</label>
            <input
              type="text"
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:2131"
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleTestConnection}
              disabled={testing}
              style={{ flex: 1 }}
            >
              <RefreshCw size={14} className={testing ? 'spin' : ''} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              style={{ fontSize: '0.8rem' }}
            >
              Reset Default
            </button>
          </div>

          {testResult && (
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                fontSize: '0.825rem',
                marginBottom: 16,
                background: testResult.success ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${testResult.success ? '#a7f3d0' : '#fecaca'}`,
                color: testResult.success ? '#065f46' : '#991b1b',
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
              }}
            >
              {testResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
              <div>{testResult.message}</div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
