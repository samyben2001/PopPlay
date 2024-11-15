import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/tools/toast/toast.component';
import { AccountService } from './services/api/account.service';
import { AuthService } from './services/api/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'PopPlay';
  private _authServ = inject(AuthService);
  private _accountServ = inject(AccountService);

  ngOnInit(): void {
    if (this._authServ.getToken()) {
      this._accountServ.setAccount(this._authServ.getConnectedUser()!)
    }
  }
}
