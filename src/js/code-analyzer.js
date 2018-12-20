import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
export {parseCode};
export {first};
export {printCode};
export {myMain};



//let j ;
let myBody = [];
let myParams = [];
//let myFunctions = [];
let place ;
let inputVec = {} ;
let paramsOrder = {} ;
let localDec = {} ;
let lines = [];
let content ;


function constructor(){
    place = 0 ; // j = 1 ;
    myBody = new Array();
    myParams = new Array();
    //myFunctions = new Array();
    content = null;
}


const parseCode = (codeToParse) => {
    lines = new Array();
    lines = codeToParse.split('\n') ;
    return esprima.parseScript(codeToParse, {loc:true});
};


const myMain = (parseCode, argValue)=>{
    constructor();
    let argumentsVal = esprima.parseScript(argValue);
    first(parseCode, argumentsVal);
    return lines ;
};

const first = (parseCode, argumentsVal)=>{
    let codeLen = 0 ;
    while ( codeLen < parseCode.body.length) {
        if (parseCode.body.length > 0 && parseCode.body[codeLen].type == 'FunctionDeclaration') {
            myBody = parseCode.body[codeLen].body.body;
            myParams = parseCode.body[codeLen].params;
            //myFunctions = parseCode.body[codeLen];
            paramsDec(myParams, argumentsVal);
            myParse(myBody, 0, false);
            codeLen ++ ;}
        else {
            myBody = parseCode.body;
            if (codeLen > place)
                place = codeLen ;
            codeLen = myParse(myBody, place, true);
            place = codeLen + 1 ;
        }
    }
};


const myParse = (parseCode, i , global) => {
    for (i ; i <parseCode.length ; i++){
        let statment =  parseCode[i].type;
        if (statment == 'FunctionDeclaration')
            return i;
        else if (statment == 'VariableDeclaration'){
            VariableDec(parseCode, i, global);
            continue;}
        else if (statment == 'ExpressionStatement'){
            AssignmentExp (parseCode[i].expression, global);
            continue;}
        else{
            myParse2(parseCode, i, global);
            continue; }
    }
    return i ;
};


const myParse2 = (parseCode, i, global) => {
    let statment =  parseCode[i].type;
    if (statment == 'IfStatement'){
        IfState(parseCode[i], i, global);
        return ;}
    else if (statment == 'WhileStatement'){
        WhileState(parseCode[i], global);
        return ;}
    else if (statment == 'ReturnStatement'){
        ReturnState(parseCode, i);
        return;}
    else if (statment == 'BlockStatement'){
        let temp = copyDict(localDec);
        myParse(parseCode[i].body, 0, global);
        localDec = deepcopy(temp);
        return;}
    else{
        return ; }
};


function paramsDec(myParams, argumentsVal) {
    let k = 0 ;
    while (k < myParams.length) {
        paramsOrder[k] = myParams[k].name;
        if (argumentsVal.body[0].expression.expressions[k].type == 'ArrayExpression'){
            rigth(argumentsVal.body[0].expression.expressions[k], paramsOrder[k], true) ;}
        else inputVec[myParams[k].name] = rigth(argumentsVal.body[0].expression.expressions[k], paramsOrder[k], true) ;
        k++;
    }
}

//variable declaration
function VariableDec (parseCode, i, global) {
    let k = 0 ;
    let value ; let name ;
    while (k < parseCode[i].declarations.length) {
        name = parseCode[i].declarations[k].id.name ;
        //value
        if (parseCode[i].declarations[k].init == null){
            value = null; }
        else {value = rigth(parseCode[i].declarations[k].init, name, global, name, value, k) ;}
        //insert into dict
        VariableDecInsertToDict(parseCode, i, global, name, value, k);
        k++;
    }}


function VariableDecInsertToDict(parseCode, i, global, name, value, k){
    if (global == true){
        inputVec[name] = value;
    }
    else {
        if (parseCode[i].declarations[k].init.type != 'ArrayExpression')
            localDec[name] = value ;
        if (!(inputVec.hasOwnProperty(parseCode[i].declarations[k].id.name)))
            lines[(parseCode[i].loc.start.line)-1] = '~' ;
    }
}

//assignment expression
function AssignmentExp (parseCode, global) {
    /*if (parseCode.type == 'UpdateExpression'){
        updateState(parseCode, global);
        return;}
    */let value ;
    let name = parseCode.left.name;
    if (parseCode.left.type =='MemberExpression'){
        name = parseCode.left.object.name + '['+parseCode.left.property.value+']';
    }
    //value value
    if (parseCode.operator == '+='){
        value = name+' + '+  rigth (parseCode.right) ;}
    else if (parseCode.operator == '-=')   {
        value = name+' - '+  rigth (parseCode.right) ;}
    else{ value = rigth (parseCode.right);}

    AssignmentExpInsertToDict(parseCode, global, name, value);
}


