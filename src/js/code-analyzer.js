import * as esprima from 'esprima';

let codeStr;

const parseCode = (codeToParse) => {
    codeStr = codeToParse;
    return esprima.parseScript(codeToParse, {loc:true, range:true});
};


function analyzeParsedCode(parsedCode) {
    return analyzeFunctionsByType[parsedCode.type](parsedCode);
}

const analyzeFunctionsByType = {
    'Program': analyzeProgram,
    'FunctionDeclaration': analyzeFunctionDeclaration,
    'ExpressionStatement': analyzeExpressionStatement,
    'VariableDeclaration': analyzeVariableDeclaration,
    'AssignmentExpression': analyzeAssignmentExpression,
    'BlockStatement': analyzeBlockStatement,
    'WhileStatement': analyzeWhileStatement,
    'ForStatement': analyzeForStatement,
    'IfStatement': analyzeIfStatement,
    'ReturnStatement': analyzeReturnStatement,
};

function createExpressionTableRowData(line, type, name, condition, value) {
    return {line: line, type: type, name: name, condition: condition, value: value};
}

function analyzeProgram(program){
    return flatArray(program.body.map(analyzeParsedCode));
}

function analyzeVariableDeclaration(variableDeclaration) {
    let declarations = variableDeclaration.declarations;
    return declarations.map((declaration) => {
        let init = declaration.init;
        let initVal = null;
        if(init != null){
            initVal = getExpressionString(declaration.init);
        }
        return createExpressionTableRowData(
            declaration.loc.start.line,
            'variable declaration',
            declaration.id.name,
            '',
            initVal
        );
    });
}

function analyzeExpressionStatement(expressionStatement){
    return analyzeParsedCode(expressionStatement.expression);
}

function analyzeAssignmentExpression(assignmentExpression) {
    return createExpressionTableRowData(
        assignmentExpression.loc.start.line,
        'assignment expression',
        getExpressionString(assignmentExpression.left),
        '',
        getExpressionString(assignmentExpression.right)
    );
}

function analyzeFunctionDeclaration(functionDeclaration) {
    let functionDeclarationData =  createExpressionTableRowData(
        functionDeclaration.loc.start.line,
        'function declaration',
        functionDeclaration.id.name,
        '',
        '');
    let functionParamsData = analyzeFunctionParams(functionDeclaration.params);
    let functionBodyData =  analyzeParsedCode(functionDeclaration.body);
    return [].concat(functionDeclarationData, functionParamsData, functionBodyData);

}

function analyzeFunctionParams(functionParams) {
    return functionParams.map((param) => {
        return createExpressionTableRowData(param.loc.start.line, 'variable declaration', param.name, '' , '');
    });
}

function analyzeBlockStatement(blockStatement) {
    return flatArray(blockStatement.body.map(analyzeParsedCode));
}

function analyzeWhileStatement(whileStatement){
    let whileStatementData = createExpressionTableRowData(
        whileStatement.loc.start.line,
        'while statement',
        '',
        getExpressionString(whileStatement.test),
        '');

    return [].concat(whileStatementData, analyzeParsedCode(whileStatement.body));
}

function analyzeForStatement(forStatement){
    let conditionString = getExpressionString(forStatement.init) + getExpressionString(forStatement.test) + ';' + getExpressionString(forStatement.update);
    let forStatementData = createExpressionTableRowData(
        forStatement.loc.start.line,
        'for statement',
        '',
        conditionString,
        '');
    return [].concat(forStatementData, analyzeParsedCode(forStatement.body));
}

function analyzeReturnStatement(returnStatement) {
    return createExpressionTableRowData(
        returnStatement.loc.start.line,
        'return statement',
        '',
        '',
        getExpressionString(returnStatement.argument));
}

function analyzeIfStatement(ifStatement) {
    let ifStatementData = createExpressionTableRowData(
        ifStatement.loc.start.line,
        'if statement',
        '', getExpressionString(ifStatement.test),
        '');
    let consequent = analyzeParsedCode(ifStatement.consequent);
    let alternate = ifStatement.alternate;
    if (alternate != null){
        return [].concat(ifStatementData, consequent, analyzeElseStatement(alternate));
    }
    else{
        return [].concat(ifStatementData, consequent);
    }
}

function analyzeElseStatement(elseStatement) {
    if(elseStatement.test != null) {
        let elseIfStatementData = createExpressionTableRowData(
            elseStatement.loc.start.line,
            'else if statement',
            '', getExpressionString(elseStatement.test),
            '');
        let consequent = analyzeParsedCode(elseStatement.consequent);
        let alternate = elseStatement.alternate;
        if (alternate != null){
            return [].concat(elseIfStatementData, consequent, analyzeElseStatement(alternate));
        }
        else{
            return [].concat(elseIfStatementData, consequent);
        }
    }
    else {
        return analyzeParsedCode(elseStatement);
    }
}

function getExpressionString(parsedCode){
    return codeStr.substring(parsedCode.range[0], parsedCode.range[1]);
}

function flatArray(arr) {
    return arr.reduce(
        (acc, curr)=>{
            return acc.concat(curr);}
        ,[]);
}

export {parseCode, analyzeParsedCode};

