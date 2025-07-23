/**
 * ThoughtScript Lexer
 * Tokenizes ThoughtScript source code into meaningful tokens
 */

class Token {
    constructor(type, value, line = 1, column = 1) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }
}

class Lexer {
    constructor(source) {
        this.source = source;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        
        // ThoughtScript keywords
        this.keywords = {
            'think': 'THINK',
            'express': 'EXPRESS',
            'consider': 'CONSIDER',
            'if': 'IF',
            'otherwise': 'OTHERWISE',
            'remember': 'REMEMBER',
            'show': 'SHOW',
            'as': 'AS',
            'from': 'FROM',
            'to': 'TO',
            'is': 'IS',
            'not': 'NOT',
            'and': 'AND',
            'or': 'OR',
            'in': 'IN',
            'true': 'TRUE',
            'false': 'FALSE',
            'null': 'NULL',
            'define': 'DEFINE',
            'intention': 'INTENTION',
            'with': 'WITH',
            'return': 'RETURN',
            'break': 'BREAK',
            'continue': 'CONTINUE',
            'memories': 'MEMORIES',
            'even': 'EVEN',
            'odd': 'ODD',
            'while': 'WHILE',
            'for': 'FOR',
            'each': 'EACH'
        };
    }

    currentChar() {
        if (this.position >= this.source.length) {
            return null;
        }
        return this.source[this.position];
    }

    peek(offset = 1) {
        const peekPos = this.position + offset;
        if (peekPos >= this.source.length) {
            return null;
        }
        return this.source[peekPos];
    }

