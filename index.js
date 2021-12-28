const PORT = process.env.PORT || 3333;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();

app.get('/', (req,res) => {
    res.json("Welcome to my Travel Guid API");
});

app.listen(PORT, ()=> {
    console.log(`Server running on PORT: ${PORT}`);
});