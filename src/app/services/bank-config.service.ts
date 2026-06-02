
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


export interface BankModel {
  bankName: string;
  bankCode: string;

  requiresToken: boolean;
  tokenUrl?: string;
  tokenUsername?: string;
  tokenPassword?: string;

  w2bEnabled: boolean;
  b2wEnabled: boolean;
  a2aEnabled: boolean;
  interbankEnabled: boolean;
  loanEnabled: boolean;

  w2bEndpoint?: string;
  b2wEndpoint?: string;
  a2aEndpoint?: string;
  withdrawalEndpoint?: string;
  interBankEndpoint?: string;
  loanEndpoint?: string;

  b2wFees?: number;
  w2bFees?: number;
  a2aFees?: number;
  withdrawalFees?: number;
  interBankFees?: number;
  loanFees?: number;
  billFees?: number;
  airtimeFees?: number;
}

export interface CreateBankRequest {
  bankName: string;
  bankCode: string;

  requiresToken: boolean;
  tokenUrl?: string;
  tokenUsername?: string;
  tokenPassword?: string;

  b2wEndpoint?: string;
  w2bEndpoint?: string;
  a2aEndpoint?: string;
  withdrawalEndpoint?: string;
  interBankEndpoint?: string;
  loanEndpoint?: string;

  b2wFees?: number;
  w2bFees?: number;
  a2aFees?: number;
  withdrawalFees?: number;
  interBankFees?: number;
  loanFees?: number;
  billFees?: number;
  airtimeFees?: number;
}

@Injectable({
    providedIn: 'root'
}) 
export class BankConfigService {
    constructor (private http: HttpClient) {}

    // getBanks(): Observable<BankModel[]> {
    //    return this.http.get<BankModel[]>(environment.Api + '/DIRECTCBAWS/api/banks-setup/getBanks');
    // }

    getBanks(): Observable<BankModel[]> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  });
  
  return this.http.get<BankModel[]>(
    environment.Api + '/DIRECTCBAWS/api/banks-setup/getBanks', { headers }
  );
}

    createBank(newBank: CreateBankRequest): Observable<any> {
        return this.http.post(`${environment.Api}/DIRECTCBAWS/api/banks-setup/create`, newBank);
    }

    updateBank(bankCode: string, updatedBank: CreateBankRequest): Observable<any> {
        return this.http.post(`${environment.Api}/DIRECTCBAWS/api/banks-setup/update/${bankCode}`, updatedBank);
    }

    deleteBank(bankCode: string): Observable<any> {
        return this.http.delete(`${environment.Api}/DIRECTCBAWS/api/banks-setup/delete/${bankCode}`, {
            responseType: 'text' as 'json'
        });
    }

searchBanks(bankValue: string): Observable<BankModel[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    });
    
    const params = new HttpParams().set('bankValue', bankValue);
    
    return this.http.get<BankModel[]>(
        `${environment.Api}/DIRECTCBAWS/api/banks-setup/searchBanks`, 
        { headers, params }
    );
}
}