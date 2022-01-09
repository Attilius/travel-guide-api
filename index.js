const PORT = process.env.PORT || 3333;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();

// Database

const cities = [
    {
        name: "Istanbul",
        country: "Turkey",
        country_code: "+90",
        city_code_asiaSide: "(216)",
        city_code_europeSide: "(212)",
        city_code: ["(212)", "(216)"],
        attractions: [
            {
                name: "Ayasofya-i Kebîr Câmi-i Şerîfi",
                img: "https://unsplash.com/photos/oibcDeiEYhY"
            },
            {
                name: "Galata, Beyoğlu",
                img: "https://unsplash.com/photos/IjLh_4OE5HY"
            },
            {
                name: "Sultan Ahmet Camii",
                img: "https://unsplash.com/photos/3-QB-YKxTKY"
            },
            {
                name: "Music Instruments in the Grand Bazaar",
                img: "https://unsplash.com/photos/4wlRmtvcic0"
            },
            {
                name: "Bosphorus Coast",
                img: "https://unsplash.com/photos/A8ypl75BNmU"
            },
            {
                name: "Dolmabahçe Sarayi",
                img: "https://unsplash.com/photos/NSwyO3jcbrA"
            },
            {
                name: "Kadiköy, Istanbul, Turkey",
                img: "https://unsplash.com/photos/oDGtMHERzeo"
            },
            {
                name: "Old Bazaar, Istanbul, Turkey",
                img: "https://unsplash.com/photos/fGxXDFvwsAw"
            },
            {
                name: "The bridge of Istanbul connecting Asia and Europe.",
                img: "https://unsplash.com/photos/reo4JMc4J0c"
            },
            {
                name: "Scooter tour of Istanbul",
                img: "https://unsplash.com/photos/ibWnBYTfdSg"
            },
            {
                name: "Balat, Fatih",
                img: "https://unsplash.com/photos/dAdp0IT0bZE"
            },
            {
                name: "Caddebostan Sahili",
                img: "https://unsplash.com/photos/GE-SjTeG6Ig"
            },
            {
                name: "Carpet Shop, Istanbul, Turkey",
                img: "https://unsplash.com/photos/1aURBvbvpQQ"
            },
            {
                name: "Cankurtaran, Istanbul Archaeological Museums",
                img: "https://unsplash.com/photos/toVnNWNUUlA"
            },
            {
                name: "Beautiful sunset in Istanbul.",
                img: "https://unsplash.com/photos/lCA-KQz53m0"
            },
        ],
        hotelImages: [
            "https://images.unsplash.com/photo-1632652507589-bcbd92fc1cd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1612044713264-215a17d17b4c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1598598795006-ea2174659eaa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1574169270402-4791df8604f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1524177953280-f94d56582e77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1630605569061-fdff5114b28d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1583333004011-fe5ff9bcea0e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1580288569822-567385d6874a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80",
            "https://images.unsplash.com/photo-1583231684537-bd79dc887244?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1597390871277-666712598c1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1215&q=80",
            "https://images.unsplash.com/photo-1639967516473-a084068146e0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1569660072562-48a035e65c30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
            "https://images.unsplash.com/photo-1596093544003-88102156901d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1628012087777-792009cffd58?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1175&q=80",
            "https://images.unsplash.com/photo-1544963583-7a9771fa1b42?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        ],
        hotelNames: [
            {
                first: ["Hotel", "Bosphorus", "Sultanahmet", "Pasha", "Sahrazád", "Ottoman's", "Ramada", "Yilsam", "Hagia Sophia", "Pera", "Melek", "Osmanhan"],
                second: ["Hotel", "Bosphorus", "Istanbul", "Grand", "Miracle", "Dremas", "Garden", "Galata", "Plaza"],
                third: ["Hotel", "Bosphorus", "Istanbul", "Grand", "Miracle", "Taksim"],
                fourth: ["Hotel"]
            }
        ],
        restaurantImages: [
            "https://images.unsplash.com/photo-1635170154700-a4ea51195bbf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1598515211932-b130a728a769?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1590660541081-dbb5f10c5344?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1560799262-3727e67f0c62?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1514450920197-5a0b96ee7ec6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1608658405784-4c3ef05ebcc3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1508700080317-45bb1ebbe416?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1632930623060-876a27a3ac82?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1164&q=80",
            "https://images.unsplash.com/photo-1594504676503-1d436bedd8ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1233&q=80",
            "https://images.unsplash.com/photo-1635962681065-5c18de692545?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1601313365958-2b35807578ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1606304988258-f31c39180e42?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1518290943012-2c2bec0e54d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1598976796336-63db295ccde2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1479044769763-c28e05b5baa5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        ],
        restaurantNames: [
            {
                first: ["Istanbul", "Ottoman", "Baclava", "Sultan", "Turkish", "Erhan", "Ayasofya", "Anatolian", "Ararat", "Constantine's", "Emir", "Sirin"],
                second: ["Cafe", "Bistro", "Kebab", "Anatolian", "Palace", "Terrace"],
                third: ["Restaurant"],
                fourth: ["Restaurant"]
            }
        ],
        getRandomPhoneNumber: (countryCode, cityCode) => {
            const citycode = cityCode[Math.floor(Math.random() * 2)];
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 9) {
                if (numbers.length === 3 || numbers.length === 6) {
                    numbers.push(" ");
                } else {
                    numbers.push(Math.floor(Math.random() * 10).toString());
                }
                counter++;
            }

            numbers.forEach(number => {
                result += number;
            });

            return `${countryCode} ${citycode} ${result}`;
        },
        getRandomAddress: () => {
            const typeOfPlaces = ["Biv.", "Cd.", "Sk."];
            const namesOfStreet = ["Kurtuluş Deresi", "Yaya Köprüsü", "Leylak", "Paşa Bakkal", "Çorbaci", "Tarlabaşi", "Gazhane Bostani", "İnönü", "Dolmabahçe", "İnşirah Sokaği", "Atatürk", "Yeni Riva Yolu", "Cengizhan"];
            const zipCode = "340" + Math.floor(Math.random() * 3).toString() + Math.floor(Math.random() * 10).toString();
            const houseNumber = Math.floor(Math.random() * 111) + 1;
            const indexOfType = Math.floor(Math.random() * typeOfPlaces.length);
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);

            return `${namesOfStreet[indexOfName]} ${typeOfPlaces[indexOfType]} No:${houseNumber}, ${zipCode} Istanbul - Turkey`;
        }

    },
    {
        name: "London",
        country: "United Kingdom",
        country_code: "+44",
        city_code: "20",
        attractions: [
            {
                name: "Tower Bridge",
                img: "https://unsplash.com/photos/Zn_TEtx7Tqg"
            },
            {
                name: "Parliament and Big Ben",
                img: "https://unsplash.com/photos/iXqTqC-f6jI"
            },
            {
                name: "Covent Garden",
                img: "https://unsplash.com/photos/jCHWT477xB4"
            },
            {
                name: "Landscape of London",
                img: "https://unsplash.com/photos/D68vlyckZhs"
            },
            {
                name: "The London Eye",
                img: "https://unsplash.com/photos/8Qqq7mlO1Vo"
            },
            {
                name: "Temperate House at Kew Gardens",
                img: "https://unsplash.com/photos/K7TOE1L8Q2g"
            },
            {
                name: "Buckingham Palace",
                img: "https://unsplash.com/photos/0ji5tjZQ2l4"
            },
            {
                name: "Natural History Museum London",
                img: "https://unsplash.com/photos/iqeG5xA96M4"
            },
            {
                name: "Millennium Bridge",
                img: "https://unsplash.com/photos/LDJcJAm5syA"
            },
            {
                name: "Westminster Abbey",
                img: "https://unsplash.com/photos/_bp_DfkaAJU"
            },
            {
                name: "Sunset in London",
                img: "https://unsplash.com/photos/VbUO94i6BU4"
            },
            {
                name: "Greenwich",
                img: "https://unsplash.com/photos/Nhlc0L--zYA"
            },
            {
                name: "St. Paul's Cathedral",
                img: "https://unsplash.com/photos/s-EkKaf208w"
            },
            {
                name: "London Taxi",
                img: "https://unsplash.com/photos/rBE0dKPGt2k"
            },
            {
                name: "Spitalfields market in London",
                img: "https://unsplash.com/photos/IVCI5Ed_GA0"
            },
        ],
        hotelImages: [
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1590490360836-2e3b067c082b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1515604629270-64435270c79d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1613171278211-4b6abbe48ad4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1603544971333-fea84b77f366?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1154&q=80",
            "https://images.unsplash.com/photo-1581320464802-86f62510e96b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1581320462333-5dd0c1eb4ce1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1599865853514-9f3c61669912?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1542831014-575eb81f44a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
            "https://images.unsplash.com/photo-1640549732796-44838389ffcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1589377627816-6c293c451767?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
        ],
        hotelNames: [
            {
                first: ["Hotel", "The Royal", "Chelsea", "Millenium", "Intercontinental", "Tower", "Marlin", "The Prince", "Hilton", "Angel", "Wellington", "Rosewood", "Victoria"],
                second: ["Hotel", "City", "London", "Grand", "Miracle", "Dremas", "Garden", "Hall", "Plaza"],
                third: ["Hotel", "City", "London", "Grand", "Miracle", "Waldorf"],
                fourth: ["Hotel"]
            }
        ],
        restaurantImages: [
            "https://images.unsplash.com/photo-1569921894261-ecda0b2cc1af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1159&q=80",
            "https://images.unsplash.com/photo-1578144738671-698aa1029e11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1576831438461-6d0e6a13b0ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1576831438132-7b74c94006b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1515164783716-8e6920f3e77c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1536521463147-afd1fc97dbef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1572356722953-a913220505f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80",
            "https://images.unsplash.com/photo-1536857620814-08877a2162d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1479832793815-b9be4c77023e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1622115837997-90c89ae689f9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1604328471151-b52226907017?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1534889196564-a6799df68403?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1605609147001-6a05cf918656?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1580376259349-5f4b7db4c39f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1579523609295-1ef35e6bd1c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1603185730021-ddc0c8097059?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1580638149300-65f0b9e8fbff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1471253794676-0f039a6aae9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        ],
        restaurantNames: [
            {
                first: ["London", "Taste", "Chelsea", "Park", "The Shell", "The Hampshire", "Prince", "Paddington", "Magic", "Fine", "Little", "Trinity"],
                second: ["Cafe", "Bistro", "Steakhouse", "Kitchen", "Palace", "Terrace", "Foods"],
                third: ["Restaurant"],
                fourth: ["Restaurant"]
            }
        ],
        getRandomPhoneNumber: (countryCode, cityCode) => {
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 10) {
                if (numbers.length === 1 || numbers.length === 5) {
                    numbers.push(" ");
                } else {
                    numbers.push(Math.floor(Math.random() * 10).toString());
                }
                counter++;
            }

            numbers.forEach(number => {
                result += number;
            });

            return `${countryCode} ${cityCode}${result}`;
        },
        getRandomAddress: () => {
            const typeOfPlaces = ["Ave", "Rd.", "St.", "Way"];
            const namesOfStreet = ["King Edward's", "Churchill", "Wightman", "Suffolk", "Wellington", "Warwick", "Anne Boleyn", "Kingsbury", "Stamford", "Robinson", "Stonefield", "Richmond", "Victoria"];
            const postCode = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            const firstIndex = Math.floor(Math.random() * postCode.length);
            const secondIndex = Math.floor(Math.random() * postCode.length);
            const thirdIndex = Math.floor(Math.random() * postCode.length);
            const fourthIndex = Math.floor(Math.random() * postCode.length);
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);
            const zipCode = `${postCode[firstIndex]}${Math.floor(Math.random() * 8) + 1}${postCode[secondIndex]} ${Math.floor(Math.random() * 8) + 1}${postCode[thirdIndex]}${postCode[fourthIndex]}`;
            const houseNumber = Math.floor(Math.random() * 111) + 1;
            const indexOfType = Math.floor(Math.random() * typeOfPlaces.length);

            return `${houseNumber} ${namesOfStreet[indexOfName]} ${typeOfPlaces[indexOfType]}, London ${zipCode}, United Kingdom`;
        }

    },
    {
        name: "New-York",
        country: "United States Of America",
        country_code: "+1",
        city_code: "(212)",
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
                img: "https://unsplash.com/photos/m54ULqW64PQ"
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
            {
                name: "Radio City Music Hall",
                img: "https://unsplash.com/photos/nwdp4FopOYU"
            },
        ],
        hotelImages: [
            "https://images.unsplash.com/photo-1582643505577-a42ff6605b67?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1566681990869-2ab77a7b6461?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1633765253819-85e3497b075f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1552960226-639240203497?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1623005024823-df349be68554?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1075&q=80",
            "https://images.unsplash.com/photo-1521783988139-89397d761dce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80",
            "https://images.unsplash.com/photo-1445991842772-097fea258e7b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1480895696893-aef1c3683d29?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "",
        ],
        hotelNames: [
            {
                first: ["Union", "Hotel", "Manhattan", "West", "Yorker", "Grand", "Square", "Harlem", "Hilton", "The", "Garden", "Liberty", "Best", "Intercontinental", "Westhouse", "Millenium"],
                second: ["Union", "Dreams", "Manhattan", "West", "Yorker", "Grand", "Square", "Harlem", "Hilton", "Dream", "Garden", "Liberty", "Of", "Stars", "Stella", "Hall", "Westhouse"],
                third: ["Union", "Dreams", "Manhattan", "West", "Yorker", "Grand", "Square", "Harlem", "Hilton", "Dream", "Garden", "Liberty", "Of", "Stars", "Stella", "Hall", "Westhouse"],
                fourth: ["Union", "Dreams", "Manhattan", "West", "Yorker", "Grand", "Square", "Harlem", "Hilton", "Dream", "Garden", "Liberty", "Stars", "Stella", "Hall", "Westhouse"]
            }
        ],
        restaurantImages: [
            "https://images.unsplash.com/photo-1497644083578-611b798c60f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1519690889869-e705e59f72e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1436018626274-89acd1d6ec9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1558473399-6773c890474c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80",
            "https://images.unsplash.com/photo-1483168729556-71adc94bef6b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1515711127392-4c62a99c3393?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80",
            "https://images.unsplash.com/photo-1600759101398-6268f961549b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1623276527181-d6d1197f62a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
            "https://images.unsplash.com/photo-1519691548119-14735e4a11c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1515051393741-e1589723ef8e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1483732594212-58fdd5ef8f31?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1612276546580-480137c0d11e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
            "https://images.unsplash.com/photo-1534256958597-7fe685cbd745?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80",
            "https://images.unsplash.com/photo-1611810174991-5cdd99a2c6b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1499715217757-2aa48ed7e593?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1611810175334-402a2367ca4a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1600885094287-94258fe8a91c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1072&q=80",
            "https://images.unsplash.com/photo-1560269507-68b9732d35c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1611810175414-1ea054685162?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1611810175241-8b32d1aa8942?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1602627284175-895a1fcfd8b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
            "https://images.unsplash.com/photo-1594747458008-0a70f1c213e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1175&q=80",
            "https://images.unsplash.com/photo-1610932798416-526025a4a7ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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
                if (numbers.length === 3) {
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
        hotelImages: [
            "https://images.unsplash.com/photo-1592229506151-845940174bb0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1592229505801-77b31918d822?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1544097935-e6d136448533?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1471623432079-b009d30b6729?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1546940071-03b96ed021c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1549737580-518ff07c43db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1620830958973-d30a8b341a55?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        ],
        hotelNames: [
            {
                first: ["Le", "Hotel", "Maison", "L'Empire", "Chouette"],
                second: ["Marianne", "Rouge", "Paris", "Jardin", "Elysia", "Elysee", "Chateau", "L'Antoine", "d'Or", "Petit"],
                third: ["Mademoiselle", "Hotel", "Bellechasse", "Rouge", "Grands", "Etoile"],
                fourth: ["Hotel"]
            }
        ],
        restaurantImages: [
            "https://images.unsplash.com/photo-1602833334025-5019f046b8f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1559327334-6e37e626de2e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1580654842920-37b786f32bfc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1605194177337-ce76579efdd6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1168&q=80",
            "https://images.unsplash.com/photo-1584450149783-8073785c47f9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1596195933984-5745f77c989e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
            "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1544609499-d9b16fe50243?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1590101924995-1a174ba0f87c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1583874532233-2cb0d7e0d477?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1581010864436-ca5ef8e71282?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1565955374207-218b185516a9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1585944285854-d06c019aaca3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1599464587396-6ede5ce42934?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1629624123501-7595e0193fe0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80",
            "https://images.unsplash.com/photo-1580651202259-7674e27e522a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1544824970-74e900cae286?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80",
            "https://images.unsplash.com/photo-1623009071128-a4436d880627?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
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
                if (numbers.length % 3 === 0) {
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
    const email = `${label}@${name.replaceAll(/'/g, " ").split(" ").join('').toLowerCase()}.com`;
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
        let image = ""

        axios.get(attractions[i].img).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('.YVj9w', html).each(function () {
                image = $(this).attr('src');
            });

            responseArray.push({
                id,
                label,
                name,
                image
            });

        }).catch(err => console.log(err));
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
    const hotelImages = cities.filter(city => city.name == cityName)[0].hotelImages;
    const hotelNames = cities.filter(city => city.name == cityName)[0].hotelNames;
    const restaurantImages = cities.filter(city => city.name == cityName)[0].restaurantImages;
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
    ];

    links.forEach(link => {
        axios.get(link)
            .then(() => {

                if (link.includes("hotel")) {
                    const label = "hotel";
                    let image = "";
                    for (let i = 0; i < hotelImages.length; i++) {
                        const tel = getRandomPhoneNumber(countryCode, cityCode);
                        const address = getRandomAddress();
                        image = hotelImages[i];
                        fillResponseArray(travelGuide.hotels, hotelNames, label, image, tel, address);
                    }

                } else if (link.includes("restaurant")) {
                    const label = "restaurant";
                    let image = "";
                    for (let i = 0; i < restaurantImages.length; i++) {
                        const tel = getRandomPhoneNumber(countryCode, cityCode);
                        const address = getRandomAddress();
                        image = restaurantImages[i];
                        fillResponseArray(travelGuide.restaurants, restaurantNames, label, image, tel, address);
                    }

                } else {
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
    });
});

//Request of hotels or restaurants or attractions

app.get('/addresses/:service/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    const service = req.params.service;
    const countryCode = cities.filter(city => city.name == cityName)[0].country_code;
    const cityCode = cities.filter(city => city.name == cityName)[0].city_code;
    const getRandomPhoneNumber = cities.filter(city => city.name == cityName)[0].getRandomPhoneNumber;
    const getRandomAddress = cities.filter(city => city.name == cityName)[0].getRandomAddress;
    const hotelImages = cities.filter(city => city.name == cityName)[0].hotelImages;
    const hotelNames = cities.filter(city => city.name == cityName)[0].hotelNames;
    const restaurantImages = cities.filter(city => city.name == cityName)[0].restaurantImages;
    const restaurantNames = cities.filter(city => city.name == cityName)[0].restaurantNames;
    const travelGuide = {
        attractions: [],
        hotels: [],
        restaurants: []
    }

    axios.get(`https://unsplash.com/s/photos/${service}-${cityName}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);



                const tel = getRandomPhoneNumber(countryCode, cityCode);
                const address = getRandomAddress();
                const label = service;

                if (service === "hotel") {
                    fillResponseArray(travelGuide.hotels, hotelNames, label, image, tel, address);
                } else {
                    fillResponseArray(travelGuide.restaurants, restaurantNames, label, image, tel, address);
                }


            if (service === "attraction") {
                fillAttractionsArray(cities, travelGuide.attractions, cityName);
            }

            axios.get('https://www.randomtextgenerator.com/')
                .then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);

                    switch (service) {
                        case "attraction":
                            res.json(getRandomText(travelGuide.attractions, html, $));
                            break;

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
});

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});