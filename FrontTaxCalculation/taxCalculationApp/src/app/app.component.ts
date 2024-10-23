import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { TaxcalculationComponent } from "../components/taxcalculation/taxcalculation.component";
import { NgIf } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaxcalculationComponent,RouterModule,NgIf,MatToolbar,MatButton,MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'taxCalculationApp';

  restUserData: TaxService;
  constructor( restUserDataRef:TaxService,private router:Router)
  {
    this.restUserData=restUserDataRef;

  }
}
