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


});
