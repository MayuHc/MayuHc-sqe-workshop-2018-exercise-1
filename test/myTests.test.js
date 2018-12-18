import assert from 'assert';
import {parseCode, analyzeParsedCode} from '../src/js/code-analyzer';

// describe('Test function flatArray', () => {
//     it('is flattening an array correctly', () => {
//         assert.deepEqual(
//             flatArray([[1], [2,3], 4]), [1,2,3,4]);
//     });
// });

describe('Test Parsed Code Analyzer', () => {
    it('is analyzing an empty code correctly', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('')),
            []);
    });
});

describe('Test VariableDeclaration', () => {
    it('Is analyzing variable declaration correctly', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('let a = 1;')),
            [{line:1,type:'variable declaration',name:'a',condition:'',value:'1'}]);
    });

    it('is analyzing multiple variable declarations', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('let a,b,c;')),
            [{line:1,type:'variable declaration',name:'a',condition:'',value:null},{line:1,type:'variable declaration',name:'b',condition:'',value:null},{line:1,type:'variable declaration',name:'c',condition:'',value:null}]);
    });
});


describe('Test AssignmentExpression', () => {
    it('is analyzing a simple assignment expression correctly', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('x=3;')),
            [{line:1,type:'assignment expression',name:'x',condition:'',value:'3'}]
        );
    });

    it('is analyzing an array assignment expression correctly', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('arr[0] = x;')),
            [{line:1,type:'assignment expression',name:'arr[0]',condition:'',value:'x'}]
        );
    });
});

describe('Test IfStatement', () => {
    it('is analyzing simple is statement correctly', () => { assert.deepEqual(
        analyzeParsedCode(parseCode('if(x>0){x=0;}')),
        [{line:1,type:'if statement',name:'',condition:'x>0',value:''},{line:1,type:'assignment expression',name:'x',condition:'',value:'0'}]);
    });
    it('is analyzing if else correctly', () => {assert.deepEqual(
        analyzeParsedCode(parseCode('if(x>0)x=0; else x=1;')),
        [{line:1,type:'if statement',name:'',condition:'x>0',value:''},{line:1,type:'assignment expression',name:'x',condition:'',value:'0'},{line:1,type:'assignment expression',name:'x',condition:'',value:'1'}]);
    });
    it('is analyzing if elseif correctly', () => {assert.deepEqual(
        analyzeParsedCode(parseCode('if(x>0)x=0; else if(x==0) x=1; else x=-1;')),
        [{line:1,type:'if statement',name:'',condition:'x>0',value:''},{line:1,type:'assignment expression',name:'x',condition:'',value:'0'},{line:1,type:'else if statement',name:'',condition:'x==0',value:''},{line:1,type:'assignment expression',name:'x',condition:'',value:'1'},{line:1,type:'assignment expression',name:'x',condition:'',value:'-1'}]        );
    });
    it('is analyzing if elseif elseif correctly', () => {assert.deepEqual(
        analyzeParsedCode(parseCode('if(x>0)x=0; else if(x==0) x=1; else if(x<0) x=-1;')),
        [{line:1,type:'if statement',name:'',condition:'x>0',value:''},{line:1,type:'assignment expression',name:'x',condition:'',value:'0'},{line:1,type:'else if statement',name:'',condition:'x==0',value:''},{line:1,type:'assignment expression',name:'x',condition:'',value:'1'},{line:1,type:'else if statement',name:'',condition:'x<0',value:''},{line:1,type:'assignment expression',name:'x',condition:'',value:'-1'}]        );
    });
});

describe('Test ForStatement', () => {
    it('is analyzing a for statement correctly', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('for(i=0;i<10;i++){x=x+1;}')),
            [{line:1,type:'for statement',name:'',condition:'i=0i<10;i++',value:''},{line:1,type:'assignment expression',name:'x',condition:'',value:'x+1'}]
        );
    });
});

describe('TestWhileStatement', () => {
    it('is analyzing a while statement correctly', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('while(j<10){y=y/2;}')),
            [{line:1,type:'while statement',name:'',condition:'j<10',value:''},{line:1,type:'assignment expression',name:'y',condition:'',value:'y/2'}]
        );
    });
});

describe('TestFunctionDeclaration', () => {
    it('is analyzing a function declaration correctly', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('function func(x){return x;}')),
            [{line:1,type:'function declaration',name:'func',condition:'',value:''},{line:1,type:'variable declaration',name:'x',condition:'',value:''},{line:1,type:'return statement',name:'',condition:'',value:'x'}]);
    });
});

describe('TestFunctionDeclaration', () => {
    it('is analyzing a simple function declaration correctly', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('function func(x){return x;}')),
            [{line:1,type:'function declaration',name:'func',condition:'',value:''},{line:1,type:'variable declaration',name:'x',condition:'',value:''},{line:1,type:'return statement',name:'',condition:'',value:'x'}]);
    });

    it('is analyzing an another function declaration with correctly', () => {
        assert.deepEqual(
            analyzeParsedCode(parseCode('function multiply(a,b){let x, y;x = a;y = b;return x+y;}')),
            [{line:1,type:'function declaration',name:'multiply',condition:'',value:''},{line:1,type:'variable declaration',name:'a',condition:'',value:''},{line:1,type:'variable declaration',name:'b',condition:'',value:''},{line:1,type:'variable declaration',name:'x',condition:'',value:null},{line:1,type:'variable declaration',name:'y',condition:'',value:null},{line:1,type:'assignment expression',name:'x',condition:'',value:'a'},{line:1,type:'assignment expression',name:'y',condition:'',value:'b'},{line:1,type:'return statement',name:'',condition:'',value:'x+y'}]);});
});

