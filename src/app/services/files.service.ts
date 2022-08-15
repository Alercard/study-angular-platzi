import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

interface File {
  originalname: string,
  filename: string,
  location: string
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private apiUrl = `${environment.API_URL}/api/files`;

  constructor(
    private http: HttpClient
  ) { }

  getFile(name: string, url: string, type: string) {
    return this.http.get(url, { responseType: 'blob'})
    .pipe(
      tap(content => {
        const blob = new Blob([content], {type});
        saveAs(blob, name)
      }),
      // con map transformo la respuesta para que me devuelva true
      map(() => true)
    )
  }

  uploadFile(file: Blob) {
    const dto = new FormData(); // formato nativo para adjuntar archivos
    dto.append('file', file);
    return this.http.post<File>(`${this.apiUrl}/upload`, dto, {
      /* algunos backend necesitan elcontent type, en este caso, el backend lo analiza
      headers: {
        'Content-type': 'multipart/form-data'
      }
      */
    })

  }

}
