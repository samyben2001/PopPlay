import { CommonModule } from '@angular/common';
import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Account, User } from '../../../models/models';

@Component({
  selector: 'app-account-infos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-infos.component.html',
  styleUrl: './account-infos.component.css'
})
export class AccountInfosComponent {
  @Input() accountInfos?: User
}
