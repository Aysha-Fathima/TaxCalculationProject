import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class TaxService {

  _http:HttpClient;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
    }

  constructor(_httpRef:HttpClient, private router:Router) {
    this._http=_httpRef;
   }


   public showGrossTotalIncome:boolean = false;
   grossTotalIncome: number | null = null;
   userTaxDetails: any = {};
   regimeTax: any = {};
   newRegime:number |null = null;
   oldRegime: number |null = null;


   

   calculate(data:any){
    this.userTaxDetails = data;
    
    this.grossTotalIncome = this.userTaxDetails.value.assessmentYear+
                            this.userTaxDetails.value.incomeSalary+
                            this.userTaxDetails.value.incomeFromProperty+
                            this.userTaxDetails.value.municipalTaxPaid+
                            this.userTaxDetails.value.shortTermCapitalGains+
                            this.userTaxDetails.value.longTermCapitalGains+
                            this.userTaxDetails.value.OtherBankInterest+
                            this.userTaxDetails.value.OtherWinLottery+
                            this.userTaxDetails.value.advanceTaxPaid;

    this.userTaxDetails.value.grossTotalIncome = this.grossTotalIncome;
    this.showGrossTotalIncome = true;
      console.log(data.value);


    this.oldRegime = this.calculateOldRegimeTax();
    this.newRegime = this.calculateNewRegimeTax();
    this.regimeTax =  this.calculateNetTax(this.oldRegime, this.newRegime);
    console.log(this.regimeTax);

    this.userTaxDetails.value.oldRegime = this.regimeTax.netOldRegimeTax;
    this.userTaxDetails.value.newRegime = this.regimeTax.netNewRegimeTax;
    console.log(this.userTaxDetails.value.oldRegime);
    console.log(this.userTaxDetails.value.newRegime);

      // this._https.post("https://localhost:7105/api/TaxInfoes",this.userTaxDetails.value) // where and what data
      // .subscribe(response=>{
      //   console.log("data added:", response)
      //   alert("added")
      // });
   }


   calculateOldRegimeTax(): number {
    if (this.grossTotalIncome === null) {
      console.error("Gross Total Income is null. Cannot calculate tax.");
      return 0; // Or handle the error as needed
    }
    const taxableIncome = this.grossTotalIncome-this.userTaxDetails.value.totalDeduction;

    // Tax slabs for Old Regime FY 2023-24 (use the correct slabs for the assessment year)
    let tax = 0;

    if (taxableIncome <= 250000) {
      tax = 0; // No tax up to 2.5 lakhs
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else {
      tax = 112500 + (taxableIncome - 1000000) * 0.3;
    }

    // Add special rates for capital gains
    const shortTermCapGainsTax = this.userTaxDetails.value.shortTermCapitalGains * 0.15;
    const longTermCapGainsTax = this.userTaxDetails.value.longTermCapitalGains * 0.10;

    tax += shortTermCapGainsTax + longTermCapGainsTax;

    return tax;
  }



  // Function to calculate tax using New Regime
  calculateNewRegimeTax(): number {
    if (this.grossTotalIncome === null) {
      console.error("Gross Total Income is null. Cannot calculate tax.");
      return 0; // Or handle the error as needed
    }

    const taxableIncome = this.grossTotalIncome; // No deductions are allowed under the new regime

    // Tax slabs for New Regime FY 2023-24 (adjust for the assessment year if needed)
    let tax = 0;

    if (taxableIncome <= 250000) {
      tax = 0; // No tax up to 2.5 lakhs
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 750000) {
      tax = 12500 + (taxableIncome - 500000) * 0.10;
    } else if (taxableIncome <= 1000000) {
      tax = 37500 + (taxableIncome - 750000) * 0.15;
    } else if (taxableIncome <= 1250000) {
      tax = 75000 + (taxableIncome - 1000000) * 0.20;
    } else if (taxableIncome <= 1500000) {
      tax = 125000 + (taxableIncome - 1250000) * 0.25;
    } else {
      tax = 187500 + (taxableIncome - 1500000) * 0.30;
    }

    // Add special rates for capital gains
    const shortTermCapGainsTax = this.userTaxDetails.shortTermCapitalGains * 0.15;
    const longTermCapGainsTax = this.userTaxDetails.longTermCapitalGains * 0.10;

    tax += shortTermCapGainsTax + longTermCapGainsTax;

    return tax;
  }


  // Function to calculate net tax payable after considering advance tax and refunds
  calculateNetTax(oldRegimeTax: number, newRegimeTax: number) {

    const netOldRegimeTax = oldRegimeTax - this.userTaxDetails.value.advanceTaxPaid;
    const netNewRegimeTax = newRegimeTax - this.userTaxDetails.value.advanceTaxPaid;

    console.log(netOldRegimeTax);
    console.log(netNewRegimeTax);

    return {
      netOldRegimeTax: netOldRegimeTax > 0 ? netOldRegimeTax : 0,
      netNewRegimeTax: netNewRegimeTax > 0 ? netNewRegimeTax : 0,
    };
  }



   generatePDF(){
    console.log(this.userTaxDetails.value);
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text('Tax Details', 20, 20);
    pdf.setFontSize(12);

    pdf.text(`assessmentYear: ${this.userTaxDetails.value.assessmentYear}`, 20, 30);
    pdf.text(`incomeSalary: ${this.userTaxDetails.value.incomeSalary}`, 20, 40);
    pdf.text(`incomeFromProperty: ${this.userTaxDetails.value.incomeFromProperty}`, 20, 50);
    pdf.text(`municipalTaxPaid: ${this.userTaxDetails.value.municipalTaxPaid}`, 20, 60);
    pdf.text(`shortTermCapitalGains: ${this.userTaxDetails.value.shortTermCapitalGains}`, 20, 70);
    pdf.text(`longTermCapitalGains: ${this.userTaxDetails.value.longTermCapitalGains}`, 20, 80);
    pdf.text(`OtherBankInterest: ${this.userTaxDetails.value.OtherBankInterest}`, 20, 90);
    pdf.text(`OtherWinLottery: ${this.userTaxDetails.value.OtherWinLottery}`, 20, 100);
    pdf.text(`totalDeduction: ${this.userTaxDetails.value.totalDeduction}`, 20, 110);
    pdf.text(`advanceTaxPaid: ${this.userTaxDetails.value.advanceTaxPaid}`, 20, 120);
    pdf.text(`grossTotalIncome: ${this.userTaxDetails.value.grossTotalIncome}`, 20, 140);
    pdf.text(`netOldRegimeTax: ${this.userTaxDetails.value.oldRegime}`, 20, 150);
    pdf.text(`netNewRegimeTax: ${this.userTaxDetails.value.newRegime}`, 20, 160);

    const pdfData = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfData);
    window.open(pdfUrl, '_blank');

    // pdf.save('student-info.pdf');
   }





    //Register
  redirecttologin(){
    this.router.navigateByUrl("login");
  }
  register(registerInfo:any)
  {
    // registerInfo.value.userRole = "Customer";
    console.log(registerInfo.value);
   return this._http.post("https://localhost:7105/api/UserDatums/Register",registerInfo.value,this.httpOptions).pipe(
      tap(response => {
        // Handle success response
        console.log("Success", response);
        alert("Registration Successful");
        this.redirecttologin();
        // this.router.navigate(['/your-target-component']); // Replace with your target route
      }),
      catchError(error => {
        // Handle error response
        console.error("Error", error);
        alert(error.error || "Register failed. Please try again.");
        return throwError(() => new Error('test')); // Rethrow the error for further handling if needed
      })
    ).subscribe(); // Subscribe at the end to trigger the request
  }



  //Login
  redirecttohome(){
    this.router.navigateByUrl("home");
  }
  userId:any;
  login(loginInfo:any)
  {

    console.log(loginInfo.value);

    this._http.get("https://localhost:7068/api/TaxiRideBookings/userName?name=" + loginInfo.value.userName)
    .subscribe((data=>{
      this.userId=data;
      console.log(this.userId);
    }))
    
    
    
    // console.log(loginInfo.value.userRole);
   return this._http.post("https://localhost:7068/api/Users/Login",loginInfo.value,this.httpOptions).pipe(
      tap(response => {
        // Handle success response
        console.log("Success", response);
        // alert("Login Successful");
        this.redirecttohome();
        //this.router.navigate(['/home']);
        // this.router.navigate(['/your-target-component']); // Replace with your target route
      }),
      catchError(error => {
        // Handle error response
        console.error("Error", error);
        alert(error.error || "Login failed. Please try again.");
        return throwError(() => new Error('test')); // Rethrow the error for further handling if needed
      })
    ).subscribe(); // Subscribe at the end to trigger the request
  }

}




