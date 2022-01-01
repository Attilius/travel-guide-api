const PORT = process.env.PORT || 3333;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { response } = require('express');
const { children } = require('cheerio/lib/api/traversing');
const e = require('express');
const req = require('express/lib/request');

const app = express();

const cities = [
    {
        name: "Athens",
        id: "24560"
    },
    {
        name: "Barcelona",
        id: "22567"
    },
    {
        name: "Cairo",
        id: "9087"
    },
    {
        name: "Istanbul",
        id: "3430"
    },
    {
        name: "Lisbon",
        id: "2172"
    },
    {
        name: "London",
        id: "28501"
    },
    {
        name: "Munich",
        id: "14057"
    },
    {
        name: "Montreal",
        id: "6966"
    },
    {
        name: "New-York",
        id: "15830"
    },
    {
        name: "Paris",
        id: "36014"
    },
    {
        name: "Rome",
        id: "25465"
    },
    {
        name: "Zurich",
        id: "16623"
    }
];



const travelGuideRestaurantsDatas = [
    {
        city: "",
        restaurants: []
    }
];


app.get('/', (req, res) => {
    res.json("Welcome to my Travel Guid API");
});

//Request of hotels

app.get('/addresses/:service/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    const service = req.params.service;
    //const cityId = cities.filter(city => city.name == cityName)[0].id;
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

                if (image) {
                    travelGuide.hotels.push({
                        id,
                        image,
                        label
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