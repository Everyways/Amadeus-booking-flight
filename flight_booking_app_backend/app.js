import Amadeus from 'amadeus';
import express from 'express';
import bodyParser from 'body-parser'
import cors from "cors"
import 'dotenv/config' 

const app = express();
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
});
 
app.use(bodyParser.json())
app.use(cors({
    origin: process.env.HTTP_ORIGIN
}));
app.listen(process.env.HTTP_PORT, () =>
    console.log(`Server is running on port: ${process.env.HTTP_HOST}:${process.env.HTTP_PORT}`)
);

// Which cities or airports start with the parameter variable
app.get(`/city-and-airport-search/:parameter`, (req, res) => {
    const parameter = req.params.parameter;

    amadeus.referenceData.locations
        .get({
            keyword: parameter,
            subType: Amadeus.location.any,
        })
        .then(function (response) {
            res.send(response.result);
        })
        .catch(function (response) {
            res.send(response);
        });
});

// Find the cheapest flights
app.get(`/flight-search`, (req, res) => {
    const originCode = req.query.originCode;
    const destinationCode = req.query.destinationCode;
    const dateOfDeparture = req.query.dateOfDeparture

    amadeus.shopping.flightOffersSearch.get({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: dateOfDeparture,
        adults: '1',
        max: '7'
    }).then(function (response) {
        res.send(response.result);
    }).catch(function (response) {
        res.send(response);
    });
});

// Confirm availability and price
app.post(`/flight-confirmation`, (req, res) => {
    const flight = req.body.flight
    amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
            'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': [flight],
            }
        })
    ).then(function (response) {
        res.send(response.result);
    }).catch(function (response) {
        res.send(response)
    })
});

// Book a flight
app.post(`/flight-booking`, (req, res) => {
    const flight = req.body.flight;
    const name = req.body.name
    amadeus.booking.flightOrders.post(
        JSON.stringify({
            'data': [{
                'type': 'flight-order',
                'flightOffers': [flight],
                'travelers': [{
                    "id": "1",
                    "dateOfBirth": "1982-01-16",
                    "name": {
                        "firstName": name.first,
                        "lastName": name.last
                    },
                    "gender": "MALE",
                    "contact": {
                        "emailAddress": "jorge.gonzales833@telefonica.es",
                        "phones": [{
                            "deviceType": "MOBILE",
                            "countryCallingCode": "34",
                            "number": "480080076"
                        }]
                    }
                }],
                "documents": [{
                    "documentType": "PASSPORT",
                    "birthPlace": "Madrid",
                    "issuanceLocation": "Madrid",
                    "issuanceDate": "2015-04-14",
                    "number": "00000000",
                    "expiryDate": "2025-04-14",
                    "issuanceCountry": "ES",
                    "validityCountry": "ES",
                    "nationality": "ES",
                    "holder": true
                }]
            }]
        })
    ).then(function (response) {
        res.send(response.result);
    }).catch(function (response) {
        res.send(response);
    });
});