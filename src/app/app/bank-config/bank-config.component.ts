import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'; 
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { BankConfigService, BankModel, CreateBankRequest } from '../../services/bank-config.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
  

@Component({
  selector: 'app-bank-config',
  imports: [NzTableModule, NzModalModule, NzFormModule, NzRadioModule, FormsModule, CommonModule, NzDropDownModule],
  templateUrl: './bank-config.component.html',
  styleUrl: './bank-config.component.scss',
})
export class BankConfigComponent { 

  constructor(private bankConfigService: BankConfigService, private notification: NzNotificationService, private router: Router) {
    this.searchInput$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((query: string) => {
      this.searchQuery = query;
      this.searchforBank();
    });
  }

     createNotification(position: 'topRight', type: 'success'| 'info'| 'warning'| 'error', title: string, message: string ){
    this.notification.create(type, title, message, {nzPlacement: position, nzDuration: 3000});
  }

  @ViewChild('actionMenu') actionMenu!: ElementRef;
  @ViewChild('profileMenu') profileMenu!: ElementRef;
    isActionVisible = false;

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
        if (this.isActionVisible && this.actionMenu && 
            !this.actionMenu.nativeElement.contains(event.target)) {
            this.isActionVisible = false;
        }
         if (this.isProfileOpen && this.profileMenu && 
        !this.profileMenu.nativeElement.contains(event.target)) {
      this.isProfileOpen = false;
    }
    }

    @HostListener('document:keydown.escape', ['$event'])
    onEscapeKey(event: KeyboardEvent) {
        if (this.isActionVisible) {
            this.isActionVisible = false;
        }
    }


  ngOnInit(): void {
     this.getAllBanks();
    const data = localStorage.getItem('userInfo');
    this.username = data ?? '';
   
  }

  BankList: BankModel[] = [];
  allBanks: BankModel[] = [];
  isVisible = false;
  // isActionVisible = false;
  isEditVisible = false;
  tokenEnabled = false;
  isDeleteOpen = false;
  selectedBank: BankModel | null = null;
  isProfileOpen = false;
  openField = true;
  username : string = '';
  searchQuery: string = '';
  activeBankId: string | null = null;
  searchInput$ = new Subject <string>()


  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  walletToBankEnabled: string = 'A'; 
  bankToWalletEnabled: string = 'A';
  accountToAccountEnabled: string = 'A';
  interbankEnabled: string = 'A';
  loanEnabled: string = 'A';
  // tokenEnabled: string = 'A';
  

  openAction(event: Event, bank: BankModel): void {
     event.stopPropagation();
    this.selectedBank = bank;
    this.isActionVisible = true;
  }

  edit(): void {
    this.isActionVisible = false;
  if (!this.selectedBank) return;

  this.editForm = {
    bankName: this.selectedBank.bankName,
    bankCode: this.selectedBank.bankCode,
    w2bEndpoint: this.selectedBank.w2bEndpoint,
    w2bEnabled: this.selectedBank.w2bEnabled,
    b2wEndpoint: this.selectedBank.b2wEndpoint,
    b2wEnabled: this.selectedBank.b2wEnabled,
    a2aEndpoint: this.selectedBank.a2aEndpoint,
    a2aEnabled: this.selectedBank.a2aEnabled,
    interbankEnabled: this.selectedBank.interbankEnabled,
    loanEnabled: this.selectedBank.loanEnabled,
    loanEndpoint: this.selectedBank.loanEndpoint,
    withdrawalEndpoint: this.selectedBank.withdrawalEndpoint,
    interBankEndpoint: this.selectedBank.interBankEndpoint,
    requiresToken: this.selectedBank.requiresToken,
    tokenUsername: this.selectedBank.tokenUsername,
    tokenPassword: this.selectedBank.tokenPassword,
    b2wFees: this.selectedBank.b2wFees,
    w2bFees: this.selectedBank.w2bFees,
    a2aFees: this.selectedBank.a2aFees,
    withdrawalFees: this.selectedBank.withdrawalFees,
    interBankFees: this.selectedBank.interBankFees,
    loanFees: this.selectedBank.loanFees,
    billFees: this.selectedBank.billFees,
    airtimeFees: this.selectedBank.airtimeFees
  };

  this.isEditVisible = true;
  this.isActionVisible = false;
}

  editForm: BankModel = {
  bankName: '',
  bankCode: '',
  w2bEndpoint: '',
  w2bEnabled: false,
  b2wEndpoint: '',
  b2wEnabled: false,
  a2aEndpoint: '',
  a2aEnabled: false,
  interbankEnabled: false,
  interBankEndpoint: '',
  loanEnabled: false,
  loanEndpoint: '',
  withdrawalEndpoint: '',
  requiresToken: false,
  tokenUrl: '',
  tokenUsername: '',
  tokenPassword: '',
  b2wFees: 0,
  w2bFees: 0,
  a2aFees: 0,
  withdrawalFees: 0,
  interBankFees: 0,
  loanFees: 0,
  billFees: 0,
  airtimeFees: 0
  };

