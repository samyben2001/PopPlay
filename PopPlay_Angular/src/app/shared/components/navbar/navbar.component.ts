import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AccountService } from '../../../services/account.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { CommonModule } from '@angular/common';
import { UpperFirstPipe } from '../../pipes/upper-first.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ClickOutsideDirective, CommonModule, UpperFirstPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authServ = inject(AuthService);
  accountServ = inject(AccountService);
  router = inject(Router);
  isConnected = this.authServ.isConnected;
  account = this.accountServ.account
  isSubNavVisible: boolean = false


  closeSubNav() {
    this.isSubNavVisible = false
  }

  navigate(path: string) {
    this.closeSubNav()

    switch (path) {
      case 'account': {
        this.router.navigate(['/accounts/'+ this.account()?.user.username]);
        break
      }
      default: {
        this.router.navigate(['/']);
      }

    }
  }

  logout() {
    this.closeSubNav()
    this.authServ.removeToken();
    this.accountServ.account.set(null);
    this.router.navigate(['/']);
  }
}
