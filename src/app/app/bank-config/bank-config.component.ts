import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-bank-config',
  imports: [NzTableModule],
  templateUrl: './bank-config.component.html',
  styleUrl: './bank-config.component.scss'
})
export class BankConfigComponent {

  BankList: any[] = [];
}
