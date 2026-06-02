import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient ) { }

  // signin(data: any): Observable<any> {
  //   return this.http.post(environment.loginApi + '/DIRECTCBAWS/api/banks-setup/login', data)
  // }

  signin(data: any): Observable<any> {

  const headers = {
    'ngrok-skip-browser-warning': 'true'
  };

  return this.http.post(
    environment.Api + '/DIRECTCBAWS/api/banks-setup/login', data, { headers }
  );
}
}
