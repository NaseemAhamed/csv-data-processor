import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../upload-file.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { findReadVarNames } from '@angular/compiler/src/output/output_ast';
 
@Component({
  selector: 'form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.css']
})
export class FormUploadComponent implements OnInit {
   defaultColDef;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
 
  constructor(private uploadService: UploadFileService) { }
  columnDefs:any;
 rowData:any;

   cols:any;
   rows:any[]=[];
   backendData:any;
  ngOnInit() {    
    this.backendData = {
      cols:['make', 'model','price'],
      rows:[['Toyota', 'Celica',50000], ['Ford', 'Monedo',3420],['Porsche', 'Boxter',72000]]
    }
    this.defaultColDef = {
      editable: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sortable: true,
      resizable: true,
      filter: true
    };
  }

  constructTable()
  {
    this.cols = [];
    
    var i, row, obj;
    for(i=0;i<this.backendData.cols.length;i++) {
      this.cols.push(this.constructColumn(this.backendData.cols[i]));
    }
    this.columnDefs =this.cols;    
    //console.log(this.cols);
    
for(i=0;i<this.backendData.rows.length;i++)
{
  this.rows.push(this.constructRow(this.backendData.rows[i].split(",")));
}
console.log(this.rowData);
console.log(this.rows);
this.rowData=this.rows;
this.defaultColDef = {
  editable: true,
  enableRowGroup: true,
  enablePivot: true,
  enableValue: true,
  sortable: true,
  resizable: true,
  filter: true
};
  }
   createObject(name, val) {
    var obj = {};
    obj[name] = val;
    return obj    
 }
  jsonConcat(o1, o2) {
  for (var key in o2) {
   o1[key] = o2[key];
  }
  return o1;
 }
  constructRow(field:any[]) {
    
let temp:any;
  //temp={ make: field[0], model: field[1], price: field[2] };
  let j;
  
  var output = {};
  for(j=0;j<this.backendData.cols.length;j++) {
    
//console.log(this.createObject(this.backendData.cols[j],field[j])); 
output = this.jsonConcat(output, this.createObject(this.backendData.cols[j],field[j]));
  }
console.log(output);
  return output;
  }
  constructColumn(field: string) {
  let temp:any;  
  temp={"headerName":field,"field":field};
  return temp;
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
 
  upload() {
    this.progress.percentage = 0;
 
    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        let result:any[];
        result=event.body.substring(2,event.body.length -2).split("\",\"");
console.log(result[0]);
this.backendData.cols=[];
this.backendData.cols=result[0].split(",");
result=result.splice(1);
this.backendData.rows=[];
this.backendData.rows= result;
      this.constructTable();

      }
    });
 
    this.selectedFiles = undefined;
  }
 
}