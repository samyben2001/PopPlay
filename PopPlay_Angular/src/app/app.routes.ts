import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/accounts/login/login.component';
import { RegisterComponent } from './components/accounts/register/register.component';
import { MinigameCreationComponent } from './components/minigames/minigame-creation/minigame-creation.component';
import { MinigamePlayerComponent } from './components/minigames/minigame-player/minigame-player.component';
import { Error404Component } from './shared/components/tools/error404/error404.component';
import { authGuard } from './shared/guards/auth.guard';
import { MyAccountComponent } from './components/accounts/my-account/my-account.component';
import { MinigamesCreationComponent } from './components/minigames/minigames-creation/minigames-creation.component';

export const routes: Routes = [
    {path: '', component: HomeComponent, pathMatch: 'full'},

    {path: 'accounts', children: [
        {path: 'register', component: RegisterComponent},
        {path: 'login', component: LoginComponent},
        {path: ':username', component: MyAccountComponent, canActivate:[authGuard]},
    ]},

    {path: 'minigame', children: [
        {path: 'creation', component: MinigameCreationComponent, canActivate:[authGuard]},
        {path: 'creationv2', component: MinigamesCreationComponent, canActivate:[authGuard]},
        {path: 'update/:gameID', component: MinigameCreationComponent, canActivate:[authGuard]},
        {path: 'updatev2/:gameID', component: MinigamesCreationComponent, canActivate:[authGuard]},
        {path: 'play/:gameId', component: MinigamePlayerComponent},
    ]},

    {path: 'error', component: Error404Component},
    {path: '**', redirectTo: 'error'}
];
