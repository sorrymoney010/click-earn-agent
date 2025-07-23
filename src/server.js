/**
 * ThoughtScript Web Server
 * Serves the web-based IDE and handles code execution
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Interpreter } = require('./interpreter/interpreter');

class ThoughtScriptServer {
    constructor(port = 3000) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.sessions = new Map(); // Store interpreter sessions by socket ID
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketIO();
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    setupRoutes() {
        // Serve the main IDE page
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

        // API endpoint for code execution
        this.app.post('/api/execute', (req, res) => {
            try {
                const { code } = req.body;
                const interpreter = new Interpreter();
                const result = interpreter.interpret(code);
                const output = interpreter.getOutput();
                
                res.json({
                    success: true,
                    result: result,
                    output: output,
                    error: null
                });
            } catch (error) {
                res.json({
                    success: false,
                    result: null,
                    output: [],
                    error: error.message
                });
            }
        });

        // API endpoint for language documentation
        this.app.get('/api/docs', (req, res) => {
            res.json({
                keywords: [
                    { name: 'think', description: 'Declare a variable with intention', example: 'think "Hello" as greeting' },
                    { name: 'express', description: 'Output to console', example: 'express greeting' },
                    { name: 'consider', description: 'Loop through a range', example: 'consider i from 1 to 10:' },
                    { name: 'if', description: 'Conditional statement', example: 'if x > 5:' },
                    { name: 'otherwise', description: 'Else clause', example: 'otherwise:' },
                    { name: 'remember', description: 'Store in memory', example: 'remember value as "key"' },
                    { name: 'show', description: 'Display value', example: 'show memories' }
                ],
                builtinFunctions: [
                    { name: 'isEven', params: ['number'], description: 'Check if number is even' },
                    { name: 'isOdd', params: ['number'], description: 'Check if number is odd' },
                    { name: 'length', params: ['string'], description: 'Get string length' },
                    { name: 'type', params: ['value'], description: 'Get value type' },
                    { name: 'add', params: ['a', 'b'], description: 'Add two numbers' },
                    { name: 'subtract', params: ['a', 'b'], description: 'Subtract two numbers' },
                    { name: 'multiply', params: ['a', 'b'], description: 'Multiply two numbers' },
                    { name: 'divide', params: ['a', 'b'], description: 'Divide two numbers' },
                    { name: 'uppercase', params: ['string'], description: 'Convert to uppercase' },
                    { name: 'lowercase', params: ['string'], description: 'Convert to lowercase' }
                ]
            });
        });

        // API endpoint for example programs
        this.app.get('/api/examples', (req, res) => {
            res.json([
                {
                    title: 'Hello World',
                    description: 'A simple greeting program',
                    code: `think "Hello, World!" as greeting\nexpress greeting`
                },
                {
                    title: 'Number Classification',
                    description: 'Classify numbers as even or odd',
                    code: `consider number from 1 to 10:\n    if isEven(number):\n        remember number as "even"\n    otherwise:\n        remember number as "odd"\n\nshow memories`
                },
                {
                    title: 'Simple Calculator',
                    description: 'Basic arithmetic operations',
                    code: `think 15 as x\nthink 25 as y\n\nexpress "Addition: " + add(x, y)\nexpress "Subtraction: " + subtract(x, y)\nexpress "Multiplication: " + multiply(x, y)\nexpress "Division: " + divide(x, y)`
                },
                {
                    title: 'String Processing',
                    description: 'Working with strings',
                    code: `think "thoughtscript" as language\nexpress "Original: " + language\nexpress "Uppercase: " + uppercase(language)\nexpress "Length: " + length(language)`
                },
                {
                    title: 'Function Definition',
                    description: 'Creating custom functions',
                    code: `define intention greet with name:\n    think "Hello, " + name + "!" as message\n    express message\n\ngreet("ThoughtScript")\ngreet("World")`
                }
            ]);
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });
    }

    setupSocketIO() {
        this.io.on('connection', (socket) => {
            console.log(`Client connected: ${socket.id}`);
            
            // Create a new interpreter session for this socket
            this.sessions.set(socket.id, new Interpreter());

            socket.on('execute', (data) => {
                try {
                    const interpreter = this.sessions.get(socket.id);
                    const result = interpreter.interpret(data.code);
                    const output = interpreter.getOutput();
                    
                    socket.emit('result', {
                        success: true,
                        result: result,
                        output: output,
                        error: null
                    });
                } catch (error) {
                    socket.emit('result', {
                        success: false,
                        result: null,
                        output: [],
                        error: error.message
                    });
                }
            });

            socket.on('reset', () => {
                this.sessions.set(socket.id, new Interpreter());
                socket.emit('reset_complete');
            });

            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
                this.sessions.delete(socket.id);
            });
        });
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`🧠 ThoughtScript Server running on http://localhost:${this.port}`);
            console.log(`🌐 Web IDE available at http://localhost:${this.port}`);
            console.log(`🔌 WebSocket server ready for real-time execution`);
        });
    }

    stop() {
        this.server.close();
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    const port = process.env.PORT || 3000;
    const server = new ThoughtScriptServer(port);
    server.start();
}

module.exports = ThoughtScriptServer;