const PORT = process.env.PORT || 3333;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();

// Database

const cities = [
    {
        name: "Cairo",
        country: "Egypt",
        country_code: "+20",
        city_code: "2",
        attractions: [
            {
                name: "Great Pyramid of Giza & Sfinx",
                img: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Egyptian Art",
                img: "https://images.unsplash.com/photo-1626436819821-d2855be474c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1157&q=80"
            },
            {
                name: "Tour in Giza",
                img: "https://images.unsplash.com/photo-1590598016308-7a5a32e88b95?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Camel Pride",
                img: "https://images.unsplash.com/photo-1590081159886-a60883672ebb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1004&q=80"
            },
            {
                name: "The Mosque of Rifai and Sultan Hassan",
                img: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Sfinx in Giza",
                img: "https://images.unsplash.com/photo-1562679299-266edbefd6d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
            },
            {
                name: "Kadiköy, Istanbul, Turkey",
                img: "https://images.unsplash.com/photo-1559389864-340ac6773263?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Old Bazaar, Istanbul, Turkey",
                img: "https://images.unsplash.com/photo-1526586860017-748c7c448ab6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "The bridge of Istanbul connecting Asia and Europe.",
                img: "https://images.unsplash.com/photo-1576357079315-cf0d004de035?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Scooter tour of Istanbul",
                img: "https://images.unsplash.com/photo-1551040019-b3c378c11269?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Balat, Fatih",
                img: "https://images.unsplash.com/photo-1617485402653-671b8ec105aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=823&q=80"
            },
            {
                name: "Caddebostan Sahili",
                img: "https://images.unsplash.com/photo-1565035443508-9231522a03ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80"
            },
            {
                name: "Carpet Shop, Istanbul, Turkey",
                img: "https://images.unsplash.com/photo-1558105319-e8d93b893416?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1152&q=80"
            },
            {
                name: "Cankurtaran, Istanbul Archaeological Museums",
                img: "https://images.unsplash.com/photo-1629820092061-bd05186cb8f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Beautiful sunset in Istanbul.",
                img: "https://images.unsplash.com/photo-1582631313764-62141d98b4bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
        ],
        hotelImages: [
            "https://images.pexels.com/photos/695193/pexels-photo-695193.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/860922/pexels-photo-860922.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/271815/pexels-photo-271815.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2291599/pexels-photo-2291599.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.unsplash.com/photo-1641285598519-c19fa349b3d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1599683953107-c13b26b50173?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1595426400050-ecc7d2750aec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1568100637285-30c0ba65357b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1530125154546-09490519466d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1597390871277-666712598c1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1215&q=80",
            "https://images.unsplash.com/photo-1602688695357-ea09dcdfec4c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        ],
        hotelNames: [
            {
                first: ["Hotel", "Pyramisa", "Al Nabila", "Al Ahram", "Sonesta", "Nile", "Timo", "Yilsam", "Safir", "Radamis", "Al Masa", "Shahrazad", "Isis"],
                second: ["Hotel", "Pyramisa", "Cairo", "Nile", "Hayat", "Maadi", "Garden", "Lamar", "Plaza", "Isis"],
                third: ["Hotel", "Pyramisa", "Cairo", "Nile", "Hayat", "Taksim"],
                fourth: ["Hotel"]
            }
        ],
        restaurantImages: [
            "https://images.unsplash.com/photo-1631561411148-1d397c56f35e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://www.tripsavvy.com/thmb/zv4BSEkZbXpZDIqPmcUlVt5F8Mk=/1440x960/filters:no_upscale():max_bytes(150000):strip_icc()/caimn-restaurant-0046-hor-clsc-070472bdff1c48a2aaa3fab9917c8baa.jpg",
            "https://sceneeats.com/Content/Admin/Uploads/Articles/ArticlesMainPhoto/3239/9bf4c0f5-65db-4856-8e04-0a7159465ad5.jpg",
            "https://static.wixstatic.com/media/5eff48_30669344f0d54ad7a2342ecbabff00a1~mv2.jpg/v1/fill/w_1000,h_667,al_c,q_90,usm_0.66_1.00_0.01/5eff48_30669344f0d54ad7a2342ecbabff00a1~mv2.jpg",
            "https://sceneeats.com/Content/Admin/Uploads/Articles/ArticlesMainPhoto/3180/6a42653e-c23a-429d-bc8a-1247e5349a2f.jpg",
            "https://seoimgak.mmtcdn.com/blog/sites/default/files/images/Fine%20dining%20experience%20in%20Egypt.jpg",
            "https://www.tripsavvy.com/thmb/GmmPVczm3KWIwSD7jg0e8dYEKkA=/960x640/filters:no_upscale():max_bytes(150000):strip_icc()/AlKhal-508089bef5c0471797573a0f0279d839.jpg",
            "https://sceneeats.com/Content/Admin/Uploads/Articles/ArticlesMainPhoto/4844/b7d91224-1178-43ba-b675-88c03b42e4db.jpg",
            "https://scenenow.com/Content/editor_api/images/shutterstock_769278799-d5733201-22a4-47b7-b36f-0e23afc3a62a.jpg",
            "https://scenenow.com/Content/editor_api/images/machboos-deyay-w1280-636998893975966294-4d0d647b-3759-40df-b994-780d4c2748cd.jpg",
            "https://scenenow.com/Content/editor_api/images/3662eb9a-7c75-48cc-a8b8-1c6a8e436223-fa602753-1495-4d31-9f43-23b375b702dc.jpg",
            "https://cairoscene.com/Content/Admin/Uploads/Articles/ArticlesMainPhoto/828729/0b383388-91ba-4735-880c-e11331925249.jpg",
            "https://www.thecairoscene.online////Content/Admin/Uploads/Articles/ArticleImages/37e29d15-6356-498b-8f96-fcfe75437310.jpg",
            "https://www.thecairoscene.online////Content/Admin/Uploads/Articles/ArticleImages/1de146b1-d398-4ed9-8d1c-7d3ae104d9a2.jpg",
            "https://www.thecairoscene.online////Content/Admin/Uploads/Articles/ArticleImages/98077889-3fb7-46b8-a65a-137064ba59d0.png"
        ],
        restaurantNames: [
            {
                first: ["Cairo", "Nile", "Taboula", "Zitouni", "Le Pacha", "Sea", "Tajoury", "Geno", "Serena", "El Reda", "Mamushka", "Tamara", "Ayadina"],
                second: ["Cafe", "Elna", "Bar & Grill", "Oriental", "Cruise", "El Foly"],
                third: ["Restaurant"],
                fourth: ["Restaurant"]
            }
        ],
        getRandomPhoneNumber: (countryCode, cityCode) => {
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 9) {
                if (numbers.length === 4) {
                    numbers.push("-");
                } else {
                    numbers.push(Math.floor(Math.random() * 10).toString());
                }
                counter++;
            }

            numbers.forEach(number => {
                result += number;
            });

            return `${countryCode} ${cityCode}-${result}`;
        },
        getRandomAddress: () => {
            const typeOfPlaces = ["St."];
            const namesOfStreet = ["Al Mansoureya", "Al Haram", "Ahmet Barakat", "Ali Farid", "Abd El-Dayem", "Ali Mohammed", "Gamal El-Deen El-Banna", "Moustafa Al Tamboli", "Omar Ibn El-Khattab", "Ali Abd El-Aziz", "Kerdasa Drain", "Hadayek Al Ahram", "Adel Boreei"];
            const zipCode = "11" + Math.floor(Math.random() * 3 + 3).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
            const houseNumber = Math.floor(Math.random() * 111) + 1;
            const indexOfType = Math.floor(Math.random() * typeOfPlaces.length);
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);

            return `${houseNumber} ${namesOfStreet[indexOfName]} ${typeOfPlaces[indexOfType]} Cairo, ${zipCode} Egypt`;
        }

    },
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
                img: "https://images.unsplash.com/photo-1601163130717-627cde53c1de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Galata, Beyoğlu",
                img: "https://images.unsplash.com/photo-1589656850652-8009782e060a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Sultan Ahmet Camii",
                img: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1134&q=80"
            },
            {
                name: "Music Instruments in the Grand Bazaar",
                img: "https://images.unsplash.com/photo-1560799262-3e0b884434b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Bosphorus Coast",
                img: "https://images.unsplash.com/photo-1558553866-6dbcb1d9233b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Dolmabahçe Sarayi",
                img: "https://images.unsplash.com/photo-1556994526-7408107943e0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Kadiköy, Istanbul, Turkey",
                img: "https://images.unsplash.com/photo-1559389864-340ac6773263?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Old Bazaar, Istanbul, Turkey",
                img: "https://images.unsplash.com/photo-1526586860017-748c7c448ab6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "The bridge of Istanbul connecting Asia and Europe.",
                img: "https://images.unsplash.com/photo-1576357079315-cf0d004de035?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Scooter tour of Istanbul",
                img: "https://images.unsplash.com/photo-1551040019-b3c378c11269?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Balat, Fatih",
                img: "https://images.unsplash.com/photo-1617485402653-671b8ec105aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=823&q=80"
            },
            {
                name: "Caddebostan Sahili",
                img: "https://images.unsplash.com/photo-1565035443508-9231522a03ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80"
            },
            {
                name: "Carpet Shop, Istanbul, Turkey",
                img: "https://images.unsplash.com/photo-1558105319-e8d93b893416?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1152&q=80"
            },
            {
                name: "Cankurtaran, Istanbul Archaeological Museums",
                img: "https://images.unsplash.com/photo-1629820092061-bd05186cb8f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Beautiful sunset in Istanbul.",
                img: "https://images.unsplash.com/photo-1582631313764-62141d98b4bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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
        name: "Lisbon",
        country: "Portugal",
        country_code: "+351",
        city_code: "21",
        attractions: [
            {
                name: "Praça do Comércio",
                img: "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Street with Elevator in Lisbon",
                img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
            },
            {
                name: "Torre de Belem",
                img: "https://images.unsplash.com/photo-1546375982-c22276aa12f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1187&q=80"
            },
            {
                name: "Portas do Sol",
                img: "https://images.unsplash.com/photo-1612179587665-70b70e8adfbf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Praça do Comércio",
                img: "https://images.unsplash.com/photo-1583917328190-49b66e91bc67?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Sé de Lisboa",
                img: "https://images.unsplash.com/photo-1548707308-25b03cfae12c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Parque Eduardo VII",
                img: "https://images.unsplash.com/photo-1605019025303-a0e3ff53c7af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80"
            },
            {
                name: "Cityscape of Lisbon",
                img: "https://images.unsplash.com/photo-1557910686-2cb749b87e68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Padrão dos Descobrimentos in Belém",
                img: "https://images.unsplash.com/photo-1583254151169-cc48b62076cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Praça do Comércio",
                img: "https://images.unsplash.com/photo-1565297929515-78632fdfbdb9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80"
            },
            {
                name: "Arcadas do Terreiro do Paço",
                img: "https://images.unsplash.com/photo-1567256485317-f00ca1ba07e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Praza Rossio",
                img: "https://images.unsplash.com/photo-1589674231546-9a4360a8b9b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
            },
            {
                name: "Rua de São Paulo",
                img: "https://images.unsplash.com/photo-1611761814203-5d44fa2c4d10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Jerónimos Monastery",
                img: "https://images.unsplash.com/photo-1592814072894-3be483c61c1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Panteão Nacional",
                img: "https://images.unsplash.com/photo-1608208162866-0372ed8d598a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
            },
        ],
        hotelImages: [
            "https://images.unsplash.com/photo-1543490791-db8323d8e5b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1632843764566-04ae465c41bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1531911120215-9f628dc6e9fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1083&q=80",
            "https://images.unsplash.com/photo-1531384074909-9a475c1b7a40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1558773286-cac6db7ac569?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1533743471820-07198f456843?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1571501619463-71189edfbb3f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1118&q=80",
            "https://images.unsplash.com/photo-1481079015880-9cce04aad0dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.pexels.com/photos/1546649/pexels-photo-1546649.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/1615812/pexels-photo-1615812.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/172872/pexels-photo-172872.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.unsplash.com/photo-1542475393-90b3d5cfe8bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        ],
        hotelNames: [
            {
                first: ["Hotel", "Real", "Ascensor", "Pestana", "Selina", "Avenida", "Liberdade", "Fenicius", "Torel", "Casa", "Patio", "Johnies", "Olissippo", "Lisbon"],
                second: ["Hotel", "Nossa", "Lisbon", "Colinas", "Almirante", "do Areeiro", "da Annunciada", "Chiado", "Palácio"],
                third: ["Hotel", "Sana", "Lisbon", "Colinas", "Almirante", "Saldanha"],
                fourth: ["Hotel"]
            }
        ],
        restaurantImages: [
            "https://images.unsplash.com/photo-1618331822271-d21297ca4ee0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
            "https://images.unsplash.com/photo-1509870449717-5609536a5393?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80",
            "https://images.unsplash.com/photo-1616607006500-b08d26749c64?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1558998708-ed5f8eaf1af1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1152&q=80",
            "https://images.unsplash.com/photo-1572019846776-8a8c27b0c868?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1544777022-1dfc0fa595bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
            "https://images.pexels.com/photos/1753121/pexels-photo-1753121.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.unsplash.com/photo-1597506892627-7a2ac4e95db1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1521886366014-bebca51ec05c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
            "https://images.unsplash.com/photo-1567640981765-f45b9f290821?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80",
            "https://images.unsplash.com/photo-1570786273288-7d0453441a5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1213&q=80",
            "https://images.unsplash.com/photo-1542320218927-930a7ade06d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1136&q=80",
            "https://images.unsplash.com/photo-1550603101-c6e9eebe832b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1530036881959-2186be674963?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80",
            "https://images.unsplash.com/photo-1512140865533-90c3e8fbcbde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80",
            "https://images.unsplash.com/photo-1619834092768-9ee9d433d8b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1612179652354-7e7429393bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        ],
        restaurantNames: [
            {
                first: ["Lisboa", "Feitoria", "Taberna", "Pateo", "Bairro", "Lídia", "Tapisco", "Restaurante", "Peixaria", "Madragoa", "Mesa", "Páteo", "Pinto", "Burrata", "Travessa"],
                second: ["Café", "Bistro", "do Calhau", "Grosso", "de Palma", "Cantinho", "Cevicheira", "Lisboa"],
                third: ["Restaurante"],
                fourth: ["Restaurante"]
            }
        ],
        getRandomPhoneNumber: (countryCode, cityCode) => {
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 9) {
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
            const typeOfPlaces = ["Avenida", "Rua"];
            const namesOfStreet = ["Correia Garção", "da Madalena", "Tomas Ribeiro", "da Liberdade", "São Sebastião da Pedreira", "Pinheiro Chagas", "Dr. António Cãndido", "Duque de Ávila", "João Crisóstomo", "Miguel Bambarda", "de Ponta Delgada", "Carlos José Barreiros", "José Falcão", "Cavaleiro de Oliveira", "Marques da Silva"];
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);
            const zipCode = "1000-" + `${Math.floor(Math.random() * 3)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
            const houseNumber = Math.floor(Math.random() * 198) + 1;
            const indexOfType = Math.floor(Math.random() * typeOfPlaces.length);

            return `${typeOfPlaces[indexOfType]} ${namesOfStreet[indexOfName]} ${houseNumber} ${zipCode} Lisboa - Portugal`;
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
                img: "https://images.unsplash.com/photo-1592345279419-959d784e8aad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Parliament and Big Ben",
                img: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Covent Garden",
                img: "https://images.unsplash.com/photo-1510313407586-23591ad61500?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Landscape of London",
                img: "https://images.unsplash.com/photo-1562767332-ce0b1e2426bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "The London Eye",
                img: "https://images.unsplash.com/photo-1587659901518-7020d4413085?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Temperate House at Kew Gardens",
                img: "https://images.unsplash.com/photo-1585416847683-64c505faf145?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Buckingham Palace",
                img: "https://images.unsplash.com/photo-1554279652-51eee9372f32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
            },
            {
                name: "Natural History Museum London",
                img: "https://images.unsplash.com/photo-1491156855053-9cdff72c7f85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80"
            },
            {
                name: "Millennium Bridge",
                img: "https://images.unsplash.com/photo-1441960114565-066d7a7b544b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Westminster Abbey",
                img: "https://images.unsplash.com/photo-1561536537-3ef229d58c22?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Sunset in London",
                img: "https://images.unsplash.com/photo-1505760236854-1d4519a11982?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Greenwich",
                img: "https://images.unsplash.com/photo-1623868487630-6f30667f5229?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80"
            },
            {
                name: "St. Paul's Cathedral",
                img: "https://images.unsplash.com/photo-1541347991812-d791e8954560?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1134&q=80"
            },
            {
                name: "London Taxi",
                img: "https://images.unsplash.com/photo-1550431528-122aefbbd2a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1231&q=80"
            },
            {
                name: "Spitalfields market in London",
                img: "https://images.unsplash.com/photo-1584347292382-e96007ec9ea1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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
                first: ["Hotel", "The Royal", "Chelsea", "Millenium", "Intercontinental", "Tower", "Marlin", "The Prince", "Hilton", "Angel", "Wellington", "Rosewood", "Victoria", "London"],
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
                first: ["London", "Taste", "Chelsea", "Park", "The Shell", "The Hampshire", "Prince", "Paddington", "Magic", "Fine", "Little", "Trinity", "Royal", "King of Artur", "Merlin"],
                second: ["Cafe", "Bistro", "Steakhouse", "Kitchen", "Palace", "Terrace", "Foods", "Inn"],
                third: ["Restaurant", "Inn"],
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
            const namesOfStreet = ["King Edward's", "Churchill", "Wightman", "Suffolk", "Wellington", "Warwick", "Anne Boleyn", "Kingsbury", "Stamford", "Robinson", "Stonefield", "Richmond", "Victoria", "Baker", "Mary Poppins"];
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
        name: "Montreal",
        country: "Canada",
        country_code: "+1",
        city_code: ["438", "514"],
        attractions: [
            {
                name: "Jacques-Cartier Bridge",
                img: "https://images.unsplash.com/photo-1526669754135-c1babeb8c542?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80"
            },
            {
                name: "Old Port of Montreal",
                img: "https://images.unsplash.com/photo-1532299039866-065669a2d5df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1276&q=80"
            },
            {
                name: "Montreal Biosphere",
                img: "https://images.unsplash.com/photo-1578494277722-4ebd3d3ab9b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
            },
            {
                name: "Basilique Notre Dame de Montréal",
                img: "https://images.unsplash.com/photo-1461771465070-80531c6afc3c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1206&q=80"
            },
            {
                name: "Le Plateau-Mont-Royal",
                img: "https://images.unsplash.com/photo-1541789445041-eab5f7b1112d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
            },
            {
                name: "Sunrise in Montreal",
                img: "https://images.unsplash.com/photo-1587127457386-1ab504456133?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "The Old Port of Montreal Ferris wheel.",
                img: "https://images.unsplash.com/photo-1620064136919-62d3bb9b400f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Dorchester Square",
                img: "https://images.unsplash.com/photo-1591612598236-a9942c2dc83c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Montreal Museum of Fine Arts",
                img: "https://images.unsplash.com/photo-1635386491248-945d58b83d0c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1257&q=80"
            },
            {
                name: "Jardin botanique de Montréal",
                img: "https://images.unsplash.com/photo-1640477226039-3e0d76a13f2e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Parc Angrignon",
                img: "https://images.unsplash.com/photo-1572888656841-83cc7371f0f9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Public Library",
                img: "https://images.unsplash.com/photo-1536190966671-59537a3dea90?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Art museum",
                img: "https://images.unsplash.com/photo-1479069938554-5c7a6ee560af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Old Montreal",
                img: "https://images.unsplash.com/photo-1562987147-615e68d2e32e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
            },
            {
                name: "Carriage in the city",
                img: "https://images.unsplash.com/photo-1626677332862-6055ed53a549?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Centre de commerce mondial de Montréal",
                img: "https://images.unsplash.com/photo-1545956082-0a33eee5b440?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
        ],
        hotelImages: [
            "https://images.unsplash.com/photo-1549638441-b787d2e11f14?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1555108004-a9183c23169e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1522871465649-53a34924fdcc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
            "https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/6782574/pexels-photo-6782574.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/3659683/pexels-photo-3659683.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2844474/pexels-photo-2844474.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/3201758/pexels-photo-3201758.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/7545500/pexels-photo-7545500.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        ],
        hotelNames: [
            {
                first: ["Hotel", "The Royal", "Le Méridien", "Millenium", "Mortagne", "Belverde", "Imperia", "Hilton", "Montreal"],
                second: ["Hotel", "Le Méridien", "Montreal", "Grand", "Miracle", "Dremas", "Garden", "Hall", "Place", "Labelle", "Chateau", "Intercontinental"],
                third: ["Hotel", "Centre", "Montreal", "Grand", "Quartier", "Marriott"],
                fourth: ["Hotel"]
            }
        ],
        restaurantImages: [
            "https://images.unsplash.com/photo-1494958732218-0c0990e683f5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1462539405390-d0bdb635c7d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1220&q=80",
            "https://images.unsplash.com/photo-1582143565907-6b8c074be35e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1525904971217-668a1229f701?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1626303551646-69dbd1ab24be?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1530984662486-75aee21a673e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1185&q=80",
            "https://images.unsplash.com/photo-1591712974917-a437dbb4d5eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80",
            "https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.unsplash.com/photo-1626677385895-a37ef9c5e630?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1595562421029-04bb49e93c60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.pexels.com/photos/5531035/pexels-photo-5531035.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/370984/pexels-photo-370984.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/776938/pexels-photo-776938.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        ],
        restaurantNames: [
            {
                first: ["Montreal", "Taste", "Quebec", "Park", "Renoir", "Le Cartet", "Prince", "Paddington", "Magic", "Fine", "Little", "Le Mousso", "Royal", "Le Petit", "Delices"],
                second: ["Cafe", "Bistro", "Steakhouse", "Kitchen", "Palace", "Terrasse", "Foods", "Inn", "Taverne"],
                third: ["Restaurant", "Inn"],
                fourth: ["Restaurant"]
            }
        ],
        getRandomPhoneNumber: (countryCode, cityCode) => {
            const citycode = cityCode[Math.floor(Math.random() * 2)];
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 9) {
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

            return `${countryCode}-${citycode}-${result}`;
        },
        getRandomAddress: () => {
            const typeOfPlaces = ["Ave", "Boul", "Rd.", "St."];
            const namesOfStreet = ["Devon", "Sunset", "Strathcona", "Algonquin", "Kenilworth", "Deslauriers", "Lebeau", "Côte-de-Liesse", "Lethbridge", "Rockland", "Cornwall", "Côte-Vertu", "Jules Poitras", "Crépeau", "Laframboise"];
            const postCode = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            const firstIndex = Math.floor(Math.random() * postCode.length);
            const secondIndex = Math.floor(Math.random() * postCode.length);
            const thirdIndex = Math.floor(Math.random() * postCode.length);
            const fourthIndex = Math.floor(Math.random() * postCode.length);
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);
            const zipCode = `${postCode[firstIndex]}${Math.floor(Math.random() * 8) + 1}${postCode[secondIndex]} ${Math.floor(Math.random() * 8) + 1}${postCode[thirdIndex]}${postCode[fourthIndex]}`;
            const houseNumber = Math.floor(Math.random() * 998) + 1;
            const indexOfType = Math.floor(Math.random() * typeOfPlaces.length);

            return `${houseNumber} ${namesOfStreet[indexOfName]} ${typeOfPlaces[indexOfType]}, Montreal, Quebec, ${zipCode}, Canada`;
        }

    },
    {
        name: "Munich",
        country: "Germany",
        country_code: "+49",
        city_code: "89",
        attractions: [
            {
                name: "Schleissheim",
                img: "https://images.unsplash.com/photo-1561056731-62ffd605f586?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            },
            {
                name: "Opernplatz",
                img: "https://images.unsplash.com/photo-1617566041005-f820e8f553b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
            },
            {
                name: "Englischer Garten",
                img: "https://images.unsplash.com/photo-1588061728145-54ace02ab9cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "BMW Museum",
                img: "https://images.unsplash.com/photo-1586163099117-33542fe96a69?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Marienplatz",
                img: "https://images.unsplash.com/photo-1586015078685-6462ea6d8ebc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Horgarten - Court Garden - Diana Temple",
                img: "https://images.unsplash.com/photo-1587988537442-f42b261e6df1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1182&q=80"
            },
            {
                name: "Olympiapark",
                img: "https://images.unsplash.com/photo-1565985975283-61e060b5a781?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Bayerische Staatskanzlei",
                img: "https://images.unsplash.com/photo-1583777349997-a9833b42fcaf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80"
            },
            {
                name: "Nymphenburg Palace",
                img: "https://images.unsplash.com/photo-1542445335-643f06b6e6a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80"
            },
            {
                name: "Palace Münchner Residency",
                img: "https://images.unsplash.com/photo-1543143519-b2ee4b77524e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80"
            },
            {
                name: "Botanischer Garten München",
                img: "https://images.unsplash.com/photo-1585213303783-2044a119f9e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1095&q=80"
            },
            {
                name: "Park and trees in Munich",
                img: "https://images.unsplash.com/photo-1585582449615-dae412dee542?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80"
            },
            {
                name: "Regierung von Oberbayern",
                img: "https://images.unsplash.com/photo-1636826315439-acac01ffd85b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
        ],
        hotelImages: [
            "https://images.unsplash.com/photo-1504652517000-ae1068478c59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.pexels.com/photos/2029722/pexels-photo-2029722.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/97083/pexels-photo-97083.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2029719/pexels-photo-2029719.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/5404925/pexels-photo-5404925.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/6663043/pexels-photo-6663043.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/6776897/pexels-photo-6776897.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/10660270/pexels-photo-10660270.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        ],
        hotelNames: [
            {
                first: ["Tulip", "Hotel", "Munich", "Platz", "Grand", "Neue", "Hilton", "Kreis", "Bayerische", "Trudering", "Prinzregent"],
                second: ["Messe", "Munich", "Platz", "Grand", "Neue", "Hilton", "Bauer", "Kreis", "Residenz", "Seidlhof", "Hotel", "Trudering"],
                third: ["Messe", "Munich", "Platz", "Grand", "Neue", "Hilton", "Bauer", "Kreis", "Residenz", "Seidlhof", "Hotel", "Trudering"],
                fourth: ["Messe", "Munich", "Platz", "Grand", "Neue", "Hilton", "Bauer", "Kreis", "Residenz", "Seidlhof", "Hotel", "Trudering"]
            }
        ],
        restaurantImages: [
            "https://images.pexels.com/photos/159291/beer-machine-alcohol-brewery-159291.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/59943/pexels-photo-59943.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2814828/pexels-photo-2814828.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/265920/pexels-photo-265920.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2922312/pexels-photo-2922312.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/226722/pexels-photo-226722.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/269264/pexels-photo-269264.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/1267323/pexels-photo-1267323.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/696215/pexels-photo-696215.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/209431/pexels-photo-209431.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/3783513/pexels-photo-3783513.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/425240/pexels-photo-425240.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/745471/pexels-photo-745471.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/4992835/pexels-photo-4992835.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2825225/pexels-photo-2825225.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        ],
        restaurantNames: [
            {
                first: ["Restaurant", "Ratskeller", "Mariannenhof", "Stollberg", "Münchner", "Pfistermühle", "Gaststätte", "Catrin", "Gartenlaube", "Hohenwart", "Heimgarten"],
                second: ["Kitchen", "Bayerischer", "Restaurant", "Dantler", "Coffe", "Knödelküche", "Stubn", "Küche", "Fisch"],
                third: ["Restaurant"],
                fourth: ["Restaurant"]
            }
        ],
        getRandomPhoneNumber: (countryCode, cityCode) => {
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 10) {
                if (numbers.length % 4 === 0 && numbers.length !== 8 || numbers.length % 7 === 0) {
                    numbers.push(" ");
                } else {
                    numbers.push(Math.floor(Math.random() * 10).toString());
                }
                counter++;
            }

            numbers.forEach(number => {
                result += number;
            });

            return `${countryCode}-${cityCode}-${result.trim()}`;
        },
        getRandomAddress: () => {
            const namesOfStreet = ["Gabrielenstraße", "Dieselstraße", "Lothstraße", "Riesenfeldstraße", "Arnulfstraße", "Arabellastraße", "Bayerstraße", "Ungererstraße", "Wilhelmine-Reichard-Straße", "Baubergerstraße", "Wendl-Dietrich-Straße", "Vollmannstraße", "Effnerstraße", "Gotthardstraße"];
            const zipCode = "D-8" + Math.floor(Math.random() * 2).toString() + Math.floor(Math.random() * 2).toString() + Math.floor(Math.random() * 3).toString() + Math.floor(Math.random() * 10).toString();
            const houseNumber = Math.floor(Math.random() * 222) + 1;
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);

            return `${namesOfStreet[indexOfName]} ${houseNumber}, ${zipCode} München, Deutschland`;
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
                img: "https://images.unsplash.com/photo-1587608741187-7697e7dd21d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Statue of Liberty National Monument",
                img: "https://images.unsplash.com/photo-1590858148182-ad4bdfa495fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Grand Central Terminal",
                img: "https://images.unsplash.com/photo-1567566371290-fe5e3f80691c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
            },
            {
                name: "St. Patrick's Cathedral",
                img: "https://images.unsplash.com/photo-1570670914894-0d7313e1dd88?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Sightseeing walk at night in Manhattan",
                img: "https://images.unsplash.com/photo-1541270941907-3f7143c8c7a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
            },
            {
                name: "Boat trip around the city",
                img: "https://images.unsplash.com/photo-1501194811830-ebb130b29b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1214&q=80"
            },
            {
                name: "Times Square",
                img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "The Flatiron Building",
                img: "https://images.unsplash.com/photo-1567960197984-bce79cd5646e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "9/11 memorial museum",
                img: "https://images.unsplash.com/photo-1512749182242-4e63d27f619f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Empire state building",
                img: "https://images.unsplash.com/photo-1608094322829-62b9dcd9339e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "One World Trade Center",
                img: "https://images.unsplash.com/photo-1550640011-0e0b64e058a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1057&q=80"
            },
            {
                name: "City tour with an old taxi",
                img: "https://images.unsplash.com/photo-1544389761-cd83f8d898bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Metropolitan Museum of Art, 5th Avenue",
                img: "https://images.unsplash.com/photo-1576254232140-70c274d668c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Central Park North",
                img: "https://images.unsplash.com/photo-1631729779674-1f369e1116b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80"
            },
            {
                name: "Rockefeller Center, Rockefeller Plaza",
                img: "https://images.unsplash.com/photo-1615682143410-3b0a4aa1d62b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
            },
            {
                name: "Fifth Avenue",
                img: "https://images.unsplash.com/photo-1617141303889-4c7494183e8e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "New York Public Library",
                img: "https://images.unsplash.com/photo-1576164285450-6d26c5b1a2a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Broadway",
                img: "https://images.unsplash.com/photo-1522101394434-b1cc92527c28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80"
            },
            {
                name: "Radio City Music Hall",
                img: "https://images.unsplash.com/photo-1542336423-0e6bee175b8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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
                img: "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Assemblée Nationale - Palais Bourbon",
                img: "https://images.unsplash.com/photo-1604595818635-a840f9028d56?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Louvre Museum, Rue de Rivoli",
                img: "https://images.unsplash.com/photo-1610985296734-4030cece6149?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
            },
            {
                name: "L'Arc de Triomphe de l'Etoile",
                img: "https://images.unsplash.com/photo-1520078176967-f827b3a1a899?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Place Vendôme",
                img: "https://images.unsplash.com/photo-1518556991616-b220cd5df12e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Champs-Élysées",
                img: "https://images.unsplash.com/photo-1504973522169-4705c9741e0f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80"
            },
            {
                name: "Tuileries Garden",
                img: "https://images.unsplash.com/photo-1500760258410-1a59fcd493c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "L'Arc de Triomphe de l'Etoile",
                img: "https://images.unsplash.com/photo-1507666664345-c49223375e33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80"
            },
            {
                name: "Rue de Cremieux",
                img: "https://images.unsplash.com/photo-1557592923-992b3dc4497d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Saint Etienne du Mont",
                img: "https://images.unsplash.com/photo-1565201482013-ca4becd61ec4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Fontaine des Mers, Place de la Concorde",
                img: "https://images.unsplash.com/photo-1572112553549-4151f756bebc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
            },
            {
                name: "Jardin des Tuileries",
                img: "https://images.unsplash.com/photo-1564227589927-2a13874d0a92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Notre Dame de Paris",
                img: "https://images.unsplash.com/photo-1555425748-f780612e5634?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Route du Moulin Rouge",
                img: "https://images.unsplash.com/photo-1580164109780-d3925e57abc3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Versailles",
                img: "https://images.unsplash.com/photo-1595841044697-86e94ea53c77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Cathédrale Notre-Dame de Paris",
                img: "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Saint-Germain-l'Auxerrois, Paris, Île-de-France",
                img: "https://images.unsplash.com/photo-1504896287989-ff1fbde00199?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1333&q=80"
            },
            {
                name: "Parc Monceau",
                img: "https://images.unsplash.com/photo-1605262964194-635866855c66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1195&q=80"
            },
            {
                name: "Sacre-Coeur",
                img: "https://images.unsplash.com/photo-1606944634516-5a86bd53fcaf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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
                first: ["Gourmet", "Les Collations", "Cafe", "La Grotte", "Epicure", "La Table", "Bistrot", "Petite", "La Grande", "Le Chasseur", "Le Canard", "Paris"],
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
            const namesOfStreet = ["de Richelieu", "de Villiers", "La Fayette", "de la Chapelle", "Voltaire", "d'Oran", "Championnet", "Belliard", "Lafontaine", "Godefroy", "Emile Zola", "Victor Hugo", "des Marronniers", "Jules Verne"];
            const zipCode = "750" + Math.floor(Math.random() * 3).toString() + Math.floor(Math.random() * 10).toString();
            const houseNumber = Math.floor(Math.random() * 222) + 1;
            const indexOfType = Math.floor(Math.random() * typeOfPlaces.length);
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);

            return `${houseNumber} ${typeOfPlaces[indexOfType]} ${namesOfStreet[indexOfName]}, ${zipCode} Paris - France`;
        }
    },
    {
        name: "Rome",
        country: "Italy",
        country_code: "+39",
        city_code: "06",
        attractions: [
            {
                name: "Ponte Vittoria Emanuelle II",
                img: "https://images.unsplash.com/photo-1518309542094-645272814997?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Trevi Fountain",
                img: "https://images.unsplash.com/photo-1529154036614-a60975f5c760?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80"
            },
            {
                name: "Colosseum in Rome",
                img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1096&q=80"
            },
            {
                name: "Vatican City",
                img: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80"
            },
            {
                name: "St. Peter's Basilica and Ponte Sant'Angelo",
                img: "https://images.unsplash.com/photo-1629229537871-154c55f9cb14?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Museo di Roma Architetto",
                img: "https://images.unsplash.com/photo-1571141481336-b49088a2bf3c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Piazza Venezia",
                img: "https://images.unsplash.com/photo-1548585742-0fd962d98f62?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Roman forum",
                img: "https://images.unsplash.com/photo-1555508275-b5451b4c240a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Palazzo Doria Pamphilj",
                img: "https://images.unsplash.com/photo-1579456409050-a17cf3856195?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Castel Sant`Angelo",
                img: "https://images.unsplash.com/photo-1562066919-f42721760188?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Rome Altare della Patria",
                img: "https://images.unsplash.com/photo-1433961050574-322241b350f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Scalinata di Trinità dei Monti",
                img: "https://images.unsplash.com/photo-1543264106-2d5ac5087193?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "The Pantheon in Rome",
                img: "https://images.unsplash.com/photo-1605200723310-5df264c13e22?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Chiostro del Bramante",
                img: "https://images.unsplash.com/photo-1627379765769-35ad30c7796d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Sistine Chapel Ceiling",
                img: "https://images.unsplash.com/photo-1576016770956-debb63d92058?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80"
            },
            {
                name: "San Nilo Abbey",
                img: "https://images.unsplash.com/photo-1620237277725-ff02b4c3a36f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80"
            },
            {
                name: "Basilica di Santa Croce in Gerusalemme",
                img: "https://images.unsplash.com/photo-1574538153391-71c701aa0555?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            },
            {
                name: "Chiesa del Sacro Cuore del Suffragio",
                img: "https://images.unsplash.com/photo-1580839481564-9589f6cd1e46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80"
            },
            {
                name: "Piazza Navona",
                img: "https://images.unsplash.com/photo-1587891770869-110104a6b5e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
        ],
        hotelImages: [
            "https://images.unsplash.com/photo-1594741158704-5a784b8e59fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1543759922-f81ec58cf811?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80",
            "https://images.unsplash.com/photo-1571080891604-6529cd14a71a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1641495054009-ba69942349b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
            "https://images.unsplash.com/photo-1543264106-2d5ac5087193?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1571159534681-0f12b04ba81d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1618483474116-b338caf9798f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80",
            "https://images.unsplash.com/photo-1576920434129-3a7f00a8429b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1618483474126-4571febd432f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80"
        ],
        hotelNames: [
            {
                first: ["Domus", "Hotel", "Maison", "Corso", "Casa"],
                second: ["Giulia", "Palazzo", "Roma", "Domus", "Colosseo", "San Giovanni", "Principe", "Quirinale", "Lunetta", "Ottaviani"],
                third: ["Maggiore", "Hotel", "Pirandello", "Palazzo", "Romoli", "Pietra"],
                fourth: ["Hotel"]
            }
        ],
        restaurantImages: [
            "https://images.unsplash.com/photo-1641924671908-43928ddba115?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1588685582221-28183cab4f8e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1596230003863-c7216ea8e07c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1133&q=80",
            "https://images.unsplash.com/photo-1507927822105-9a760e57a419?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1605200716925-7bc00504842f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1616362209401-0e51ad189ab3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1627379449673-4b64ed33ffc9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1558447828-309b45e54554?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1607028850922-49844ad1abf8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
            "https://images.unsplash.com/photo-1641924672191-3527599c4bd9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1641924671833-ab7c6c20f4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
            "https://images.unsplash.com/photo-1615932736372-f3ce2c21db45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1601371339865-97612837fd8a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1609949851943-ff5336d1129f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1380&q=80",
            "https://images.unsplash.com/photo-1607375658859-39f31567ce13?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1617562593428-9dfd3376a14e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1596826063192-380c2f9ec3dd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
            "https://images.unsplash.com/photo-1507927923899-e31ac1b6ff62?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1534425582704-65e021820688?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        restaurantNames: [
            {
                first: ["Ristorante","Pizzeria", "Cesare", "Cafe", "La Tradizione", "La Forchetta", "Cala", "Trattoria", "Raffaella", "La Vecchia", "La Pecora", "Taverna", "Romana", "Pasta"],
                second: ["Ristorante", "Angelica", "Romana", "Monti", "Luna", "d'Oro", "Boccaccia", "Fresca"],
                third: ["Ristorante"],
                fourth: ["Ristorante"]
            }
        ],
        getRandomPhoneNumber: (countryCode, cityCode) => {
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 11) {
                if (numbers.length % 4 === 0 || numbers.length % 8 === 0) {
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
            const typeOfPlaces = ["Piazza", "Via"];
            const namesOfStreet = ["Cristoforo Colombo", "di Grotta Perfetta", "Andrea Mantegna", "Luigi Capucci", "Pellegrino Matteucci", "del Porto Fluviale", "Ettore Rolli", "Aurelio Saffi", "Oreste Regnoli", "Giacinto Carini", "Angelo Masina", "Garibaldi", "Giacomo Medici", "Luciano Manara"];
            const zipCode = "001" + Math.floor(Math.random() * 3).toString() + Math.floor(Math.random() * 10).toString();
            const houseNumber = Math.floor(Math.random() * 222) + 1;
            const indexOfType = Math.floor(Math.random() * typeOfPlaces.length);
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);

            return `${typeOfPlaces[indexOfType]} ${namesOfStreet[indexOfName]} ${houseNumber}, ${zipCode} Roma, Italia`;
        }
    },
    {
        name: "Zurich",
        country: "Switzerland",
        country_code: "+41",
        city_code: "44",
        attractions: [
            {
                name: "Sechseläutenplatz - Zürich Opera House",
                img: "https://images.unsplash.com/photo-1533153035980-17eb5c94558f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Lindenhof",
                img: "https://images.pexels.com/photos/7899867/pexels-photo-7899867.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
            },
            {
                name: "Walk in the fabulous city",
                img: "https://www.utazastipp.hu/storage/article/zurich-orszag.png"
            },
            {
                name: "Sunset in the city",
                img: "https://images.pexels.com/photos/8585571/pexels-photo-8585571.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
            },
            {
                name: "Grossmünster",
                img: "https://www.hotelscombined.com/news/wp-content/uploads/sites/314/2017/02/image-1-GettyImages-1021372624-3-768x449.jpg"
            },
            {
                name: "Water tour of the picturesque town",
                img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1106&q=80"
            },
            {
                name: "Zürich Lake",
                img: "https://images.unsplash.com/photo-1599082323832-2676eca28e86?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
            },
            {
                name: "Zurich HB Main Station, Bahnhofplatz",
                img: "https://images.unsplash.com/photo-1585586813880-257f9b38d25d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "Zurich Central",
                img: "https://images.unsplash.com/photo-1558869584-c4b762c4b943?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Oberrieden",
                img: "https://images.unsplash.com/photo-1551340971-d97098f4b103?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
            },
            {
                name: "Bahnhof Zürich Enge",
                img: "https://images.unsplash.com/photo-1615980990642-a0c53141acd9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Zurich Zoo",
                img: "https://images.unsplash.com/photo-1584706368162-73c7dab84d68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            },
            {
                name: "The Fraumünster and the St. Peterskirche",
                img: "https://images.unsplash.com/photo-1623481054648-191537ba3c3d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "University of Zurich",
                img: "https://images.unsplash.com/photo-1601840698412-cbecc8039e6b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                name: "Veteran Cars",
                img: "https://images.unsplash.com/photo-1566592174127-8f2110feb0e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
            },
            {
                name: "Münsterplatz",
                img: "https://images.unsplash.com/photo-1566119241236-f69e721149ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
            },
            {
                name: "Shop line",
                img: "https://images.unsplash.com/photo-1560278652-d660200913e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
        ],
        hotelImages: [
            "https://images.pexels.com/photos/6284232/pexels-photo-6284232.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.pexels.com/photos/5379219/pexels-photo-5379219.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/3940733/pexels-photo-3940733.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/97083/pexels-photo-97083.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2725675/pexels-photo-2725675.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/271739/pexels-photo-271739.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2029698/pexels-photo-2029698.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            "https://images.pexels.com/photos/2952663/pexels-photo-2952663.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        ],
        hotelNames: [
            {
                first: ["Sterne", "Hotel", "Mercure", "Royal", "Krone"],
                second: ["Altstadt", "Sorell", "Zürich", "Sterne", "Seefeld", "Stoller", "Swiss", "Marktgasse", "Plattenhof", "Helmhaus"],
                third: ["Spirgarten", "Hotel", "Zürcherhof", "Sorell", "Wellenberg", "Landhaus"],
                fourth: ["Hotel"]
            }
        ],
        restaurantImages: [
            "https://images.unsplash.com/photo-1572097451629-e5c061b736fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
            "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1488992783499-418eb1f62d08?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1289&q=80",
            "https://images.unsplash.com/photo-1560053608-13721e0d69e8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1606066352252-93e4d325787b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1538334421852-687c439c92f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1569762848460-1e6301bdbea3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1622140739492-f82f386260b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
            "https://images.unsplash.com/photo-1554624219-4754a2ded336?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1564759224907-65b945ff0e84?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1507914372368-b2b085b925a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1585644156285-d7f4665407a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1560278593-0785b4db4827?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        ],
        restaurantNames: [
            {
                first: ["Restaurant", "Pizzeria", "Köchlistube", "Café", "Le Chef", "Schwarzes", "Guten", "Bederhof", "Sternen", "La Penisola", "Weisses", "Zürich", "Rietberg"],
                second: ["Restaurant", "Bernadette", "Zürich", "Végétale", "Linden", "Sonnenberg", "Glück", "Kreuz"],
                third: ["Restaurant"],
                fourth: ["Restaurant"]
            }
        ],
        getRandomPhoneNumber: (countryCode, cityCode) => {
            let counter = 0;
            const numbers = [];
            let result = "";

            while (counter < 10) {
                if (numbers.length % 4 === 0 && numbers.length !== 8 || numbers.length % 7 === 0) {
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
            const namesOfStreet = ["Badenerstrasse", "Rötelstrasse", "Fellenbergstrasse", "Schaffhauserstrasse", "Hofweisenstrasse", "Wasserwerkstrasse", "Limmattalstrasse", "Regensbergstrasse", "Dübendorfstrasse", "Winterthurerstrasse", "Leutschenbachstrasse", "Käshaldenstrasse", "Bärenbohlstrasse", "Rümlangerstrasse"];
            const zipCode = "80" + Math.floor(Math.random() * 2).toString() + Math.floor(Math.random() * 10).toString();
            const houseNumber = Math.floor(Math.random() * 554) + 1;
            const indexOfName = Math.floor(Math.random() * namesOfStreet.length);

            return `${namesOfStreet[indexOfName]} ${houseNumber}, ${zipCode} Zurich, Switzerland`;
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
    const id = getId();
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
        const id = getId();
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

const getId = () => {
    const letters = [
        "","A", "a", "B", 
        "","b", "C", "c", 
        "","D", "d", "E", 
        "","e", "F", "f", 
        "","G", "g", "H", 
        "","h", "I", "i", 
        "","J", "j", "K", 
        "","k", "L", "l", 
        "","M", "m", "N", 
        "","n", "O", "o", 
        "","P", "p", "Q", 
        "","q", "R", "r", 
        "","S", "s", "T", 
        "","t", "U", "u", 
        "","V", "v", "W", 
        "","w", "X", "x", 
        "","Y", "y", "Z", 
        "","z", "@", "&"
    ];
    let id = "";

    for (let i = 0; i < 12; i++) {
        const index = Math.floor(Math.random() * letters.length);
        if (index % 4 === 0) id += Math.floor(Math.random() * 10);
        else id += letters[index];
    }

    return id.trim();
}

app.get('/', (req, res) => {
    res.json("Welcome to my Travel Guid API");
});

//Request of hotels or restaurants or attractions or all services

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

    if (service === "all") {
        for (let i = 0; i < hotelImages.length; i++) {
            const label = "hotel";
            const image = hotelImages[i];
            const tel = getRandomPhoneNumber(countryCode, cityCode);
            const address = getRandomAddress();
            fillResponseArray(travelGuide.hotels, hotelNames, label, image, tel, address);
        }

        for (let i = 0; i < restaurantImages.length; i++) {
            const label = "restaurant";
            const image = restaurantImages[i];
            const tel = getRandomPhoneNumber(countryCode, cityCode);
            const address = getRandomAddress();
            fillResponseArray(travelGuide.restaurants, restaurantNames, label, image, tel, address);
        }

        fillAttractionsArray(cities, travelGuide.attractions, cityName);
    }

    if (service === "hotel") {
        const label = service;
        for (let i = 0; i < hotelImages.length; i++) {
            const image = hotelImages[i];
            const tel = getRandomPhoneNumber(countryCode, cityCode);
            const address = getRandomAddress();
            fillResponseArray(travelGuide.hotels, hotelNames, label, image, tel, address);
        }
    }

    if (service === "restaurant") {
        const label = service;
        for (let i = 0; i < restaurantImages.length; i++) {
            const image = restaurantImages[i];
            const tel = getRandomPhoneNumber(countryCode, cityCode);
            const address = getRandomAddress();
            fillResponseArray(travelGuide.restaurants, restaurantNames, label, image, tel, address);
        }
    }

    if (service === "attraction") {
        fillAttractionsArray(cities, travelGuide.attractions, cityName);
    }

    axios.get('https://www.randomtextgenerator.com/')
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            switch (service) {
                case "all":
                    getRandomText(travelGuide.attractions, html, $);
                    getRandomText(travelGuide.hotels, html, $);
                    getRandomText(travelGuide.restaurants, html, $);
                    res.json(travelGuide);
                    break;

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
});

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});