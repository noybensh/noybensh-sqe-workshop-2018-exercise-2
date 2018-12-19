import $ from 'jquery';
import {myMain, parseCode} from './code-analyzer';
import {printCode} from './code-analyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let argValue = $('#argValue').val();
        let parsedCode = parseCode(codeToParse);
        //let toPrintMap = first(parsedCode, argValue);
        let toPrintMap = myMain(parsedCode, argValue);
        //let toPrintMap = first(argValue, codeToParse);
        //let tblArray = first(codeToParse);
        //document.getElementById('tbl').innerHTML = makeTableHTML (tblArray);
        //printCode (toPrintMap);
        let toPrint = printCode(toPrintMap);
        //$('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        $('#parsedCode').html(toPrint);
    });

});




