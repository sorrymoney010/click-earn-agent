/**
 * ThoughtScript Interpreter
 * Executes ThoughtScript AST nodes
 */

const { Parser } = require('../parser/parser');

class Environment {
    constructor(parent = null) {
        this.parent = parent;
        this.variables = new Map();
        this.memories = new Map();
    }

    define(name, value) {
        this.variables.set(name, value);
    }

    get(name) {
        if (this.variables.has(name)) {
            return this.variables.get(name);
        }
        if (this.parent) {
            return this.parent.get(name);
        }
        throw new Error(`Undefined variable: ${name}`);
    }

    set(name, value) {
        if (this.variables.has(name)) {
            this.variables.set(name, value);
            return;
        }
        if (this.parent) {
            this.parent.set(name, value);
            return;
        }
        throw new Error(`Undefined variable: ${name}`);
    }

    remember(key, value) {
        this.memories.set(key, value);
    }

    getMemories() {
        const allMemories = new Map();
        if (this.parent) {
            const parentMemories = this.parent.getMemories();
            for (const [key, value] of parentMemories) {
                allMemories.set(key, value);
            }
        }
        for (const [key, value] of this.memories) {
            allMemories.set(key, value);
        }
        return allMemories;
    }
}

class ThoughtFunction {
    constructor(name, params, body, closure) {
        this.name = name;
        this.params = params;
        this.body = body;
        this.closure = closure;
    }

    call(interpreter, args) {
        if (args.length !== this.params.length) {
            throw new Error(`Function ${this.name} expects ${this.params.length} arguments, got ${args.length}`);
        }

        const environment = new Environment(this.closure);
        for (let i = 0; i < this.params.length; i++) {
            environment.define(this.params[i], args[i]);
        }

        try {
            return interpreter.executeBlock(this.body, environment);
        } catch (error) {
            if (error instanceof ReturnValue) {
                return error.value;
            }
            throw error;
        }
    }
}

class ReturnValue extends Error {
    constructor(value) {
        super();
        this.value = value;
    }
}

class Interpreter {
    constructor() {
        this.globals = new Environment();
        this.environment = this.globals;
        this.output = [];
        
        // Define built-in functions
        this.defineBuiltins();
    }

    defineBuiltins() {
        // Built-in math functions
        this.globals.define('add', (a, b) => a + b);
        this.globals.define('subtract', (a, b) => a - b);
        this.globals.define('multiply', (a, b) => a * b);
        this.globals.define('divide', (a, b) => {
            if (b === 0) throw new Error('Division by zero');
            return a / b;
        });

        // Built-in utility functions
        this.globals.define('length', (str) => {
            if (typeof str === 'string') return str.length;
            if (Array.isArray(str)) return str.length;
            throw new Error('Length can only be called on strings or arrays');
        });

        this.globals.define('type', (value) => {
            if (value === null) return 'null';
            if (Array.isArray(value)) return 'array';
            return typeof value;
        });

        this.globals.define('isEven', (num) => {
            if (typeof num !== 'number') throw new Error('isEven requires a number');
            return num % 2 === 0;
        });

        this.globals.define('isOdd', (num) => {
            if (typeof num !== 'number') throw new Error('isOdd requires a number');
            return num % 2 !== 0;
        });

        // String functions
        this.globals.define('uppercase', (str) => {
            if (typeof str !== 'string') throw new Error('uppercase requires a string');
            return str.toUpperCase();
        });

        this.globals.define('lowercase', (str) => {
            if (typeof str !== 'string') throw new Error('lowercase requires a string');
            return str.toLowerCase();
        });
    }

    interpret(source) {
        const parser = new Parser(source);
        const ast = parser.parse();
        this.output = [];
        return this.execute(ast);
    }

