/**
 * ThoughtScript Web IDE
 * Interactive JavaScript application for the browser-based IDE
 */

class ThoughtScriptIDE {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.elements = {};
        
        this.initializeElements();
        this.setupEventListeners();
        this.connectWebSocket();
        this.loadExamples();
        this.loadDocumentation();
        this.updateLineNumbers();
    }

    initializeElements() {
        this.elements = {
            // Editor
            codeEditor: document.getElementById('code-editor'),
            lineNumbers: document.getElementById('line-numbers'),
            
            // Output
            outputConsole: document.getElementById('output-console'),
            
            // Buttons
            runBtn: document.getElementById('run-btn'),
            resetBtn: document.getElementById('reset-btn'),
            examplesBtn: document.getElementById('examples-btn'),
            docsBtn: document.getElementById('docs-btn'),
            clearEditor: document.getElementById('clear-editor'),
            copyCode: document.getElementById('copy-code'),
            clearOutput: document.getElementById('clear-output'),
            copyOutput: document.getElementById('copy-output'),
            
            // Modals
            examplesModal: document.getElementById('examples-modal'),
            docsModal: document.getElementById('docs-modal'),
            examplesList: document.getElementById('examples-list'),
            keywordsList: document.getElementById('keywords-list'),
            functionsList: document.getElementById('functions-list'),
            
            // Loading
            loadingOverlay: document.getElementById('loading-overlay')
        };
    }

    setupEventListeners() {
        // Editor events
        this.elements.codeEditor.addEventListener('input', () => {
            this.updateLineNumbers();
        });

        this.elements.codeEditor.addEventListener('scroll', () => {
            this.syncLineNumbers();
        });

        this.elements.codeEditor.addEventListener('keydown', (e) => {
            this.handleEditorKeydown(e);
        });

        // Button events
        this.elements.runBtn.addEventListener('click', () => {
            this.executeCode();
        });

        this.elements.resetBtn.addEventListener('click', () => {
            this.resetEnvironment();
        });

        this.elements.examplesBtn.addEventListener('click', () => {
            this.showModal('examples');
        });

        this.elements.docsBtn.addEventListener('click', () => {
            this.showModal('docs');
        });

        this.elements.clearEditor.addEventListener('click', () => {
            this.clearEditor();
        });

        this.elements.copyCode.addEventListener('click', () => {
            this.copyToClipboard(this.elements.codeEditor.value, 'Code copied!');
        });

        this.elements.clearOutput.addEventListener('click', () => {
            this.clearOutput();
        });

        this.elements.copyOutput.addEventListener('click', () => {
            const outputText = this.elements.outputConsole.textContent;
            this.copyToClipboard(outputText, 'Output copied!');
        });

        // Modal events
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal').id);
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });
    }

    connectWebSocket() {
        try {
            this.socket = io();
            
            this.socket.on('connect', () => {
                this.isConnected = true;
                this.addOutputLine('Connected to ThoughtScript server', 'success');
                console.log('Connected to ThoughtScript server');
            });

            this.socket.on('disconnect', () => {
                this.isConnected = false;
                this.addOutputLine('Disconnected from server', 'error');
                console.log('Disconnected from server');
            });

            this.socket.on('result', (data) => {
                this.handleExecutionResult(data);
            });

            this.socket.on('reset_complete', () => {
                this.addOutputLine('Environment reset successfully', 'success');
                this.hideLoading();
            });

        } catch (error) {
            console.error('WebSocket connection failed:', error);
            this.addOutputLine('Failed to connect to server. Using fallback mode.', 'error');
        }
    }

    executeCode() {
        const code = this.elements.codeEditor.value.trim();
        
        if (!code) {
            this.addOutputLine('No code to execute', 'error');
            return;
        }

        this.showLoading();
        this.addOutputLine(`> Executing ThoughtScript...`, 'output');

        if (this.isConnected && this.socket) {
            this.socket.emit('execute', { code });
        } else {
            // Fallback to HTTP API
            this.executeCodeHTTP(code);
        }
    }

    async executeCodeHTTP(code) {
        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            this.handleExecutionResult(data);
        } catch (error) {
            this.handleExecutionResult({
                success: false,
                error: 'Network error: ' + error.message,
                output: []
            });
        }
    }

    handleExecutionResult(data) {
        this.hideLoading();

        if (data.success) {
            // Display output lines
            if (data.output && data.output.length > 0) {
                data.output.forEach(line => {
                    this.addOutputLine(line, 'output');
                });
            }

            // Display result if any
            if (data.result !== null && data.result !== undefined) {
                this.addOutputLine(`→ ${data.result}`, 'success');
            }

            this.addOutputLine('Execution completed successfully', 'success');
        } else {
            this.addOutputLine(`✗ Error: ${data.error}`, 'error');
        }
    }

    resetEnvironment() {
        this.showLoading();
        
        if (this.isConnected && this.socket) {
            this.socket.emit('reset');
        } else {
            // Fallback - just clear output
            this.clearOutput();
            this.addOutputLine('Environment reset (fallback mode)', 'success');
            this.hideLoading();
        }
    }

    async loadExamples() {
        try {
            const response = await fetch('/api/examples');
            const examples = await response.json();
            
            this.elements.examplesList.innerHTML = '';
            
            examples.forEach(example => {
                const card = document.createElement('div');
                card.className = 'example-card';
                card.innerHTML = `
                    <h4>${example.title}</h4>
                    <p>${example.description}</p>
                    <pre><code>${example.code}</code></pre>
                `;
                
                card.addEventListener('click', () => {
                    this.elements.codeEditor.value = example.code;
                    this.updateLineNumbers();
                    this.closeModal('examples-modal');
                    this.addOutputLine(`Loaded example: ${example.title}`, 'success');
                });
                
                this.elements.examplesList.appendChild(card);
            });
        } catch (error) {
            console.error('Failed to load examples:', error);
        }
    }

    async loadDocumentation() {
        try {
            const response = await fetch('/api/docs');
            const docs = await response.json();
            
            // Load keywords
            this.elements.keywordsList.innerHTML = '';
            docs.keywords.forEach(keyword => {
                const item = document.createElement('div');
                item.className = 'docs-item';
                item.innerHTML = `
                    <h4>${keyword.name}</h4>
                    <p>${keyword.description}</p>
                    <code>${keyword.example}</code>
                `;
                this.elements.keywordsList.appendChild(item);
            });
            
            // Load functions
            this.elements.functionsList.innerHTML = '';
            docs.builtinFunctions.forEach(func => {
                const item = document.createElement('div');
                item.className = 'docs-item';
                item.innerHTML = `
                    <h4>${func.name}(${func.params.join(', ')})</h4>
                    <p>${func.description}</p>
                `;
                this.elements.functionsList.appendChild(item);
            });
        } catch (error) {
            console.error('Failed to load documentation:', error);
        }
    }

    updateLineNumbers() {
        const lines = this.elements.codeEditor.value.split('\n');
        const lineNumbers = lines.map((_, index) => index + 1).join('\n');
        this.elements.lineNumbers.textContent = lineNumbers;
    }

    syncLineNumbers() {
        this.elements.lineNumbers.scrollTop = this.elements.codeEditor.scrollTop;
    }

    handleEditorKeydown(e) {
        // Handle tab key
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = e.target.value;
            
            e.target.value = value.substring(0, start) + '    ' + value.substring(end);
            e.target.selectionStart = e.target.selectionEnd = start + 4;
            
            this.updateLineNumbers();
        }
    }

    handleGlobalKeydown(e) {
        // Ctrl/Cmd + Enter to run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.executeCode();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                this.closeModal(modal.id);
            });
        }
    }

    addOutputLine(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'output':
                icon = '<i class="fas fa-chevron-right"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        line.innerHTML = `${icon}<span>${this.escapeHtml(text)}</span>`;
        this.elements.outputConsole.appendChild(line);
        
        // Auto-scroll to bottom
        this.elements.outputConsole.scrollTop = this.elements.outputConsole.scrollHeight;
    }

    clearEditor() {
        this.elements.codeEditor.value = '';
        this.updateLineNumbers();
        this.addOutputLine('Editor cleared', 'success');
    }

    clearOutput() {
        this.elements.outputConsole.innerHTML = `
            <div class="console-line welcome">
                <i class="fas fa-info-circle"></i>
                Welcome to ThoughtScript! Click "Run" to execute your thoughts.
            </div>
        `;
    }

    showModal(modalType) {
        const modalId = `${modalType}-modal`;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showLoading() {
        this.elements.loadingOverlay.classList.add('active');
        this.elements.runBtn.disabled = true;
    }

    hideLoading() {
        this.elements.loadingOverlay.classList.remove('active');
        this.elements.runBtn.disabled = false;
    }

    async copyToClipboard(text, successMessage = 'Copied!') {
        try {
            await navigator.clipboard.writeText(text);
            this.addOutputLine(successMessage, 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.addOutputLine(successMessage, 'success');
            } catch (fallbackErr) {
                this.addOutputLine('Failed to copy to clipboard', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the IDE when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.thoughtScriptIDE = new ThoughtScriptIDE();
    
    // Add some helpful startup messages
    setTimeout(() => {
        window.thoughtScriptIDE.addOutputLine('💡 Tip: Use Ctrl+Enter (or Cmd+Enter) to run your code quickly!', 'output');
        window.thoughtScriptIDE.addOutputLine('📚 Check out the Examples and Documentation for inspiration!', 'output');
    }, 1000);
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThoughtScriptIDE;
}