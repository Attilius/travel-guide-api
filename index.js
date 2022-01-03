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
        name: "New York",
        country: "United States Of America",
        country_code: "+1",
        city_code: "(212)",
        city_iso: "NYC",
        currency: "US Dollar",
        language: "English"
    }
];

// Functions

const phoneNumber = () => {
    return "+1 (212) 111-2222";
}

app.get('/', (req, res) => {
    res.json("Welcome to my Travel Guid API");
});

//Request of hotels

app.get('/addresses/:service/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    const service = req.params.service;
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
                const tel = phoneNumber();

                if (image) {
                    travelGuide.hotels.push({
                        id,
                        image,
                        label,
                        tel
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