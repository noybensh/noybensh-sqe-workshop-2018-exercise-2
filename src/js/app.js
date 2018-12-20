import $ from 'jquery';
import {myMain, parseCode} from './code-analyzer';
//import {printCode} from './code-analyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let argValue = $('#argValue').val();
        let parsedCode = parseCode(codeToParse);
        //let toPrintMap = first(parsedCode, argValue);
        let toPrintMap = myMain(parsedCode, argValue);
        let toPrint = printCode(toPrintMap);
        //$('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        $('#parsedCode').html(toPrint);
    });
});

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
    if(first === '$'){
        colorStr=colorStr.split('<').join(' < ');
        return '<a style="background-color:green;">'+colorStr.split(' ').join('&nbsp ')+'</a>';
    }
    else if(first === '@'){
        colorStr=colorStr.split('<').join(' < ');
        return '<a style="background-color:red;">'+colorStr.split(' ').join('&nbsp ')+'</a>';
    }
    else {
        str = str.replace('<', ' < ');
        return '<a>'+str.split(' ').join('&nbsp ')+'</a>';
    }
}