function AssignmentExpInsertToDict (parseCode, global, name, value ){
    if (global == true){
        inputVec[name] = value;}
    else {
        if (!(inputVec.hasOwnProperty(name))){
            localDec[name] = value ;
            lines[(parseCode.loc.start.line)-1] = '~' ; }
        else {
            inputVec[name] = value ;
            lines[(parseCode.loc.start.line)-1] = name + ' = ' + value ; } }
}


/*function updateState(parseCode, global) {
    let value ;
    //value
    /*if (updateVal(parseCode) == null){
        value = null; }
    else {value = updateVal(parseCode) ; }
*/
//insert into dict
/*  if (global == true){
        inputVec[parseCode.argument.name] = value;}
    else {
        localDec[parseCode.argument.name] = value ;
        if (!(inputVec.hasOwnProperty(parseCode.argument.name)))
            lines[(parseCode.loc.start.line)-1] = '~'; }
}
*/
function rigth (parseCode, nameArray, global){
    let state = parseCode.type ;
    if (state =='Literal'){     //number
        return parseCode.value;}
    else if (state =='Identifier'){     //name
        if (inputVec.hasOwnProperty(parseCode.name))
            return parseCode.name ;
        else return ('( ' + localDec[parseCode.name] + ' )');}
    else if (state == 'BinaryExpression'){
        return calculateBinary (escodegen.generate(parseCode));}
    else return rigthCon(parseCode, nameArray, global, state);

}

function rigthCon (parseCode, nameArray, global, state){
    if (state == 'MemberExpression'){ return calculateArray(parseCode);}
    else if (state == 'ArrayExpression'){return entereArray(parseCode, nameArray, global);}
    else return ;
}


function calculateBinary(parseCode) {
    let splitArray = new Array () ;
    splitArray = parseCode.split(' ');
    let str = '';
    for (let c = 0 ; c < splitArray.length ; c++){
        if (localDec.hasOwnProperty(splitArray[c]))
            splitArray[c] = '( ' + localDec[splitArray[c]] + ' )';
        str =  str + splitArray[c] + ' ' ;
    }
    return str ;
}


function calculateArray(parseCode, global){
    if (parseCode.property.type== 'SequenceExpression'){
        let splitArr = parseCode.property.expressions;
        for (let c = 0 ; c <splitArr.length ; c ++){
            let name = parseCode.object.name + '['+c+']';
            localDec[name] = rigth(parseCode.property.expressions[c], parseCode.object.name, global );
        }
    }
    else return parseCode.object.name + '[' + rigth(parseCode.property, parseCode.object.name, global ) + ']' ;
}


function entereArray(parseCode, arrayName, global){
    let splitArr = parseCode.elements;
    for (let c = 0 ; c <splitArr.length ; c ++){
        let name = arrayName + '['+ c + ']';
        if (global)
            inputVec[name] = rigth(parseCode.elements[c], arrayName, global);
        else localDec[name] = rigth(parseCode.elements[c], arrayName, global);
    }
}

function IfState (parseCode, i, global){
    let tempDict = deepcopy(localDec) ;
    let condition = conditionParse (parseCode);
    let content = ifWhileLine (parseCode, condition);
    let green = conditionParseToEval(parseCode) ;
    if (green)//green
        lines[(parseCode.loc.start.line)-1] = '$'+ content;
    else //red
        lines[(parseCode.loc.start.line)-1] = '@'+ content;
    let a=[];
    a.push(parseCode.consequent);
    if (parseCode.type == 'BlockStatement'|| a[0].type == 'BlockStatement'){
        myParse(a[0].body, 0, global);}
    else myParse(a, i, global, true);
    localDec = deepcopy(tempDict) ;
    if (parseCode.alternate!= null){
        elseState(parseCode.alternate, global);}


}

function elseState (parseCode, global){
    let a=[];
    let line = parseCode.loc.start.line ;
    if (parseCode.type =='IfStatement'){    //'else if statement'
        let tempLocalDictIfElse = deepcopy(localDec);
        let condition = conditionParse (parseCode);
        let content = ifWhileLine(parseCode, condition);
        if (conditionParseToEval(parseCode)) lines[line-1] = '$'+ content;
        else lines[line-1] = '@'+ content;
        a.push(parseCode.consequent);
        localDec = deepcopy(tempLocalDictIfElse); }
    else{                      //else statement
        let tempLocalElse = deepcopy(localDec);
        a.push(parseCode);
        localDec = deepcopy(tempLocalElse);}
    if (parseCode.alternate != null){
        a.push(parseCode.alternate);}
    let tempDec = deepcopy(localDec);
    myParse(a, 0, global);
    localDec = deepcopy(tempDec);}

