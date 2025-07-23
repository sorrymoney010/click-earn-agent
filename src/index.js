/**
 * ThoughtScript - Main Entry Point
 * A Dynamic Programming Language for Thought-Based Computing
 */

const { Lexer, Token } = require('./parser/lexer');
const { Parser } = require('./parser/parser');
const { Interpreter } = require('./interpreter/interpreter');
const ThoughtScriptREPL = require('./repl');
const ThoughtScriptServer = require('./server');

/**
 * Main ThoughtScript class that combines all components
 */
class ThoughtScript {
    constructor() {
        this.interpreter = new Interpreter();
    }

    /**
     * Execute ThoughtScript code
     * @param {string} source - ThoughtScript source code
     * @returns {any} - Execution result
     */
    run(source) {
        return this.interpreter.interpret(source);
    }

    /**
     * Parse ThoughtScript code into AST
     * @param {string} source - ThoughtScript source code
     * @returns {Object} - Abstract Syntax Tree
     */
    parse(source) {
        const parser = new Parser(source);
        return parser.parse();
    }

    /**
     * Tokenize ThoughtScript code
     * @param {string} source - ThoughtScript source code
     * @returns {Array} - Array of tokens
     */
    tokenize(source) {
        const lexer = new Lexer(source);
        return lexer.tokenize();
    }

    /**
     * Get the output from the last execution
     * @returns {Array} - Array of output strings
     */
    getOutput() {
        return this.interpreter.getOutput();
    }

    /**
     * Clear the output buffer
     */
    clearOutput() {
        this.interpreter.clearOutput();
    }

    /**
     * Reset the interpreter environment
     */
    reset() {
        this.interpreter = new Interpreter();
    }
}

/**
 * Create a new ThoughtScript interpreter instance
 * @returns {ThoughtScript} - New ThoughtScript instance
 */
function createInterpreter() {
    return new ThoughtScript();
}

/**
 * Execute ThoughtScript code directly
 * @param {string} source - ThoughtScript source code
 * @returns {any} - Execution result
 */
function execute(source) {
    const ts = new ThoughtScript();
    return ts.run(source);
}

/**
 * Start the ThoughtScript REPL
 */
function startREPL() {
    const repl = new ThoughtScriptREPL();
    repl.start();
}

/**
 * Start the ThoughtScript web server
 * @param {number} port - Port number (default: 3000)
 */
function startServer(port = 3000) {
    const server = new ThoughtScriptServer(port);
    server.start();
    return server;
}

// Export everything
module.exports = {
    // Main class
    ThoughtScript,
    
    // Core components
    Lexer,
    Token,
    Parser,
    Interpreter,
    
    // Interactive components
    ThoughtScriptREPL,
    ThoughtScriptServer,
    
    // Utility functions
    createInterpreter,
    execute,
    startREPL,
    startServer,
    
    // Version info
    version: '1.0.0',
    
    // Language info
    language: {
        name: 'ThoughtScript',
        description: 'A Dynamic Programming Language for Thought-Based Computing',
        version: '1.0.0',
        author: 'ThoughtScript Team',
        keywords: [
            'think', 'express', 'consider', 'if', 'otherwise', 
            'remember', 'show', 'define', 'intention'
        ],
        builtins: [
            'isEven', 'isOdd', 'length', 'type', 'add', 'subtract', 
            'multiply', 'divide', 'uppercase', 'lowercase'
        ]
    }
};

// CLI support - if this file is run directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('🧠 ThoughtScript v1.0.0');
        console.log('Usage:');
        console.log('  node src/index.js repl     - Start interactive REPL');
        console.log('  node src/index.js server   - Start web server');
        console.log('  node src/index.js file.ts  - Execute a file');
        process.exit(0);
    }

    const command = args[0];

    switch (command) {
        case 'repl':
            startREPL();
            break;
            
        case 'server':
            const port = args[1] ? parseInt(args[1]) : 3000;
            startServer(port);
            break;
            
        default:
            // Assume it's a file to execute
            const fs = require('fs');
            const path = require('path');
            
            try {
                const filePath = path.resolve(command);
                const source = fs.readFileSync(filePath, 'utf8');
                const result = execute(source);
                
                if (result !== null && result !== undefined) {
                    console.log('Result:', result);
                }
            } catch (error) {
                console.error('Error:', error.message);
                process.exit(1);
            }
            break;
    }
}