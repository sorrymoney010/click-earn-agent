/**
 * Basic Tests for ThoughtScript
 */

const { ThoughtScript } = require('../src/index');

describe('ThoughtScript Basic Tests', () => {
    let ts;

    beforeEach(() => {
        ts = new ThoughtScript();
    });

    test('should execute simple think and express', () => {
        const code = `
            think "Hello, World!" as greeting
            express greeting
        `;
        
        const result = ts.run(code);
        const output = ts.getOutput();
        
        expect(output).toContain('Hello, World!');
    });

    test('should handle basic arithmetic', () => {
        const code = `
            think 10 as x
            think 20 as y
            express add(x, y)
        `;
        
        ts.run(code);
        const output = ts.getOutput();
        
        expect(output).toContain('30');
    });

    test('should handle loops correctly', () => {
        const code = `
            consider i from 1 to 3:
                express i
        `;
        
        ts.run(code);
        const output = ts.getOutput();
        
        expect(output).toContain('1');
        expect(output).toContain('2');
        expect(output).toContain('3');
    });

    test('should handle conditionals', () => {
        const code = `
            think 10 as number
            if isEven(number):
                express "even"
            otherwise:
                express "odd"
        `;
        
        ts.run(code);
        const output = ts.getOutput();
        
        expect(output).toContain('even');
    });

    test('should handle memory operations', () => {
        const code = `
            remember "test value" as "test key"
            show memories
        `;
        
        ts.run(code);
        const output = ts.getOutput();
        
        expect(output.some(line => line.includes('test key') && line.includes('test value'))).toBe(true);
    });

    test('should handle string operations', () => {
        const code = `
            think "thoughtscript" as language
            express uppercase(language)
            express length(language)
        `;
        
        ts.run(code);
        const output = ts.getOutput();
        
        expect(output).toContain('THOUGHTSCRIPT');
        expect(output).toContain('13');
    });

    test('should handle errors gracefully', () => {
        const code = `
            express undefinedVariable
        `;
        
        expect(() => {
            ts.run(code);
        }).toThrow();
    });

    test('should support tokenization', () => {
        const code = `think "hello" as greeting`;
        const tokens = ts.tokenize(code);
        
        expect(tokens.length).toBeGreaterThan(0);
        expect(tokens[0].type).toBe('THINK');
    });

    test('should support parsing', () => {
        const code = `think "hello" as greeting`;
        const ast = ts.parse(code);
        
        expect(ast.type).toBe('Program');
        expect(ast.statements.length).toBe(1);
        expect(ast.statements[0].type).toBe('Think');
    });
});

describe('ThoughtScript Built-in Functions', () => {
    let ts;

    beforeEach(() => {
        ts = new ThoughtScript();
    });

    test('isEven should work correctly', () => {
        const code = `
            express isEven(4)
            express isEven(5)
        `;
        
        ts.run(code);
        const output = ts.getOutput();
        
        expect(output).toContain('true');
        expect(output).toContain('false');
    });

    test('isOdd should work correctly', () => {
        const code = `
            express isOdd(3)
            express isOdd(4)
        `;
        
        ts.run(code);
        const output = ts.getOutput();
        
        expect(output).toContain('true');
        expect(output).toContain('false');
    });

    test('math functions should work', () => {
        const code = `
            express add(5, 3)
            express subtract(10, 4)
            express multiply(6, 7)
            express divide(15, 3)
        `;
        
        ts.run(code);
        const output = ts.getOutput();
        
        expect(output).toContain('8');
        expect(output).toContain('6');
        expect(output).toContain('42');
        expect(output).toContain('5');
    });

    test('type function should work', () => {
        const code = `
            express type("hello")
            express type(42)
            express type(true)
        `;
        
        ts.run(code);
        const output = ts.getOutput();
        
        expect(output).toContain('string');
        expect(output).toContain('number');
        expect(output).toContain('boolean');
    });
});