/*Agregamos unicamente funcionalidad a la primera tabla, al boton de eliminar y al boton de agregar */

"use strict";
  //Global variables
  var params = null; 
  var colsEdi =null;
  var newColHtml = '<div class="btn-group pull-right">'+
'<a id="bElim"  class="delete" onclick="rowElim(this);">' +
'<span class="iconify" data-toggle="tooltip" title="Delete" data-icon="lucide:trash-2"></span>'+
'</a>'+
'<a id="bEdit"  class="edit" onclick="rowEdit(this);">' +
' <span class="iconify"  data-toggle="tooltip" title="Edit" data-icon="lucide:edit-2"></span>'+
'</a>'+
'<button id="bAcep"  class="btn" style="display:none;" onclick="rowAcep(this);">' + 
'<span class="glyphicon glyphicon-ok" > </span>'+
'</button>'+
'<button id="bCanc" class="btn" style="display:none;" onclick="rowCancel(this);">' + 
'<span class="glyphicon glyphicon-remove" > </span>'+
'</button>'+
    '</div>';
  var colEdicHtml = '<td name="buttons">'+newColHtml+'</td>'; 
    
  $.fn.SetEditable = function (options) {
    var defaults = {
        columnsEd: null,         
        $addButton: null,       
        onEdit: function() {},   
    onBeforeDelete: function() {}, 
        onDelete: function() {}, 
        onAdd: function() {}     
    };
    params = $.extend(defaults, options);
    this.find('tbody tr').append(colEdicHtml);
  var $tabedi = this;   
    if (params.$addButton != null) {
        params.$addButton.click(function() {
            rowAddNew($tabedi.attr("id"));
        });
    }
    
    if (params.columnsEd != null) {
        
        colsEdi = params.columnsEd.split(',');
    }
  };
function IterarCamposEdit($cols, tarea) {
    var n = 0;
    $cols.each(function() {
        n++;
        if ($(this).attr('name')=='buttons') return;  
        if (!EsEditable(n-1)) return;   
        tarea($(this));
    });
    
    function EsEditable(idx) {
        if (colsEdi==null) { 
            return true;  
        } else {  
            for (var i = 0; i < colsEdi.length; i++) {
              if (idx == colsEdi[i]) return true;
            }
            return false;  
        }
    }
}


function FijModoNormal(but) {
    $(but).parent().find('#bAcep').hide();
    $(but).parent().find('#bCanc').hide();
    $(but).parent().find('#bEdit').show();
    $(but).parent().find('#bElim').show();
    var $row = $(but).parents('tr');  
    $row.attr('id', '');  
}
function FijModoEdit(but) {
    $(but).parent().find('#bAcep').show();
    $(but).parent().find('#bCanc').show();
    $(but).parent().find('#bEdit').hide();
    $(but).parent().find('#bElim').hide();
    var $row = $(but).parents('tr');  
    $row.attr('id', 'editing');  
}


function rowElim(but) {  
    var $row = $(but).parents('tr'); 
    params.onBeforeDelete($row);
    $row.remove();
    params.onDelete();
}
function rowAddNew(tabId) { 
var $tab_en_edic = $("#" + tabId);  
    var $filas = $tab_en_edic.find('tbody tr');
    if ($filas.length==0) {
       
        var $row = $tab_en_edic.find('thead tr');  
        var $cols = $row.find('th');  
        var htmlDat = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
               
                htmlDat = htmlDat + colEdicHtml;  
            } else {
                htmlDat = htmlDat + '<td></td>';
            }
        });
        $tab_en_edic.find('tbody').append('<tr>'+htmlDat+'</tr>');
    } else {
        var $ultFila = $tab_en_edic.find('tr:last');
        $ultFila.clone().appendTo($ultFila.parent());  
        $ultFila = $tab_en_edic.find('tr:last');
        var $cols = $ultFila.find('td'); 
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
            } else {
                $(this).html('');  
            }
        });
    }
  params.onAdd();
}
function TableToCSV(tabId, separator) {  
    var datFil = '';
    var tmp = '';
  var $tab_en_edic = $("#" + tabId);  
    $tab_en_edic.find('tbody tr').each(function() {
        if (ModoEdicion($(this))) {
            $(this).find('#bAcep').click();  
        }
        var $cols = $(this).find('td');  
        datFil = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                
            } else {
                datFil = datFil + $(this).html() + separator;
            }
        });
        if (datFil!='') {
            datFil = datFil.substr(0, datFil.length-separator.length); 
        }
        tmp = tmp + datFil + '\n';
    });
    return tmp;
}

$("#table-list").SetEditable({
        $addButton: $('#add')
    });