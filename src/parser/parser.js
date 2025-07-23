/**
 * ThoughtScript Parser
 * Builds Abstract Syntax Tree from tokens
 */

const { Lexer } = require('./lexer');

// AST Node Types
class ASTNode {
    constructor(type) {
        this.type = type;
    }
}

class ProgramNode extends ASTNode {
    constructor(statements = []) {
        super('Program');
        this.statements = statements;
    }
}

class ThinkNode extends ASTNode {
    constructor(expression, variable) {
        super('Think');
        this.expression = expression;
        this.variable = variable;
    }
}

class ExpressNode extends ASTNode {
    constructor(expression) {
        super('Express');
        this.expression = expression;
    }
}

class ConsiderNode extends ASTNode {
    constructor(variable, start, end, body) {
        super('Consider');
        this.variable = variable;
        this.start = start;
        this.end = end;
        this.body = body;
    }
}

class IfNode extends ASTNode {
    constructor(condition, thenBody, elseBody = null) {
        super('If');
        this.condition = condition;
        this.thenBody = thenBody;
        this.elseBody = elseBody;
    }
}

class RememberNode extends ASTNode {
    constructor(value, key) {
        super('Remember');
        this.value = value;
        this.key = key;
    }
}

class ShowNode extends ASTNode {
    constructor(target) {
        super('Show');
        this.target = target;
    }
}

class BinaryOpNode extends ASTNode {
    constructor(left, operator, right) {
        super('BinaryOp');
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}

class UnaryOpNode extends ASTNode {
    constructor(operator, operand) {
        super('UnaryOp');
        this.operator = operator;
        this.operand = operand;
    }
}

class LiteralNode extends ASTNode {
    constructor(value, dataType) {
        super('Literal');
        this.value = value;
        this.dataType = dataType;
    }
}

class IdentifierNode extends ASTNode {
    constructor(name) {
        super('Identifier');
        this.name = name;
    }
}

class CallNode extends ASTNode {
    constructor(name, args = []) {
        super('Call');
        this.name = name;
        this.args = args;
    }
}

class IntentionNode extends ASTNode {
    constructor(name, params, body) {
        super('Intention');
        this.name = name;
        this.params = params;
        this.body = body;
    }
}

class BlockNode extends ASTNode {
    constructor(statements = []) {
        super('Block');
        this.statements = statements;
    }
}

class Parser {
    constructor(source) {
        const lexer = new Lexer(source);
        this.tokens = lexer.tokenize();
        this.position = 0;
        this.currentToken = this.tokens[0] || null;
    }

    error(message) {
        const token = this.currentToken;
        throw new Error(`Parse error at line ${token?.line || 'EOF'}, column ${token?.column || 'EOF'}: ${message}`);
    }

    advance() {
        this.position++;
        this.currentToken = this.tokens[this.position] || null;
    }

    expect(tokenType) {
        if (!this.currentToken || this.currentToken.type !== tokenType) {
            this.error(`Expected ${tokenType}, got ${this.currentToken?.type || 'EOF'}`);
        }
        const token = this.currentToken;
        this.advance();
        return token;
    }

    skipNewlines() {
        while (this.currentToken && this.currentToken.type === 'NEWLINE') {
            this.advance();
        }
    }

    parse() {
        return this.parseProgram();
    }

    parseProgram() {
        const statements = [];
        this.skipNewlines();

        while (this.currentToken && this.currentToken.type !== 'EOF') {
            const stmt = this.parseStatement();
            if (stmt) {
                statements.push(stmt);
            }
            this.skipNewlines();
        }

        return new ProgramNode(statements);
    }

    parseStatement() {
        if (!this.currentToken) return null;

        this.skipNewlines();

        switch (this.currentToken.type) {
            case 'THINK':
                return this.parseThink();
            case 'EXPRESS':
                return this.parseExpress();
            case 'CONSIDER':
                return this.parseConsider();
            case 'IF':
                return this.parseIf();
            case 'REMEMBER':
                return this.parseRemember();
            case 'SHOW':
                return this.parseShow();
            case 'DEFINE':
                return this.parseIntention();
            default:
                // Expression statement
                const expr = this.parseExpression();
                return expr;
        }
    }

