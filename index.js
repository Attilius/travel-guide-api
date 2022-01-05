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
        attractions: [
            {
                name: "Brooklyn bridge tour",
                img: "https://unsplash.com/photos/yg5pcRgyxtM"
            },
            {
                name: "Statue of Liberty National Monument",
                img: "https://unsplash.com/photos/l0ySsmZ6ZG4"
            },
            {
                name: "Grand Central Terminal",
                img: "https://unsplash.com/photos/dF4qSZKJw_g"
            },
            {
                name: "St. Patrick's Cathedral",
                img: "https://unsplash.com/photos/v8ppjpVTHVQ"
            },
            {
                name: "Sightseeing walk at night in Manhattan",
                img: "https://unsplash.com/photos/raXnREhb-uI"
            },
            {
                name: "Boat trip around the city",
                img: "https://unsplash.com/photos/diV_Xm1G6Vo"
            },
            {
                name: "Times Square",
                img: "https://unsplash.com/photos/TaCk3NspYe0"
            },
            {
                name: "The Flatiron Building",
                img: "https://unsplash.com/photos/l20rwt8S4Fs"
            },
            {
                name: "9/11 memorial museum",
                img: "https://unsplash.com/photos/92Y9kKPoWB0"
            },
            {
                name: "Empire state building",
                img: "https://unsplash.com/photos/bm5s7QmnfyI"
            },
            {
                name: "One World Trade Center",
                img: "https://unsplash.com/photos/bm5s7QmnfyI"
            },
            {
                name: "City tour with an old taxi",
                img: "https://unsplash.com/photos/hnckUVub7MY"
            },
            {
                name: "Metropolitan Museum of Art, 5th Avenue",
                img: "https://unsplash.com/photos/wRtN8AgpvLg"
            },
            {
                name: "Central Park North",
                img: "https://unsplash.com/photos/vMLfRVkWItI"
            },
            {
                name: "Rockefeller Center, Rockefeller Plaza",
                img: "https://unsplash.com/photos/x4rPMOmQXoY"
            },
            {
                name: "Fifth Avenue",
                img: "https://unsplash.com/photos/mw-8073ytdU"
            },
            {
                name: "New York Public Library",
                img: "https://unsplash.com/photos/nYToduYJH-c"
            },
            {
                name: "Broadway",
                img: "https://unsplash.com/photos/2dqaasndUKE"
            },
        ],
        hotelNames: [
            {
                first: ["Union", "Hotel", "Manhattan", "West", "Yorker", "Grand", "Square", "Harlem", "Hilton", "The", "Garden", "Liberty", "Best", "Intercontinental", "Westhouse", "Millenium"],
                second: ["Union", "Dreams", "Manhattan", "West", "Yorker", "Grand", "Square", "Harlem", "Hilton", "Dream", "Garden", "Liberty", "Of", "Stars", "Stella", "Hall", "Westhouse"],
                third: ["Union", "Dreams", "Manhattan", "West", "Yorker", "Grand", "Square", "Harlem", "Hilton", "Dream", "Garden", "Liberty", "Of", "Stars", "Stella", "Hall", "Westhouse"],
                fourth: ["Union", "Dreams", "Manhattan", "West", "Yorker", "Grand", "Square", "Harlem", "Hilton", "Dream", "Garden", "Liberty", "Stars", "Stella", "Hall", "Westhouse"]
            }
        ],
        restaurantNames: [
            {
                first: ["Manhattan", "Harlem", "Tiffany's", "Stella", "Giuseppe", "Luxory", "Thai", "Asia", "French", "Sea", "City", "Garden", "Secret", "Golden", "Liberty", "Park", "State", "Empire", "Gourmet", "Delicious", "American", "Papa Joe", "Taste of", "Lucky"],
                second: ["Inn", "Kitchen", "Taste", "Restaurant", "Dream", "Coffe", "Magic", "Dreams", "Dinner", "Corner"],
                third: ["Coffe", "Restaurant", "Inn", "Taste", "Dinner"],
                fourth: ["Coffe", "Restaurant", "Inn", "Taste", "Dinner"]
            }
        ],
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
            const zipCodesStart = ["10016", "10018", "10019", "10021", "10023"];
            const namesOfBlvd = ["Madison", "Manhattan", "Lexington", "Riverside", "Malcolm"];
            const zipCodesEnd = [];
            const index = Math.floor(Math.random() * typeOfPlaces.length); // Set index for switch
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

            // I'll check and adjust the end of serial number

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

            // It choose and set the type of place and set return variable

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
        attractions: [
            {
                name: "Eiffel Tower",
                img: "https://unsplash.com/photos/QAwciFlS1g4"
            },
            {
                name: "Assemblée Nationale - Palais Bourbon",
                img: "https://unsplash.com/photos/-foXddRnxfc"
            },
            {
                name: "Louvre Museum, Rue de Rivoli",
                img: "https://unsplash.com/photos/8S_dUIYfVkI"
            },
            {
                name: "L'Arc de Triomphe de l'Etoile",
                img: "https://unsplash.com/photos/hsgNoiFYgSk"
            },
            {
                name: "Place Vendôme",
                img: "https://unsplash.com/photos/jxLd50GtR0c"
            },
            {
                name: "Champs-Élysées",
                img: "https://unsplash.com/photos/unk8y_XYgto"
            },
            {
                name: "Tuileries Garden",
                img: "https://unsplash.com/photos/6xJ9GUbbFEo"
            },
            {
                name: "L'Arc de Triomphe de l'Etoile",
                img: "https://unsplash.com/photos/milUxSbp4_A"
            },
            {
                name: "Rue de Cremieux",
                img: "https://unsplash.com/photos/I9RJT5tOXyM"
            },
            {
                name: "Saint Etienne du Mont",
                img: "https://unsplash.com/photos/_ptuPpue6E4"
            },
            {
                name: "Fontaine des Mers, Place de la Concorde",
                img: "https://unsplash.com/photos/nOazvDB3t1M"
            },
            {
                name: "Jardin des Tuileries",
                img: "https://unsplash.com/photos/NIGy5J-pQJs"
            },
            {
                name: "Notre Dame de Paris",
                img: "https://unsplash.com/photos/qv9DvC2hh44"
            },
            {
                name: "Route du Moulin Rouge",
                img: "https://unsplash.com/photos/rdYzi6d7bLE"
            },
            {
                name: "Versailles",
                img: "https://unsplash.com/photos/CjpcbF_osZ0"
            },
            {
                name: "Cathédrale Notre-Dame de Paris",
                img: "https://unsplash.com/photos/suRvdiwP9Pk"
            },
            {
                name: "Saint-Germain-l'Auxerrois, Paris, Île-de-France",
                img: "https://unsplash.com/photos/vxk-ghi-WZU"
            },
            {
                name: "Parc Monceau",
                img: "https://unsplash.com/photos/ppSBbi47UoY"
            },
            {
                name: "Sacre-Coeur",
                img: "https://unsplash.com/photos/s7w0Zzc8SPk"
            },
        ],
        hotelNames: [
            {
                first: ["Le", "Hotel", "Maison", "L'Empire", "Chouette"],
                second: ["Marianne", "Rouge", "Paris", "Jardin", "Elysia", "Elysee", "Chateau", "L'Antoine", "d'Or", "Petit"],
                third: ["Mademoiselle", "Hotel", "Bellechasse", "Rouge", "Grands", "Etoile"],
                fourth: ["Hotel"]
            }
        ],
        restaurantNames: [
            {
                first: ["Gourmet", "Les Collations", "Cafe", "La Grotte", "Epicure", "La Table", "Bistrot", "Petite", "La Grande", "Le Chasseur", "Le Canard"],
                second: ["Restaurant", "Gourmandes", "De Paris", "Alliance", "Fleur", "Ourse", "Magique", "Tulipes"],
                third: ["Restaurant"],
                fourth: ["Restaurant"]
            }
        ],
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
        },
        getRandomAddress: () => {
            const typeOfPlaces = ["Avenue", "Boulevard", "Rue"];
            const namesOfStreet = ["de Richelieu", "de Villiers", "La Fayette", "de la Chapelle", "Voltaire", "d'Oran", "Championnet", "Belliard", "Lafontaine", "Godefroy", "Emile Zola", "Victor Hugo", "des Marronniers"];
            const zipCode = "750" + Math.floor(Math.random() * 3).toString() + Math.floor(Math.random() * 10).toString();
            const houseNumber = Math.floor(Math.random() * 222) + 1;
            const indexOfType = Math.floor(Math.random() * typeOfPlaces.length);
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);

            return `${houseNumber} ${typeOfPlaces[indexOfType]} ${namesOfStreet[indexOfName]}, ${zipCode} Paris - France`;
        }
    },
];

