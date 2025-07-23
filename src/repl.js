#!/usr/bin/env node

/**
 * ThoughtScript REPL
 * Interactive Read-Eval-Print Loop for ThoughtScript
 */

const readline = require('readline');
const chalk = require('chalk');
const figlet = require('figlet');
const { Interpreter } = require('./interpreter/interpreter');

class ThoughtScriptREPL {
    constructor() {
        this.interpreter = new Interpreter();
        this.history = [];
        this.multilineBuffer = '';
        this.inMultilineMode = false;
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.cyan('think> '),
            historySize: 100
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.rl.on('line', (input) => {
            this.handleInput(input.trim());
        });

        this.rl.on('close', () => {
            console.log(chalk.yellow('\nThought session ended. Goodbye! 🧠'));
            process.exit(0);
        });

        process.on('SIGINT', () => {
            if (this.inMultilineMode) {
                this.inMultilineMode = false;
                this.multilineBuffer = '';
                console.log(chalk.yellow('\nMultiline input cancelled.'));
                this.rl.setPrompt(chalk.cyan('think> '));
                this.rl.prompt();
            } else {
                this.rl.close();
            }
        });
    }

    displayWelcome() {
        console.log(chalk.magenta(figlet.textSync('ThoughtScript', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        })));
        
        console.log(chalk.blue('━'.repeat(60)));
        console.log(chalk.green('Welcome to ThoughtScript - Programming with Natural Thoughts!'));
        console.log(chalk.blue('━'.repeat(60)));
        console.log(chalk.white('Type your thoughts in natural language and watch them come to life.'));
        console.log(chalk.gray('Commands:'));
        console.log(chalk.gray('  .help    - Show help'));
        console.log(chalk.gray('  .clear   - Clear the environment'));
        console.log(chalk.gray('  .history - Show command history'));
        console.log(chalk.gray('  .exit    - Exit the REPL'));
        console.log(chalk.gray('  .example - Show example programs'));
        console.log(chalk.blue('━'.repeat(60)));
        console.log();
    }

    handleInput(input) {
        if (input === '') {
            if (this.inMultilineMode) {
                this.executeMultiline();
                return;
            } else {
                this.rl.prompt();
                return;
            }
        }

        // Handle REPL commands
        if (input.startsWith('.')) {
            this.handleCommand(input);
            return;
        }

        // Check for multiline input (ends with :)
        if (input.endsWith(':') && !this.inMultilineMode) {
            this.multilineBuffer = input + '\n';
            this.inMultilineMode = true;
            this.rl.setPrompt(chalk.yellow('...   '));
            this.rl.prompt();
            return;
        }

        if (this.inMultilineMode) {
            this.multilineBuffer += input + '\n';
            this.rl.prompt();
            return;
        }

        // Execute single line
        this.executeCode(input);
    }

    handleCommand(command) {
        const cmd = command.toLowerCase();
        
        switch (cmd) {
            case '.help':
                this.showHelp();
                break;
            case '.clear':
                this.clearEnvironment();
                break;
            case '.history':
                this.showHistory();
                break;
            case '.exit':
                this.rl.close();
                break;
            case '.example':
                this.showExamples();
                break;
            default:
                console.log(chalk.red(`Unknown command: ${command}`));
                console.log(chalk.gray('Type .help for available commands'));
        }
        
        this.rl.prompt();
    }

    executeCode(code) {
        this.history.push(code);
        
        try {
            const result = this.interpreter.interpret(code);
            
            if (result !== null && result !== undefined) {
                console.log(chalk.green('→'), chalk.white(this.interpreter.thoughtToString(result)));
            }
        } catch (error) {
            console.log(chalk.red('✗ Error:'), chalk.red(error.message));
        }
        
        this.rl.prompt();
    }

    executeMultiline() {
        this.inMultilineMode = false;
        const code = this.multilineBuffer.trim();
        this.multilineBuffer = '';
        this.rl.setPrompt(chalk.cyan('think> '));
        
        if (code) {
            this.executeCode(code);
        } else {
            this.rl.prompt();
        }
    }

    showHelp() {
        console.log(chalk.blue('\n📖 ThoughtScript Help'));
        console.log(chalk.blue('━'.repeat(40)));
        console.log(chalk.white('Basic Syntax:'));
        console.log(chalk.gray('  think <expression> as <variable>  - Declare a variable'));
        console.log(chalk.gray('  express <expression>              - Print to console'));
        console.log(chalk.gray('  consider <var> from <n> to <m>:   - Loop from n to m'));
        console.log(chalk.gray('  if <condition>:                   - Conditional statement'));
        console.log(chalk.gray('  remember <value> as <key>         - Store in memory'));
        console.log(chalk.gray('  show <expression>                 - Display value'));
        console.log(chalk.gray('  show memories                     - Display all memories'));
        
        console.log(chalk.white('\nBuilt-in Functions:'));
        console.log(chalk.gray('  isEven(n), isOdd(n), length(s), type(v)'));
        console.log(chalk.gray('  add(a,b), subtract(a,b), multiply(a,b), divide(a,b)'));
        console.log(chalk.gray('  uppercase(s), lowercase(s)'));
        
        console.log(chalk.white('\nExamples:'));
        console.log(chalk.gray('  think "Hello World" as greeting'));
        console.log(chalk.gray('  express greeting'));
        console.log(chalk.gray('  consider i from 1 to 5:'));
        console.log(chalk.gray('      express i'));
        console.log();
    }

    showExamples() {
        console.log(chalk.blue('\n🌟 Example Programs'));
        console.log(chalk.blue('━'.repeat(40)));
        
        const examples = [
            {
                title: 'Basic Variables',
                code: `think "Hello, ThoughtScript!" as greeting
express greeting`
            },
            {
                title: 'Simple Math',
                code: `think 10 as x
think 20 as y
express add(x, y)`
            },
            {
                title: 'Loops and Conditions',
                code: `consider number from 1 to 10:
    if isEven(number):
        remember number as "even"
    otherwise:
        remember number as "odd"

show memories`
            },
            {
                title: 'Function Definition',
                code: `define intention greet with name:
    think "Hello, " + name + "!" as message
    express message

greet("ThoughtScript")`
            }
        ];

        examples.forEach((example, index) => {
            console.log(chalk.green(`${index + 1}. ${example.title}:`));
            console.log(chalk.gray(example.code));
            console.log();
        });
    }

    showHistory() {
        console.log(chalk.blue('\n📜 Command History'));
        console.log(chalk.blue('━'.repeat(40)));
        
        if (this.history.length === 0) {
            console.log(chalk.gray('No commands in history'));
        } else {
            this.history.forEach((cmd, index) => {
                console.log(chalk.gray(`${index + 1}: ${cmd}`));
            });
        }
        console.log();
    }

    clearEnvironment() {
        this.interpreter = new Interpreter();
        this.history = [];
        console.log(chalk.green('Environment cleared! Starting fresh... 🧼'));
    }

    start() {
        this.displayWelcome();
        this.rl.prompt();
    }
}

// Start the REPL if this file is run directly
if (require.main === module) {
    const repl = new ThoughtScriptREPL();
    repl.start();
}

module.exports = ThoughtScriptREPL;