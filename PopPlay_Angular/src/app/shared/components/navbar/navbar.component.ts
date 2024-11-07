import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authServ = inject(AuthService);
  accountServ = inject(AccountService);
  isConnected = this.authServ.isConnected;

  logout(){
    this.authServ.removeToken();
    this.accountServ.account.set(null);
  }
}
