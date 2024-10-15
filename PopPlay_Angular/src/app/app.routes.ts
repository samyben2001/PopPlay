import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/accounts/login/login.component';
import { RegisterComponent } from './components/accounts/register/register.component';
import { MinigameCreationComponent } from './components/minigames/minigame-creation/minigame-creation.component';
import { MinigamePlayerComponent } from './components/minigames/minigame-player/minigame-player.component';
import { Error404Component } from './shared/components/error404/error404.component';

export const routes: Routes = [
    {path: '', component: HomeComponent, pathMatch: 'full'},

    {path: 'accounts', children: [
        {path: 'register', component: RegisterComponent},
        {path: 'login', component: LoginComponent},
    ]},

    {path: 'minigame', children: [
        {path: 'creation', component: MinigameCreationComponent},
        {path: 'play/:gameId', component: MinigamePlayerComponent},
    ]},

    {path: 'error', component: Error404Component},
    {path: '**', redirectTo: 'error'}
];
