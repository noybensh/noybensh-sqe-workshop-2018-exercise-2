import assert from 'assert';
import {myMain,parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    /*it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });
*/
    it('is parsing a simple variable declaration correctly', () => {
        let x = 'function f (x, y){\n' +
            'let y = 3 ;\n' +
            ' }';
        let daniel =  parseCode(x);
        let length=  myMain(daniel,'1,2');
        assert.equal(length.length,3);
    });
    it('is parsing a simple variable declaration correctly', () => {
        let f = 'function foo(x, y, z){\n' +
                '    let a = x[2] + 1;\n' +
                '    let b = [3,5,4,5];\n' +
                '    let c = 2;\n' +
                '    let i = 1;\n' +
                '    b[0] = 1;\n' +
                '\n' +
                '    if (b[1] < z) {\n' +
                '        c = c + 8;\n' +
                '        return x[1] + y + z + c;\n' +
                '    } else if (b[0] < z * 2) {\n' +
                '        c = c + x[2] + 2;\n' +
                '        return x + z + c;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '        return x[i] + y + c;\n' +
                '    }\n' +
                '}' ;
        let p = parseCode(f);
        let length = myMain(p, '[1,2,3],2,3');
        assert.equal(length.length,18);
    });


    it('is parsing a simple variable declaration correctly', () => {
        let f = 'let y = 2;\n' +
            '\n' +
            '        function f(x, z) {\n' +
            '            while (x < 10) {\n' +
            '                x = z[1] + 2;\n' +
            '            }\n' +
            '        }';
        let p = parseCode(f);
        let length = myMain(p, '5, [1,2,3]');
        assert.equal(length.length, 7);
    });

    it('is parsing a simple variable declaration correctly', () => {
        let f = ' let y = 2;\n' +
            '    function f (x, z){\n' +
            '        if (x == 1)\n' +
            '            x += 2;\n' +
            '        else\n' +
            '            x-= 1 ;\n' +
            '    }';
        let p = parseCode(f);
        let length = myMain(p, '5, [1,2,3]');
        assert.equal(length.length, 7);
    });

    it('is parsing a simple variable declaration correctly', () => {
        let f = ' let w = [1,2]\n' +
            '    let z = w[0] ;\n' +
            '\n' +
            '    function foo(x,y){\n' +
            '        let a = x + 1;\n' +
            '        let c = w[1];\n' +
            '        return x + c ;\n' +
            '    }';
        let p = parseCode(f);
        let length = myMain(p, '1,2');
        assert.equal(length.length, 8);
    });

    it('is parsing a simple variable declaration correctly', () => {
        let f = 'let w = [1,2]\n' +
            '    let z = w[0] ;\n' +
            '\n' +
            '    function foo(x,y){\n' +
            '        if (x == y)\n' +
            '            z = 3 ;\n' +
            '    }';
        let p = parseCode(f);
        let length = myMain(p, '1,1');
        assert.equal(length.length, 7);
    });

    it('is parsing a simple variable declaration correctly', () => {
        let f = 'function foo(x,y){\n' +
            '        if (x < y)\n' +
            '            return x\n' +
            '        else if (y< x +2)\n' +
            '            return y\n' +
            '    }';
        let p = parseCode(f);
        let length = myMain(p, '2,5');
        assert.equal(length.length, 6);
    });


    it('is parsing a simple variable declaration correctly', () => {
        let f = '  let w = 5 ;\n' +
            '    function foo(x, y){\n' +
            '        let a ;\n' +
            '    }';
        let p = parseCode(f);
        let length = myMain(p, '[1,2,3,4],5');
        assert.equal(length.length, 4);
    });

    it('is parsing a simple variable declaration correctly', () => {
        let f = 'function foo(x, y){\n' +
            'let a \n' +
            'return x + y\n' +
            '}\n';
        let p = parseCode(f);
        let length = myMain(p, '[1,2],5');
        assert.equal(length.length, 5);
    });

    it('is parsing a simple variable declaration correctly', () => {
        let f = 'let w = 5 ;\n' +
            '    function foo(x, y){\n' +
            '        let a = 3 ;\n' +
            '        return a + w + y\n' +
            '    }';
        let p = parseCode(f);
        let length = myMain(p, '1,2');
        assert.equal(length.length, 5);
    });




});