    parseThink() {
        this.expect('THINK');
        const expression = this.parseExpression();
        
        let variable = null;
        if (this.currentToken && this.currentToken.type === 'AS') {
            this.advance(); // consume 'as'
            variable = this.expect('IDENTIFIER').value;
        }

        return new ThinkNode(expression, variable);
    }

    parseExpress() {
        this.expect('EXPRESS');
        const expression = this.parseExpression();
        return new ExpressNode(expression);
    }

    parseConsider() {
        this.expect('CONSIDER');
        const variable = this.expect('IDENTIFIER').value;
        this.expect('FROM');
        const start = this.parseExpression();
        this.expect('TO');
        const end = this.parseExpression();
        this.expect('COLON');
        
        this.skipNewlines();
        const body = this.parseBlock();
        
        return new ConsiderNode(variable, start, end, body);
    }

    parseIf() {
        this.expect('IF');
        const condition = this.parseExpression();
        this.expect('COLON');
        
        this.skipNewlines();
        const thenBody = this.parseBlock();
        
        let elseBody = null;
        if (this.currentToken && this.currentToken.type === 'OTHERWISE') {
            this.advance();
            this.expect('COLON');
            this.skipNewlines();
            elseBody = this.parseBlock();
        }

        return new IfNode(condition, thenBody, elseBody);
    }

    parseRemember() {
        this.expect('REMEMBER');
        const value = this.parseExpression();
        this.expect('AS');
        const key = this.parseExpression();
        return new RememberNode(value, key);
    }

    parseShow() {
        this.expect('SHOW');
        const target = this.parseExpression();
        return new ShowNode(target);
    }

    parseIntention() {
        this.expect('DEFINE');
        this.expect('INTENTION');
        const name = this.expect('IDENTIFIER').value;
        
        const params = [];
        if (this.currentToken && this.currentToken.type === 'WITH') {
            this.advance();
            // Parse parameter list
            params.push(this.expect('IDENTIFIER').value);
            while (this.currentToken && this.currentToken.type === 'COMMA') {
                this.advance();
                params.push(this.expect('IDENTIFIER').value);
            }
        }
        
        this.expect('COLON');
        this.skipNewlines();
        const body = this.parseBlock();
        
        return new IntentionNode(name, params, body);
    }

    parseBlock() {
        const statements = [];
        let indentLevel = this.getCurrentIndentLevel();
        
        while (this.currentToken && this.currentToken.type !== 'EOF') {
            this.skipNewlines();
            
            if (!this.currentToken || this.currentToken.type === 'EOF') break;
            
            const currentIndent = this.getCurrentIndentLevel();
            if (currentIndent <= indentLevel && statements.length > 0) {
                break;
            }
            
            const stmt = this.parseStatement();
            if (stmt) {
                statements.push(stmt);
            }
        }
        
        return new BlockNode(statements);
    }

    getCurrentIndentLevel() {
        // Simple indentation detection - count spaces at beginning of line
        // This is a simplified version; a real implementation would need better handling
        return 0;
    }

    parseExpression() {
        return this.parseLogicalOr();
    }

    parseLogicalOr() {
        let expr = this.parseLogicalAnd();

        while (this.currentToken && this.currentToken.type === 'OR') {
            const operator = this.currentToken.value;
            this.advance();
            const right = this.parseLogicalAnd();
            expr = new BinaryOpNode(expr, operator, right);
        }

        return expr;
    }

    parseLogicalAnd() {
        let expr = this.parseEquality();

        while (this.currentToken && this.currentToken.type === 'AND') {
            const operator = this.currentToken.value;
            this.advance();
            const right = this.parseEquality();
            expr = new BinaryOpNode(expr, operator, right);
        }

        return expr;
    }