    execute(node) {
        switch (node.type) {
            case 'Program':
                return this.executeProgram(node);
            case 'Think':
                return this.executeThink(node);
            case 'Express':
                return this.executeExpress(node);
            case 'Consider':
                return this.executeConsider(node);
            case 'If':
                return this.executeIf(node);
            case 'Remember':
                return this.executeRemember(node);
            case 'Show':
                return this.executeShow(node);
            case 'BinaryOp':
                return this.executeBinaryOp(node);
            case 'UnaryOp':
                return this.executeUnaryOp(node);
            case 'Literal':
                return this.executeLiteral(node);
            case 'Identifier':
                return this.executeIdentifier(node);
            case 'Call':
                return this.executeCall(node);
            case 'Intention':
                return this.executeIntention(node);
            case 'Block':
                return this.executeBlock(node);
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    executeProgram(node) {
        let result = null;
        for (const statement of node.statements) {
            result = this.execute(statement);
        }
        return result;
    }

    executeThink(node) {
        const value = this.execute(node.expression);
        if (node.variable) {
            this.environment.define(node.variable, value);
        }
        return value;
    }

    executeExpress(node) {
        const value = this.execute(node.expression);
        const output = this.thoughtToString(value);
        this.output.push(output);
        console.log(output);
        return value;
    }

    executeConsider(node) {
        const start = this.execute(node.start);
        const end = this.execute(node.end);
        
        if (typeof start !== 'number' || typeof end !== 'number') {
            throw new Error('Consider loop bounds must be numbers');
        }

        const previousEnv = this.environment;
        this.environment = new Environment(previousEnv);

        for (let i = start; i <= end; i++) {
            this.environment.define(node.variable, i);
            this.executeBlock(node.body);
        }

        this.environment = previousEnv;
        return null;
    }

    executeIf(node) {
        const condition = this.execute(node.condition);
        
        if (this.isTruthy(condition)) {
            return this.executeBlock(node.thenBody);
        } else if (node.elseBody) {
            return this.executeBlock(node.elseBody);
        }
        
        return null;
    }

    executeRemember(node) {
        const value = this.execute(node.value);
        const key = this.execute(node.key);
        const keyString = this.thoughtToString(key);
        
        this.environment.remember(keyString, value);
        return value;
    }

    executeShow(node) {
        const target = this.execute(node.target);
        
        if (node.target.type === 'Identifier' && node.target.name === 'memories') {
            const memories = this.environment.getMemories();
            const output = this.formatMemories(memories);
            this.output.push(output);
            console.log(output);
            return Array.from(memories.entries());
        } else {
            const output = this.thoughtToString(target);
            this.output.push(output);
            console.log(output);
            return target;
        }
    }

    executeBinaryOp(node) {
        const left = this.execute(node.left);
        const right = this.execute(node.right);

        switch (node.operator) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                if (right === 0) throw new Error('Division by zero');
                return left / right;
            case '<':
                return left < right;
            case '>':
                return left > right;
            case '<=':
                return left <= right;
            case '>=':
                return left >= right;
            case '==':
            case 'is':
                return this.isEqual(left, right);
            case '!=':
                return !this.isEqual(left, right);
            case 'and':
                return this.isTruthy(left) && this.isTruthy(right);
            case 'or':
                return this.isTruthy(left) || this.isTruthy(right);
            default:
                throw new Error(`Unknown binary operator: ${node.operator}`);
        }
    }

    executeUnaryOp(node) {
        const operand = this.execute(node.operand);

        switch (node.operator) {
            case '-':
                if (typeof operand !== 'number') {
                    throw new Error('Unary minus can only be applied to numbers');
                }
                return -operand;
            case 'not':
                return !this.isTruthy(operand);
            default:
                throw new Error(`Unknown unary operator: ${node.operator}`);
        }
    }

    executeLiteral(node) {
        return node.value;
    }

    executeIdentifier(node) {
        if (node.name === 'memories') {
            return this.environment.getMemories();
        }
        return this.environment.get(node.name);
    }

    executeCall(node) {
        const func = this.environment.get(node.name);
        const args = node.args.map(arg => this.execute(arg));

        if (typeof func === 'function') {
            return func(...args);
        } else if (func instanceof ThoughtFunction) {
            return func.call(this, args);
        } else {
            throw new Error(`${node.name} is not a function`);
        }
    }

    executeIntention(node) {
        const func = new ThoughtFunction(node.name, node.params, node.body, this.environment);
        this.environment.define(node.name, func);
        return func;
    }

    executeBlock(node, environment = null) {
        const previousEnv = this.environment;
        
        if (environment) {
            this.environment = environment;
        } else {
            this.environment = new Environment(previousEnv);
        }

        let result = null;
        for (const statement of node.statements) {
            result = this.execute(statement);
        }

        this.environment = previousEnv;
        return result;
    }

    // Helper methods
    isTruthy(value) {
        if (value === null || value === false) return false;
        if (value === 0 || value === '') return false;
        return true;
    }

    isEqual(left, right) {
        if (left === null && right === null) return true;
        if (left === null || right === null) return false;
        return left === right;
    }

    thoughtToString(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return value;
        if (typeof value === 'boolean') return value.toString();
        if (typeof value === 'number') return value.toString();
        if (Array.isArray(value)) return '[' + value.map(v => this.thoughtToString(v)).join(', ') + ']';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }

    formatMemories(memories) {
        if (memories.size === 0) {
            return 'No memories stored';
        }

        const formatted = [];
        for (const [key, value] of memories) {
            formatted.push(`${key}: ${this.thoughtToString(value)}`);
        }
        return 'Memories:\n' + formatted.join('\n');
    }

    getOutput() {
        return this.output;
    }

    clearOutput() {
        this.output = [];
    }
}

module.exports = { Interpreter, Environment, ThoughtFunction };