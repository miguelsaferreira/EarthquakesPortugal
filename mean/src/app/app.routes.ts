import { Routes } from '@angular/router';
import { HomeComponent } from './home';
//import { angularProfileCard } from '../../components/main-profile/index';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: '**',    component: NoContentComponent },
];