//Functions

const getRandomName = (paramArray) => {
    const array = paramArray;
    const lengthOfWords = Math.floor(Math.random() * 3) + 2;
    const firstIndex = Math.floor(Math.random() * array[0].first.length);
    const secondIndex = Math.floor(Math.random() * array[0].second.length);
    const thirdIndex = Math.floor(Math.random() * array[0].third.length);
    const fourthIndex = Math.floor(Math.random() * array[0].fourth.length);
    let name = [];
    let result = "";

    switch (lengthOfWords) {
        case 2:
            if (array[0].second[secondIndex] === "Of") {
                name.push(
                    array[0].first[firstIndex],
                    array[0].second[secondIndex + 1]
                );
            } else {
                name.push(
                    array[0].first[firstIndex],
                    array[0].second[secondIndex]
                );
            }
            name = [...new Set(name)];
            break;

        case 3:
            if (array[0].third[thirdIndex] === "Of") {
                name.push(
                    array[0].first[firstIndex],
                    array[0].second[secondIndex],
                    array[0].third[thirdIndex + 1]
                )
            } else {
                name.push(
                    array[0].first[firstIndex],
                    array[0].second[secondIndex],
                    array[0].third[thirdIndex]
                );
            }
            name = [...new Set(name)];
            break;

        case 4:
            name.push(
                array[0].first[firstIndex],
                array[0].second[secondIndex],
                array[0].third[thirdIndex],
                array[0].fourth[fourthIndex]
            );
            name = [...new Set(name)];
            break;

        default:
            break;
    }

    name.forEach(item => {
        result += item + " ";
    });

    return result.trim();
}

