import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaxService } from '../../services/tax.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-taxcalculation',
  standalone: true,
  imports: [FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,NgIf,NgFor],
  templateUrl: './taxcalculation.component.html',
  styleUrl: './taxcalculation.component.css'
})
export class TaxcalculationComponent {
  

  restUserData: TaxService;
  constructor( restUserDataRef:TaxService,private router:Router)
  {
    this.restUserData=restUserDataRef;

  }

  
}
