import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})

export class FlightSearchComponent implements OnInit {
  from: any = "";
  fromLocation: any = [];
  origin: any;
  fromLocationTemplate: boolean = true;
  toLocationTemplate: boolean = false;
  to: any = "";
  destination: any;
  toLocation: any = [];
  departureDateTemplate: boolean = false
  date: any = "";
  flights: any;
  flightTemplate: boolean = false
  booked: boolean = false
  first: string = "";
  last: string = "";

  constructor() { }
  ngOnInit(): void { }

  handleFromLocation() {
    if (this.from.length > 3) {
      fetch(`${environment.backend_HTTP}/city-and-airport-search/${this.from}`)
        .then(response => response.json())
        .then(data => this.fromLocation = data.data)
    }
  }
  handleOrigin(location: any) {
    this.origin = location;
    this.fromLocationTemplate = false;
    this.toLocationTemplate = true;
    this.fromLocation = [];
  }
  handleToLocation() {
    if (this.to.length > 3) {
      fetch(`${environment.backend_HTTP}/city-and-airport-search/${this.to}`)
        .then(response => response.json())
        .then(data => this.toLocation = data.data)
    }
  }
  handleDestination(location: any) {
    this.destination = location;
    this.toLocationTemplate = false;
    this.toLocation = []
    this.departureDateTemplate = true;
  }
  onFindFlight() {
    alert('findFlight');
    if (this.date == "") {
      alert("Please choose a date")
    } else {
      fetch(`${environment.backend_HTTP}/flight-search?originCode=${this.origin.iataCode}&destinationCode=${this.destination.iataCode}&dateOfDeparture=${this.date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          this.flights = data.data
          console.log(this.flights)
          this.departureDateTemplate = false
          this.flightTemplate = true
        })
        .catch((error) => {
          alert(error)
        });
    }
  }
  onBookFlight(flight: any) {
    alert('bookflight');
    if (this.first == "" && this.last == "") {
      alert("Enter your first and last name")
      return;
    }
    const data = { flight: flight };
    const name = {
      first: this.first,
      last: this.last
    }
    const dataForBookingFlight = { flight: flight, name: name }
    fetch(`${environment.backend_HTTP}/flight-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(dataObject => {
        console.log('Success:', dataObject.data.flightOffers);
        const data = { flight: flight };
        console.log(data);
        fetch(`${environment.backend_HTTP}/flight-booking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataForBookingFlight),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            this.booked = true;
            this.flightTemplate = false
            this.flights = []
          })
          .catch((error) => {
            alert(error)
          });
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(error)
      });
  }
}