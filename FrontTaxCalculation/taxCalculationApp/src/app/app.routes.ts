import { Routes } from '@angular/router';
import { RegisterComponent } from '../components/register/register.component';
import { AboutUsComponent } from '../components/about-us/about-us.component';
import { LoginComponent } from '../components/login/login.component';
import { TaxcalculationComponent } from '../components/taxcalculation/taxcalculation.component';
import { HomeComponent } from '../components/home/home.component';

export const routes: Routes = [
    {path:"home", component:HomeComponent},
    {path:"register", component:RegisterComponent},
    {path:"login", component:LoginComponent},
    {path:"aboutUs", component:AboutUsComponent},
    {path: 'taxcalculation', component: TaxcalculationComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full' }
];