const fillResponseArray = (paramArray, paramName, label, image, tel, address) => {
    const name = getRandomName(paramName);
    const id = paramArray.length + 1;
    const web = `https://www.${name.replaceAll(/'/g, " ").split(" ").join('').toLowerCase()}.com`;
    const email = `restaurant@${name.replaceAll(/'/g, " ").split(" ").join('').toLowerCase()}.com`;
    if (image) {
        paramArray.push({
            id,
            label,
            name,
            address,
            tel,
            web,
            email,
            image
        });
    }
}

const getRandomText = (responseArray, html, $) => {
    const texts = [];
    let counter = 0;
    $('#randomtext_box', html).each(function () {
        while (counter < responseArray.length) {
            const text = $(this).text().trim();
            texts.push(text);

            counter++;
        }
        for (let i = 0; i < responseArray.length; i++) {
            responseArray[i].description = texts[i];
        }
    });
    return responseArray;
}

const fillAttractionsArray = (databaseArray, responseArray, cityName) => {
    const attractions = databaseArray.filter(city => city.name == cityName)[0].attractions;

    for (let i = 0; i < attractions.length; i++) {
        const id = i + 1;
        const label = "attraction";
        const name = attractions[i].name;
        const image = attractions[i].img;

        responseArray.push({
            id,
            label,
            name,
            image
        });
    }
}

app.get('/', (req, res) => {
    res.json("Welcome to my Travel Guid API");
});

// Request all addresses of city

