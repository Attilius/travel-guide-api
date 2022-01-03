const PORT = process.env.PORT || 3333;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { response } = require('express');
const { children } = require('cheerio/lib/api/traversing');
const e = require('express');
const req = require('express/lib/request');

const app = express();

// Database

const cities = [
    {
        name: "New-York",
        country: "United States Of America",
        country_code: "+1",
        city_code: "(212)",
        city_iso: "NYC",
        currency: "US Dollar",
        language: "English",
        getRandomPhoneNumber: (countryCode, cityCode) => {
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 8) {
                if (numbers.length == 3) {
                    numbers.push("-");
                } else {
                    numbers.push(Math.floor(Math.random() * 10).toString());
                }
                counter++;
            }

            numbers.forEach(number => {
                result += number;
            });

            return `${countryCode} ${cityCode} ${result}`;
        },
        getRandomAddress: () => {
            const typeOfPlaces = ["Avenue", "Boulevard", "Street"];
            const sides = ["East", "West"];
            const zipCodesStart = ["10016","10018","10019","10021","10023"];
            const namesOfBlvd = ["Madison", "Manhattan", "Lexington", "Riverside", "Malcolm"];
            const zipCodesEnd = [];
            const index = Math.floor(Math.random() * typeOfPlaces.length);
            const numberOfAvenue = Math.floor(Math.random() * 11) + 1;
            const numberOfStreet = Math.floor(Math.random() * 189) + 1;
            const houseNumber = Math.floor(Math.random() * 998) + 1;
            let zipCodeEnd = "";
            let address = "";

            while (zipCodesEnd.length < 4) {
                if (!zipCodesEnd.length) {
                    zipCodesEnd.push(Math.floor(Math.random() * 9) + 1).toString();
                } else {
                    zipCodesEnd.push(Math.floor(Math.random() * 10)).toString();
                }
            }

            zipCodesEnd.forEach(code => {
                zipCodeEnd += code;
            });

            const endOfNumbers = (number) => {
                const numberStr = number.toString();
                
                if (numberStr.slice(-1) === "1") {
                    return number + "st"
                } else if (numberStr.slice(-1) === "2") {
                    return number + "nd"
                } else if (numberStr.slice(-1) === "3") {
                    return number + "rd"
                } else {
                    return number + "th"
                }
            }

            switch (typeOfPlaces[index]) {
                case "Avenue":
                    address = `${houseNumber} ${endOfNumbers(numberOfAvenue)} Avenue, New York City, NY ${zipCodesStart[Math.floor(Math.random() * 5)]}-${zipCodeEnd.trim()}`
                    break; 
            
                case "Boulevard":
                    address = `${houseNumber} ${namesOfBlvd[Math.floor(Math.random() * 5)]} Boulevard, New York City, NY ${zipCodesStart[Math.floor(Math.random() * 5)]}-${zipCodeEnd.trim()}`
                    break; 
            
                case "Street":
                    address = `${houseNumber} ${sides[Math.floor(Math.random() * 2)]} ${endOfNumbers(numberOfStreet)} Street, New York City, NY ${zipCodesStart[Math.floor(Math.random() * 5)]}-${zipCodeEnd.trim()}`
                    break; 
            
                default:
                    break;
            }

            return address;

        }
    },
    {
        name: "Paris",
        country: "France",
        country_code: "+33",
        city_code: "(1)",
        city_iso: "Par",
        currency: "Euro",
        language: "French",
        getRandomPhoneNumber: (countryCode, cityCode) => {
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 12) {
                if (numbers.length % 3 == 0) {
                    numbers.push(" ");
                } else {
                    numbers.push(Math.floor(Math.random() * 10).toString());
                }
                counter++;
            }

            numbers.forEach(number => {
                result += number;
            });

            return `${countryCode} ${cityCode} ${result.trim()}`;
        }
    },
];

app.get('/', (req, res) => {
    res.json("Welcome to my Travel Guid API");
});

//Request of hotels

app.get('/addresses/:service/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    const service = req.params.service;
    const countryCode = cities.filter(city => city.name == cityName)[0].country_code;
    const cityCode = cities.filter(city => city.name == cityName)[0].city_code;
    const getRandomPhoneNumber = cities.filter(city => city.name == cityName)[0].getRandomPhoneNumber;
    const getRandomAddress = cities.filter(city => city.name == cityName)[0].getRandomAddress;
    const travelGuide = {
        attractions: [],
        hotels: [],
        restaurants: []
    }

    axios.get(`https://unsplash.com/s/photos/${service}-${cityName}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('.YVj9w', html).each(function () {
                const image = $(this).attr('src');
                const label = "hotel";
                const id = travelGuide.hotels.length + 1;
                const tel = getRandomPhoneNumber(countryCode, cityCode);
                const address = getRandomAddress();

                if (image) {
                    travelGuide.hotels.push({
                        id,
                        image,
                        label,
                        tel,
                        address
                    });
                }
            });

            axios.get('https://thestoryshack.com/tools/hotel-name-generator/random-hotel-names/')
                .then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const names = [];

                    $('.ideas li').each(function () {
                        const name = $(this).text();
                        names.push(name);

                        for (let i = 0; i < travelGuide.hotels.length; i++) {
                            travelGuide.hotels[i].name = names[i];
                        }
                    })

                    axios.get('https://www.randomtextgenerator.com/')
                        .then((response) => {
                            const html = response.data;
                            const $ = cheerio.load(html);
                            const texts = [];
                            let counter = 0;

                            $('#randomtext_box', html).each(function () {
                                while (counter < travelGuide.hotels.length) {
                                    const text = $(this).text().trim();
                                    texts.push(text);

                                    counter++;
                                }
                                for (let i = 0; i < travelGuide.hotels.length; i++) {
                                    travelGuide.hotels[i].description = texts[i];
                                }
                            });

                            switch (service) {
                                case "attraction":
                                    res.json(travelGuide.attractions);
                                    break;

                                case "hotel":
                                    res.json(travelGuide.hotels);
                                    break;

                                case "restaurant":
                                    res.json(travelGuide.restaurants);
                                    break;

                                default:
                                    res.json(`Error: /${service} Request is not exist!`);
                                    break;
                            }

                        }).catch(err => console.log(err));

                }).catch(err => console.log(err));

        }).catch(err => console.log(err));
});

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});