newBank: BankModel = {
  bankName: '',
  bankCode: '',

  requiresToken: false,
  tokenUrl: '',
  tokenUsername: '',
  tokenPassword: '',

  b2wEndpoint: '',
  b2wEnabled: false,
  w2bEndpoint: '',
  w2bEnabled: false,
  a2aEndpoint: '',
  a2aEnabled: false,
  interbankEnabled: false,
  interBankEndpoint: '',
  loanEnabled: false,
  loanEndpoint: '',
  withdrawalEndpoint: '',

  b2wFees: 0,
  w2bFees: 0,
  a2aFees: 0,
  withdrawalFees: 0,
  interBankFees: 0,
  loanFees: 0,
  billFees: 0,
  airtimeFees: 0
};

resetNewBank(): void {
  this.newBank = {
    bankName: '',
    bankCode: '',

    requiresToken: false,
    tokenUrl: '',
    tokenUsername: '',
    tokenPassword: '',

    b2wEndpoint: '',
    b2wEnabled: false,
    w2bEndpoint: '',
    w2bEnabled: false,
    a2aEndpoint: '',
    a2aEnabled: false,
    interbankEnabled: false,
    interBankEndpoint: '',
    loanEnabled: false,
    loanEndpoint: '',
    withdrawalEndpoint: '',

    b2wFees: 0,
    w2bFees: 0,
    a2aFees: 0,
    withdrawalFees: 0,
    interBankFees: 0,
    loanFees: 0,
    billFees: 0,
    airtimeFees: 0
  };
}

  deleteBank(): void {
    this.isDeleteOpen = true;
    this.isActionVisible = false;
  }

  cancelEdit(): void {
    this.isEditVisible = false;
  }

  cancelDelete(): void {
    this.isDeleteOpen = false;
  }


  getAllBanks(): void {
    this.bankConfigService.getBanks().subscribe({
      next: (response) => {
        this.allBanks = response;
        this.BankList = response;
        // console.log('Banks fetched successfully:', response);
      },
      error: (error) => {
        // console.error('Error fetching banks:', error);
      }
    })
  }

  submit(newBankForm: any): void {
    // console.log('Payload being sent:', JSON.stringify(this.newBank));
    const payload: CreateBankRequest = {
  bankName: this.newBank.bankName,
  bankCode: this.newBank.bankCode,

  requiresToken: this.newBank.requiresToken,
  tokenUrl: this.newBank.tokenUrl,
  tokenUsername: this.newBank.tokenUsername,
  tokenPassword: this.newBank.tokenPassword,

  b2wEndpoint: this.newBank.b2wEndpoint,
  w2bEndpoint: this.newBank.w2bEndpoint,
  a2aEndpoint: this.newBank.a2aEndpoint,
  interBankEndpoint: this.newBank.interBankEndpoint,
  loanEndpoint: this.newBank.loanEndpoint,

  b2wFees: this.newBank.b2wFees ?? undefined,
  w2bFees: this.newBank.w2bFees ?? undefined,
  a2aFees: this.newBank.a2aFees ?? undefined,
  withdrawalFees: this.newBank.withdrawalFees ?? undefined,
  interBankFees: this.newBank.interBankFees ?? undefined,
  loanFees: this.newBank.loanFees ?? undefined,
  billFees: this.newBank.billFees ?? undefined,
  airtimeFees: this.newBank.airtimeFees ?? undefined
};
    this.bankConfigService.createBank(payload).subscribe({
      next: (response) => {
        this.isVisible = false;
        this.getAllBanks();
        this.createNotification('topRight', "success", "SUCCESS", "Bank created successfully");
        this.resetNewBank();
      },
      error: (error) => {
        this.isVisible = false;
        // console.log("error creating bank", error);
        this.createNotification('topRight', "error", "ERROR", "Error creating bank");
      }
    })
  }

  editBank(editForm: any): void {
    const payload: CreateBankRequest = {
  bankName: this.editForm.bankName,
  bankCode: this.editForm.bankCode,

  requiresToken: this.editForm.requiresToken,
  tokenUrl: this.editForm.tokenUrl,
  tokenUsername: this.editForm.tokenUsername,
  tokenPassword: this.editForm.tokenPassword,

  b2wEndpoint: this.editForm.b2wEndpoint,
  w2bEndpoint: this.editForm.w2bEndpoint,
  a2aEndpoint: this.editForm.a2aEndpoint,
  interBankEndpoint: this.editForm.interBankEndpoint,
  loanEndpoint: this.editForm.loanEndpoint,

  b2wFees: this.editForm.b2wFees ?? undefined,
  w2bFees: this.editForm.w2bFees ?? undefined,
  a2aFees: this.editForm.a2aFees ?? undefined,
  withdrawalFees: this.editForm.withdrawalFees ?? undefined,
  interBankFees: this.editForm.interBankFees ?? undefined,
  loanFees: this.editForm.loanFees ?? undefined,
  billFees: this.editForm.billFees ?? undefined,
  airtimeFees: this.newBank.airtimeFees ?? undefined
};
    this.bankConfigService.updateBank(this.selectedBank!.bankCode, payload).subscribe({
      next: (response) => {
        this.isEditVisible = false;
        // console.log("bank updated successfully", response);
        this.getAllBanks();
        this.createNotification('topRight', "success", "SUCCESS", "Bank updated successfully");
      },
      error: (error) => {
        // console.log("error updating bank", error);
        this.createNotification('topRight', "error", "ERROR", "Error updating bank");
      }
    })
  }

  confirmDelete(): void {
    if (!this.selectedBank) return;
    this.bankConfigService.deleteBank(this.selectedBank.bankCode).subscribe({
      next: (response) => {
        this.isDeleteOpen = false;
        this.createNotification('topRight', "success", "SUCCESS", "Bank deleted successfully");     
        this.getAllBanks();
      },
      error: (error) => {
        this.isDeleteOpen = false;
        this.createNotification('topRight', "error", "ERROR", "Error deleting bank");
        this.getAllBanks();
      },
    })
  }

  openProfile(event: Event): void {
    this.isProfileOpen = true;
  }

  logout(): void {
    this.router.navigate(['/auth/login']);
  }

 searchforBank(): void {

  if (!this.searchQuery.trim()) {
    this.getAllBanks();
    return;
  }

  this.bankConfigService.searchBanks(this.searchQuery).subscribe({
    next: (response) => {
      this.BankList = response;
      // console.log("Search results:", response);
    },
    error: (error) => {
      // console.error("Error searching for banks:", error);
    }
  });
}

onSearchChange(value: string): void {
  this.searchInput$.next(value);
}

}