app.get('/addresses/all/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    const countryCode = cities.filter(city => city.name == cityName)[0].country_code;
    const cityCode = cities.filter(city => city.name == cityName)[0].city_code;
    const getRandomPhoneNumber = cities.filter(city => city.name == cityName)[0].getRandomPhoneNumber;
    const getRandomAddress = cities.filter(city => city.name == cityName)[0].getRandomAddress;
    const hotelNames = cities.filter(city => city.name == cityName)[0].hotelNames;
    const restaurantNames = cities.filter(city => city.name == cityName)[0].restaurantNames;
    const travelGuide = {
        attractions: [],
        hotels: [],
        restaurants: []
    }
    const links = [
        `https://unsplash.com/s/photos/attraction-${cityName}`,
        `https://unsplash.com/s/photos/hotel-${cityName}`,
        `https://unsplash.com/s/photos/restaurant-${cityName}`
    ]

    links.forEach(link => {
        axios.get(link)
            .then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);

                $('.YVj9w', html).each(function () {
                    const image = $(this).attr('src');
                    const tel = getRandomPhoneNumber(countryCode, cityCode);
                    const address = getRandomAddress();

                    if (link.includes("hotel")) {
                        const label = "hotel";
                        fillResponseArray(travelGuide.hotels, hotelNames, label, image, tel, address);
                    } else {
                        const label = "restaurant";
                        fillResponseArray(travelGuide.restaurants, restaurantNames, label, image, tel, address);
                    }
                });

                if (link.includes("attraction")) {
                    fillAttractionsArray(cities, travelGuide.attractions, cityName);
                }

                axios.get('https://www.randomtextgenerator.com/')
                    .then((response) => {
                        const html = response.data;
                        const $ = cheerio.load(html);
                        const texts = [];
                        let counter = 0;

                        $('#randomtext_box', html).each(function () {
                            while (counter < travelGuide.hotels.length || counter < travelGuide.attractions.length || counter < travelGuide.restaurants.length) {
                                const text = $(this).text().trim();
                                texts.push(text);

                                counter++;
                            }

                            for (let i = 0; i < travelGuide.hotels.length; i++) {
                                travelGuide.hotels[i].description = texts[i];
                            }

                            for (let i = 0; i < travelGuide.attractions.length; i++) {
                                travelGuide.attractions[i].description = texts[i];
                            }

                            for (let i = 0; i < travelGuide.restaurants.length; i++) {
                                travelGuide.restaurants[i].description = texts[i];
                            }
                        });

                        res.json(travelGuide);
                    }).catch(err => console.log(err));

            }).catch(err => console.log(err));
    })

})

//Request of hotels or restaurants or attractions

app.get('/addresses/:service/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    const service = req.params.service;
    const countryCode = cities.filter(city => city.name == cityName)[0].country_code;
    const cityCode = cities.filter(city => city.name == cityName)[0].city_code;
    const getRandomPhoneNumber = cities.filter(city => city.name == cityName)[0].getRandomPhoneNumber;
    const getRandomAddress = cities.filter(city => city.name == cityName)[0].getRandomAddress;
    const hotelNames = cities.filter(city => city.name == cityName)[0].hotelNames;
    const restaurantNames = cities.filter(city => city.name == cityName)[0].restaurantNames;
    const travelGuide = {
        attractions: [],
        hotels: [],
        restaurants: []
    }
    if (service != "attraction") {
        axios.get(`https://unsplash.com/s/photos/${service}-${cityName}`)
            .then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);

                $('.YVj9w', html).each(function () {
                    const image = $(this).attr('src');
                    const tel = getRandomPhoneNumber(countryCode, cityCode);
                    const address = getRandomAddress();
                    const label = service;

                    if (service === "hotel") {
                        fillResponseArray(travelGuide.hotels, hotelNames, label, image, tel, address);
                    } else {
                        fillResponseArray(travelGuide.restaurants, restaurantNames, label, image, tel, address);
                    }

                });

                axios.get('https://www.randomtextgenerator.com/')
                    .then((response) => {
                        const html = response.data;
                        const $ = cheerio.load(html);

                        switch (service) {
                            case "hotel":
                                res.json(getRandomText(travelGuide.hotels, html, $));
                                break;

                            case "restaurant":
                                res.json(getRandomText(travelGuide.restaurants, html, $));
                                break;

                            default:
                                res.json(`Error: /${service} Request is not exist!`);
                                break;
                        }

                    }).catch(err => console.log(err));

            }).catch(err => console.log(err));

    } else {
        fillAttractionsArray(cities, travelGuide.attractions, cityName);
        res.json(travelGuide.attractions);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});