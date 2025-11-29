import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'passGenerator';
  useLength: number = 16;
  useNumbers: boolean | null = null;
  useSymbols: boolean | null = null;
  useLowerCase: boolean | null = null;
  useUpperCase: boolean | null = null;
  password: string = '';
  success: boolean = false;
  fail: boolean = false;
  loading: boolean = false;
  passFail: boolean = false;
  inputTimeout: any = null;

  constructor(private http: HttpClient) {}
  
  validateLength(event: any) {
    const input = event.target as HTMLInputElement;

  if (this.inputTimeout) {
    clearTimeout(this.inputTimeout);
  }

  this.inputTimeout = setTimeout(() => {
    const value = Number(input.value);

    if (value < 4) {
      this.useLength = 4;
      input.value = '4';
      this.passFail = true;
    } else if (value > 20) {
      this.useLength = 20;
      input.value = '20';
      this.passFail = true;
    } else {
      this.useLength = value;
    }

    input.blur();

    this.inputTimeout = null;
  }, 700);
  setTimeout(() => (this.passFail = false), 3000);
}

  triggerValidation() {
    if (!this.isValid()) {
      this.fail = true;
    }
    setTimeout(() => {
      this.fail = false;
    }, 3000);
  }

  isValid(): boolean {
    return(
      this.useNumbers === true ||
      this.useLowerCase === true ||
      this.useUpperCase === true ||
      this.useSymbols === true
    )
  }

  generatePassword() {
    this.loading = true;
    let url = 'https://api.genratr.com/?';

    url += `length=${this.useLength}`;

    if (this.useUpperCase) url += '&uppercase';
    if (this.useLowerCase) url += '&lowercase';
    if (this.useSymbols) url += '&special';
    if (this.useNumbers) url += '&numbers';

    this.http.get(url)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: (res: any) => {
          this.password = res.password;
        },
        error: (err) => {
          console.error('API error:', err);
          this.password = '';
          alert('Error while contacting the server. Please try again later');
        },
      });
  }

  copyPassword() {
    if (!this.password) return;
    navigator.clipboard.writeText(this.password);
    this.success = true;
    setTimeout(() => {
      this.success = false;
    }, 3000);
  }
}
