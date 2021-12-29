const PORT = process.env.PORT || 3333;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { response } = require('express');
const { children } = require('cheerio/lib/api/traversing');
const e = require('express');

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
        id: "15830",
        restaurantsUrl: "https://www.tripadvisor.com/Restaurants-g60763-New_York_City_New_York.html"
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
    const phone_numbers = [];
    const hotel_addresses = [];

    const hotel_names = [];

    const descriptions = [];

    const hotel_pics = [];
    

    const cityName = req.params.cityName;
    const cityId = cities.filter(city => city.name == cityName)[0].id;

    

    axios.get(`https://www.kayak.com/${cityName}-Hotels.${cityId}.hotel.ksp`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const travelGuideHotels = [
                {
                    hotels: []
                }
            ];


            $('.soom-name', html).each(function () {
                if ($(this).attr('href').includes(`/${cityName}-Hotels`)) {
                    links.push($(this).attr('href'));
                }
            });

            for (let i = 0; i < 12; i++) {
                axios.get(`https://www.kayak.com${links[i]}`)
                    .then((response) => {
                        const html = response.data;
                        const $ = cheerio.load(html);
                        

                        travelGuideHotels[0].hotels.push({
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
                        });

                        for (let i = 0; i < travelGuideHotels[0].hotels.length; i++) {
                            travelGuideHotels[0].hotels[i].tel = phone_numbers[i];
                            travelGuideHotels[0].hotels[i].address = hotel_addresses[i];
                            travelGuideHotels[0].hotels[i].name = hotel_names[i];
                            travelGuideHotels[0].hotels[i].description = descriptions[i].text;
                            travelGuideHotels[0].hotels[i].image = hotel_pics[i];
                        }
                        
                        if (travelGuideHotels[0].hotels.length == 12) {
                            res.json(travelGuideHotels);
                        }

                    }).catch(err => console.log(err));
            }

        }).catch(err => console.log(err));
});



app.get('/addresses/restaurants/:cityName', async (req, res) => {

    const restaurantsLinks = [];

    const restaurant_phones = [];

    const restaurant_addresses = [];

    const restaurant_names = [];

    //const restaurant_descriptions = [];

    //const restaurant_pics = [];

    const cityName = req.params.cityName;
    const restaurantsUrl = cities.filter(city => city.name == cityName)[0].restaurantsUrl;
    travelGuideRestaurantsDatas[0].city = cityName;

    // Restaurants

    axios.get(restaurantsUrl)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('.bHGqj', html).each(function () {
                restaurantsLinks.push($(this).attr('href'));
            });

            for (let i = 0; i < 10; i++) {
                axios.get(`https://www.tripadvisor.com${restaurantsLinks[i]}`).then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);

                    travelGuideRestaurantsDatas[0].restaurants.push({
                        id: i + 1,
                        label: "restaurant",
                        style: "",
                        name: "",
                        address: "",
                        web: "",
                        tel: "",
                        image: "",
                        description: ""
                    });

                    $('.fHibz', html).each(function () {
                        restaurant_names.push($(this).text());
                    });

                    $('.dOGcA', html).each(function () {
                        if (!$(this).first('span').text().includes("Website") &&
                            !$(this).first('span').text().includes("Menu") &&
                            !$(this).first('span').text().includes("Order online") &&
                            !$(this).first('span').text().includes("See events") &&
                            !$(this).first('span').text().includes("Reserve")) {
                            restaurant_addresses.push($(this).first('span').text());
                        }

                    });

                    $('.iPqaD', html).each(function () {
                        if ($(this).attr('href').includes("tel:")) {
                            restaurant_phones.push($(this).attr('href').split(":")[1]);
                        }

                    });



                    for (let i = 0; i < travelGuideRestaurantsDatas[0].restaurants.length; i++) {
                        travelGuideRestaurantsDatas[0].restaurants[i].tel = restaurant_phones[i];
                        travelGuideRestaurantsDatas[0].restaurants[i].address = restaurant_addresses[i];
                        travelGuideRestaurantsDatas[0].restaurants[i].name = restaurant_names[i];
                        // travelGuideRestaurantsDatas[0].restaurants[i].description = descriptions[i].text;
                        // travelGuideRestaurantsDatas[0].restaurants[i].image = restaurant_pics[i];
                    }

                }).catch((err) => console.log(err));

            }

        }).catch((err) => console.log(err));

    res.json(travelGuideRestaurantsDatas);
});

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});