    parseEquality() {
        let expr = this.parseComparison();

        while (this.currentToken && ['EQUALS', 'NOT_EQUALS', 'IS'].includes(this.currentToken.type)) {
            const operator = this.currentToken.value;
            this.advance();
            const right = this.parseComparison();
            expr = new BinaryOpNode(expr, operator, right);
        }

        return expr;
    }

    parseComparison() {
        let expr = this.parseTerm();

        while (this.currentToken && ['LESS', 'GREATER', 'LESS_EQUAL', 'GREATER_EQUAL'].includes(this.currentToken.type)) {
            const operator = this.currentToken.value;
            this.advance();
            const right = this.parseTerm();
            expr = new BinaryOpNode(expr, operator, right);
        }

        return expr;
    }

    parseTerm() {
        let expr = this.parseFactor();

        while (this.currentToken && ['PLUS', 'MINUS'].includes(this.currentToken.type)) {
            const operator = this.currentToken.value;
            this.advance();
            const right = this.parseFactor();
            expr = new BinaryOpNode(expr, operator, right);
        }

        return expr;
    }

    parseFactor() {
        let expr = this.parseUnary();

        while (this.currentToken && ['MULTIPLY', 'DIVIDE'].includes(this.currentToken.type)) {
            const operator = this.currentToken.value;
            this.advance();
            const right = this.parseUnary();
            expr = new BinaryOpNode(expr, operator, right);
        }

        return expr;
    }

    parseUnary() {
        if (this.currentToken && ['MINUS', 'NOT'].includes(this.currentToken.type)) {
            const operator = this.currentToken.value;
            this.advance();
            const operand = this.parseUnary();
            return new UnaryOpNode(operator, operand);
        }

        return this.parsePrimary();
    }

    parsePrimary() {
        if (!this.currentToken) {
            this.error('Unexpected end of input');
        }

        switch (this.currentToken.type) {
            case 'NUMBER':
                const num = this.currentToken.value;
                this.advance();
                return new LiteralNode(num, 'number');

            case 'STRING':
                const str = this.currentToken.value;
                this.advance();
                return new LiteralNode(str, 'string');

            case 'TRUE':
                this.advance();
                return new LiteralNode(true, 'boolean');

            case 'FALSE':
                this.advance();
                return new LiteralNode(false, 'boolean');

            case 'NULL':
                this.advance();
                return new LiteralNode(null, 'null');

            case 'IDENTIFIER':
                const name = this.currentToken.value;
                this.advance();
                
                // Check for function call
                if (this.currentToken && this.currentToken.type === 'LPAREN') {
                    this.advance(); // consume '('
                    const args = [];
                    
                    if (this.currentToken && this.currentToken.type !== 'RPAREN') {
                        args.push(this.parseExpression());
                        while (this.currentToken && this.currentToken.type === 'COMMA') {
                            this.advance();
                            args.push(this.parseExpression());
                        }
                    }
                    
                    this.expect('RPAREN');
                    return new CallNode(name, args);
                }
                
                return new IdentifierNode(name);

            case 'LPAREN':
                this.advance();
                const expr = this.parseExpression();
                this.expect('RPAREN');
                return expr;

            case 'MEMORIES':
                this.advance();
                return new IdentifierNode('memories');

            case 'EVEN':
                this.advance();
                return new LiteralNode('even', 'string');

            case 'ODD':
                this.advance();
                return new LiteralNode('odd', 'string');

            default:
                this.error(`Unexpected token: ${this.currentToken.type}`);
        }
    }
}

module.exports = {
    Parser,
    ProgramNode,
    ThinkNode,
    ExpressNode,
    ConsiderNode,
    IfNode,
    RememberNode,
    ShowNode,
    BinaryOpNode,
    UnaryOpNode,
    LiteralNode,
    IdentifierNode,
    CallNode,
    IntentionNode,
    BlockNode
};