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

app.get('/addresses/hotels/:cityName', async (req, res) => {
    const links = [];
    const cityName = req.params.cityName;
    //const cityId = cities.filter(city => city.name == cityName)[0].id;

    
    axios.get(`https://unsplash.com/s/photos/hotel-${cityName}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const travelGuide = {
                attractions: [],
                hotels: [],
                restaurants: []
            }
          

            
res.json(travelGuide);
        }).catch(err => console.log(err));
});

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});