    advance() {
        if (this.position < this.source.length && this.source[this.position] === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        this.position++;
    }

    skipWhitespace() {
        while (this.currentChar() && /\s/.test(this.currentChar()) && this.currentChar() !== '\n') {
            this.advance();
        }
    }

    skipComment() {
        if (this.currentChar() === '#') {
            while (this.currentChar() && this.currentChar() !== '\n') {
                this.advance();
            }
        }
    }

    readString() {
        let value = '';
        const quote = this.currentChar();
        this.advance(); // Skip opening quote

        while (this.currentChar() && this.currentChar() !== quote) {
            if (this.currentChar() === '\\') {
                this.advance();
                const escaped = this.currentChar();
                switch (escaped) {
                    case 'n': value += '\n'; break;
                    case 't': value += '\t'; break;
                    case 'r': value += '\r'; break;
                    case '\\': value += '\\'; break;
                    case '"': value += '"'; break;
                    case "'": value += "'"; break;
                    default: value += escaped; break;
                }
            } else {
                value += this.currentChar();
            }
            this.advance();
        }

        if (this.currentChar() === quote) {
            this.advance(); // Skip closing quote
        }

        return value;
    }

    readNumber() {
        let value = '';
        let hasDot = false;

        while (this.currentChar() && (/\d/.test(this.currentChar()) || this.currentChar() === '.')) {
            if (this.currentChar() === '.') {
                if (hasDot) break;
                hasDot = true;
            }
            value += this.currentChar();
            this.advance();
        }

        return hasDot ? parseFloat(value) : parseInt(value);
    }

    readIdentifier() {
        let value = '';

        while (this.currentChar() && (/\w/.test(this.currentChar()) || this.currentChar() === '_')) {
            value += this.currentChar();
            this.advance();
        }

        return value;
    }

    tokenize() {
        while (this.position < this.source.length) {
            const char = this.currentChar();

            if (!char) break;

            // Skip whitespace except newlines
            if (/\s/.test(char) && char !== '\n') {
                this.skipWhitespace();
                continue;
            }

            // Handle newlines
            if (char === '\n') {
                this.tokens.push(new Token('NEWLINE', '\\n', this.line, this.column));
                this.advance();
                continue;
            }

            // Handle comments
            if (char === '#') {
                this.skipComment();
                continue;
            }

            // Handle strings
            if (char === '"' || char === "'") {
                const stringValue = this.readString();
                this.tokens.push(new Token('STRING', stringValue, this.line, this.column));
                continue;
            }

            // Handle numbers
            if (/\d/.test(char)) {
                const numberValue = this.readNumber();
                this.tokens.push(new Token('NUMBER', numberValue, this.line, this.column));
                continue;
            }

            // Handle identifiers and keywords
            if (/[a-zA-Z_]/.test(char)) {
                const identifier = this.readIdentifier();
                const tokenType = this.keywords[identifier.toLowerCase()] || 'IDENTIFIER';
                this.tokens.push(new Token(tokenType, identifier, this.line, this.column));
                continue;
            }

            // Handle operators and punctuation
            switch (char) {
                case ':':
                    this.tokens.push(new Token('COLON', ':', this.line, this.column));
                    this.advance();
                    break;
                case '(':
                    this.tokens.push(new Token('LPAREN', '(', this.line, this.column));
                    this.advance();
                    break;
                case ')':
                    this.tokens.push(new Token('RPAREN', ')', this.line, this.column));
                    this.advance();
                    break;
                case '[':
                    this.tokens.push(new Token('LBRACKET', '[', this.line, this.column));
                    this.advance();
                    break;
                case ']':
                    this.tokens.push(new Token('RBRACKET', ']', this.line, this.column));
                    this.advance();
                    break;
                case '{':
                    this.tokens.push(new Token('LBRACE', '{', this.line, this.column));
                    this.advance();
                    break;
                case '}':
                    this.tokens.push(new Token('RBRACE', '}', this.line, this.column));
                    this.advance();
                    break;
                case ',':
                    this.tokens.push(new Token('COMMA', ',', this.line, this.column));
                    this.advance();
                    break;
                case '.':
                    this.tokens.push(new Token('DOT', '.', this.line, this.column));
                    this.advance();
                    break;
                case '+':
                    this.tokens.push(new Token('PLUS', '+', this.line, this.column));
                    this.advance();
                    break;
                case '-':
                    this.tokens.push(new Token('MINUS', '-', this.line, this.column));
                    this.advance();
                    break;
                case '*':
                    this.tokens.push(new Token('MULTIPLY', '*', this.line, this.column));
                    this.advance();
                    break;
                case '/':
                    this.tokens.push(new Token('DIVIDE', '/', this.line, this.column));
                    this.advance();
                    break;
                case '=':
                    if (this.peek() === '=') {
                        this.advance();
                        this.advance();
                        this.tokens.push(new Token('EQUALS', '==', this.line, this.column));
                    } else {
                        this.tokens.push(new Token('ASSIGN', '=', this.line, this.column));
                        this.advance();
                    }
                    break;
                case '!':
                    if (this.peek() === '=') {
                        this.advance();
                        this.advance();
                        this.tokens.push(new Token('NOT_EQUALS', '!=', this.line, this.column));
                    } else {
                        this.tokens.push(new Token('NOT', '!', this.line, this.column));
                        this.advance();
                    }
                    break;
                case '<':
                    if (this.peek() === '=') {
                        this.advance();
                        this.advance();
                        this.tokens.push(new Token('LESS_EQUAL', '<=', this.line, this.column));
                    } else {
                        this.tokens.push(new Token('LESS', '<', this.line, this.column));
                        this.advance();
                    }
                    break;
                case '>':
                    if (this.peek() === '=') {
                        this.advance();
                        this.advance();
                        this.tokens.push(new Token('GREATER_EQUAL', '>=', this.line, this.column));
                    } else {
                        this.tokens.push(new Token('GREATER', '>', this.line, this.column));
                        this.advance();
                    }
                    break;
                default:
                    throw new Error(`Unexpected character '${char}' at line ${this.line}, column ${this.column}`);
            }
        }

        this.tokens.push(new Token('EOF', null, this.line, this.column));
        return this.tokens;
    }
}

module.exports = { Lexer, Token };