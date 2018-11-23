import $ from 'jquery';
import {parseCode, analyzeParsedCode} from './code-analyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let tableData = analyzeParsedCode(parsedCode);
        generateTable(tableData);
    });
});

function generateTable(tableData){
    let htmlTable = ' <br><table border = "2" style="width:100%"> <tr> <th>Line</th> <th>Type</th> <th>Name</th> <th>Condition</th> <th>Value</th> </tr>';
    let i;
    for(i=0; i<tableData.length; i++)
    {
        htmlTable += generateTableRow(tableData[i]);
    }
    htmlTable += '</table>';
    document.getElementById('resultTable').innerHTML = htmlTable;
}

function generateTableRow(tableRowData){
    return '<tr><td>' + tableRowData.line + '</td><td>' + tableRowData.type + '</td><td>' + tableRowData.name + '</td><td>' + tableRowData.condition + '</td><td>' + tableRowData.value + '</td></tr>';
}

