const PORT = process.env.PORT || 3333;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { response } = require('express');

const app = express();

const cities = [
    {
        name: "Athens",
        url: "https://www.kayak.com/Athens-Hotels.24560.hotel.ksp"
    },
    {
        name: "Barcelona",
        url: "https://www.kayak.com/Barcelona-Hotels.22567.hotel.ksp"
    },
    {
        name: "Cairo",
        url: "https://www.kayak.com/Cairo-Hotels.9087.hotel.ksp"
    },
    {
        name: "Istanbul",
        url: "https://www.kayak.com/Istanbul-Hotels.3430.hotel.ksp"
    },
    {
        name: "Lisbon",
        url: "https://www.kayak.com/Lisbon-Hotels.2172.hotel.ksp"
    },
    {
        name: "London",
        url: "https://www.kayak.com/London-Hotels.28501.hotel.ksp"
    },
    {
        name: "Munich",
        url: "https://www.kayak.com/Munich-Hotels.14057.hotel.ksp"
    },
    {
        name: "Montreal",
        url: "https://www.kayak.com/Montreal-Hotels.6966.hotel.ksp"
    },
    {
        name: "New-York",
        url: "https://www.kayak.com/New-York-Hotels.15830.hotel.ksp"
    },
    {
        name: "Paris",
        url: "https://www.kayak.com/Paris-Hotels.36014.hotel.ksp"
    },
    {
        name: "Rome",
        url: "https://www.kayak.com/Rome-Hotels.25465.hotel.ksp"
    },
    {
        name: "Zurich",
        url: "https://www.kayak.com/Zurich-Hotels.16623.hotel.ksp"
    }
];

const travelGuideDatas = [
    {
        city: "",
        hotels: []
    }
];


app.get('/', (req,res) => {
    res.json("Welcome to my Travel Guid API");
});

app.get('/:cityName', async (req,res) => {
    const links = [];
    const phone_numbers = [];
    const hotel_addresses = [];
    const hotel_names = [];
    const descriptions = [];
    const hotel_pics = [];
    const cityName = req.params.cityName;
    const url = cities.filter(city => city.name == cityName)[0].url;
    travelGuideDatas[0].city = cityName;

    //Hotels

    axios.get(url)
         .then((response) => {
             const html = response.data;
             const $ = cheerio.load(html);

             $('.soom-name', html).each(function () {
                if ($(this).attr('href').includes(`/${cityName}-Hotels`)) {
                    links.push($(this).attr('href'));
                }
            });
             console.log(links)
            for (let i = 0; i < 10; i++) {
                axios.get(`https://www.kayak.com${links[i]}`).then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);
    
                    travelGuideDatas[0].hotels.push({
                        id: i + 1,
                        label: "hotel",
                        name: "",
                        address: "",
                        tel: "",
                        image: "",
                        description: ""
                    });
    
                    $('.r9uX-phone').each(function () {
                        phone_numbers.push($(this).text());
                    });
    
                    $('.r9uX-address').each(function () {
                        hotel_addresses.push($(this).text());
                    });
    
                    $('.r9uX-hotel-name').each(function () {
                        hotel_names.push($(this).text());
                    });
    
                    $('.E4yW-description').each(function () {
                        descriptions.push({
                            text: $(this).children('p').eq(0).text() + $(this).children('p').eq(1).text() + $(this).children('p').eq(2).text() + $(this).children('p').eq(3).text()
                        });
                    });
    
                    $('picture').each(function () {
                        hotel_pics.push('https://www.kayak.com' + $(this).children('img').attr('src'));
                    })
    
                    for (let i = 0; i < travelGuideDatas[0].hotels.length; i++) {
                        travelGuideDatas[0].hotels[i].tel = phone_numbers[i];
                        travelGuideDatas[0].hotels[i].address = hotel_addresses[i];
                        travelGuideDatas[0].hotels[i].name = hotel_names[i];
                        travelGuideDatas[0].hotels[i].description = descriptions[i].text;
                        travelGuideDatas[0].hotels[i].image = hotel_pics[i];
                    }
    
                }).catch((err) => console.log(err));
            }

         }).catch((err) => console.log(err));
    res.json(travelGuideDatas);
    
});

app.listen(PORT, ()=> {
    console.log(`Server running on PORT: ${PORT}`);
});