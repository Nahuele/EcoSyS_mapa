import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, pipe} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IucnApiService {

  constructor(private http: HttpClient) { }


  urlApi = 'https://apiv3.iucnredlist.org/api/v3/species/puma%20concolor?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee';

  public busquedaApi(specie): Observable<any> {
    if (specie && specie.includes(' ')) {
      const dominio = 'https://apiv3.iucnredlist.org/api/v3/species/';
      specie = specie.split(' ');
      const token = '?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee';
      console.log(`service searching for ${specie}`)
      return this.http.get<any>(dominio + specie.join('%20') + token);
    } else {
      console.log('not found');
      return;
    }
  }


  private getEspecieApi(especie) {
    if (especie.includes(' ')) {
      // return result;
      // let especie$ = this.busquedaApi(especie).subscribe(data => {
      //   if (data.result[0]) {
      //     console.log('encontrada', data.result[0])
      //    return this.especieFound = JSON.stringify(data.result[0])
      //   }
      // })
    }
  }


}
