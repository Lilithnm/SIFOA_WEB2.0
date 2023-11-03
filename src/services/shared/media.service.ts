import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient) { }


  downloadFile(data: any, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  }

  openFile(data: any): void {
    const blob: any = new Blob([(data)], { type: 'application/pdf' });

    // Create blobUrl from blob object.
    const blobUrl: string = window.URL.createObjectURL(blob);

    window.open(blobUrl);
    // Revoking blobUrl.
    window.URL.revokeObjectURL(blobUrl);
  }

  downloadFileXls(data: any, filename: string): void {
      var file = new Blob([data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(file,filename+".xlsx");
  }

  descargaCalendario(): any {
    return this.http.get('http://www.poderjudicial-gto.gob.mx/pdfs/calendario2023.pdf', {responseType: 'blob'});
  }






}
