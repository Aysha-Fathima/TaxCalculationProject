import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TaxService } from '../../services/tax.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,MatFormField,MatInput,MatSelect,MatDatepickerModule,MatLabel,MatOption,MatDatepickerToggle,MatNativeDateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  restUserData: TaxService;
  constructor( restUserDataRef:TaxService,private router:Router)
  {
    this.restUserData=restUserDataRef;

  }
}