function copyDict() {
    let tempSaveDict =deepcopy(localDec);
    return tempSaveDict ;
}


const deepcopy = (validJSON) => {
    return JSON.parse(JSON.stringify(validJSON));
};


function WhileState (parseCode, global) {
    let condition = conditionParse (parseCode);
    let content = ifWhileLine(parseCode, condition);
    lines[(parseCode.loc.start.line)-1] = content ;
    let a = [];
    for (let k = 0 ; k < parseCode.body.body.length ; k++)
        a.push(parseCode.body.body[k]);
    myParse(a, 0, global);
}


function conditionParse (parseCode) {
    let leftCon = parseCode.test.left;
    let rigthCon = parseCode.test.right;
    let operator = parseCode.test.operator;
    let condition = rigth(leftCon) + operator + rigth(rigthCon);
    return condition ;
}

function ifWhileLine (parseCode, condition){
    let leftState = lines[(parseCode.loc.start.line)-1].split('(');
    let rightState = lines[(parseCode.loc.start.line)-1].split(')');
    let content = leftState[0] + ' ( ' + condition + ' ) ' + rightState[rightState.length-1];
    return content ;
}


function conditionParseToEval (parseCode) {
    let leftCon = parseCode.test.left;
    let rigthCon = parseCode.test.right;
    let operator = parseCode.test.operator;
    let conditionStr = getValue(leftCon) + operator + getValue(rigthCon);
    return eval(conditionStr) ;
}

function getValue (parseCode) {
    let state = parseCode.type;
    if (state == 'Identifier') {     //name
        return getValueIdenti(parseCode);
    }
    if (state == 'Literal') {     //number
        return parseCode.value;}
    else if (state == 'BinaryExpression') {
        return '( ' + getValue(parseCode.left) + ' ' + parseCode.operator + ' ' + getValue(parseCode.right) + ' )';
    }
    else return getValueCon(parseCode, state);
}


function getValueCon(parseCode, state){
    if (state == 'MemberExpression') {
        let key = parseCode.object.name + '[' + getValue(parseCode.property) + ']';
        if (inputVec.hasOwnProperty(key))
            return inputVec[key];
        else return ('( ' + localDec[key] + ' )');

    }
    else return ;
}


function getValueIdenti(parseCode){
    if (inputVec.hasOwnProperty(parseCode.name))
        return inputVec[parseCode.name];
    else {
        let temp = localDec[parseCode.name].split(' ');
        let str = '';
        for (let t = 0; t < temp.length; t++) {
            if (inputVec.hasOwnProperty(temp[t]))
                str = str + inputVec[temp[t]];
            else if (localDec.hasOwnProperty(temp[t]))
                str = str + localDec[temp[t]];
            else str = str + temp [t];
        }
        return ('( ' + str + ' )');
    }
}



/*function updateVal(parseCode){
    if (parseCode.operator == '++'){
        value[j] = name[j] + ' + 1'; }
    else if (parseCode.operator == '--'){
        value[j] = name[j] + ' - 1'; }
}*/

function ReturnState (parseCode, i) {
    /*line [j] = parseCode[i].loc.start.line;
    value [j] = rigth(parseCode[i].argument);
    */
    let value;
    if ( !(inputVec.hasOwnProperty(parseCode[i].argument)))
        value = rigth(parseCode[i].argument);
    else value = parseCode[i].argument ;
    //value = replaceVal (value);
    content = 'return '+ value ;
    lines[(parseCode[i].loc.start.line)-1] = content ;
}


function printCode (lines){
    let stringToPrint =  '';
    for (let i = 0 ; i < lines.length ; i ++ ){
        if (lines[i] != '~'){
            stringToPrint = stringToPrint + printCodeGreenRed(lines[i]) + '</br>' ;
        }
    }
    return stringToPrint ;
}


function printCodeGreenRed (str) {
    let first = str.substring(0, 1);
    let colorStr = str.substring(1);
    if(first == '$'){
        colorStr=colorStr.split('<').join(' < ');
        return '<a style="background-color:green;">'+colorStr.split(' ').join('&nbsp ')+'</a>';
    }
    else if(first == '@'){
        colorStr=colorStr.split('<').join(' < ');
        return '<a style="background-color:red;">'+colorStr.split(' ').join('&nbsp ')+'</a>';
    }
    else {
        str = str.replace('<', ' < ');
        return '<a>'+str.split(' ').join('&nbsp ')+'</a>';
    }
}
