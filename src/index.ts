import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
    INotebookTracker
} from '@jupyterlab/notebook';

import {
    CodeCell
} from '@jupyterlab/cells';

import * as $ from "jquery";

function activateExtension(app: JupyterFrontEnd, notebook: INotebookTracker): void {
  $.ajax({
    type: "GET",
    url: "http://192.168.99.5:5000/clearHelpHistory",
    headers: { 'Access-Control-Allow-Origin': '*' }
  });

  window.addEventListener("dblclick",function(event){
    let codeCell = notebook.activeCell as CodeCell;
    if ("model" in codeCell) {
      let output = codeCell.model.outputs.get(0)
      if (typeof output != 'undefined'){
        let outputJSON = output.toJSON()
	const url = 'http://192.168.99.5:5000/cellOutput';
	$.ajax({
	  type: "POST",
	  url: url,
	  data: JSON.stringify(outputJSON),
	  contentType: "application/json",
	  dataType: 'json',
	  headers: { 'Access-Control-Allow-Origin': '*' }
	  })
	  .done(function(data){
	    alert(data.data);
	  })
	  .fail(function(errMsg) {console.log(errMsg);});
      }
    }
  });
}


/**
 * Initialization data for the jupyterlab-cell-output extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-cell-output',
  autoStart: true,
  activate: activateExtension,
  requires: [INotebookTracker]
};

export default extension;
