# travel-guide-api

This api giving data of restaurants, and hotels and attractions from several cities for a web application.

## **Using for this api:**

Add this URL part of api for your application.

`https://travelguide-api.herokuapp.com/addresses/{service}/{cityName}`

Valid optional services are:

| /all | /attractions | /hotels | /restaurants |
| ---- | ------------ | ------- | ------------ |

Valid optional city names are:

| /Athens | /Barcelona | /Cairo | /Istanbul | /Lisbon | /London | /Montreal | /Munich | /New-York | /Paris | /Rome | /Zurich |
| ------- | ---------- | ------ | --------- | ------- | ------- | --------- | ------- | --------- | ------ | ----- | ------- |

## **For example, for Laravel 6 + Vue.js**

I use a program called zttp which written in php.

## Installation: 

**`composer require kitetail/zttp`**



Setting in Laravel 6: `routes/api.php`

```php
<?php

use Zttp\Zttp;
use Illuminate\Http\Request;

Route::get('/travel-guide', function () {
        $service = request('service');
        $cityName = request('cityName');
        $response = Zttp::get("https://travelguideapi.herokuapp.com/addresses/$service/$cityName");
        return $response -> json();
});
```

Setting in Vue.js: `resources/assets/js/components/TravelGuide.vue`

```javascript
export default {
	data(){
        return {
            service: "",
            cityName: ""
        }
    },

    methods: {
        fetchData() {
            fetch(`/api/travel-guide?service=${this.service}&cityName=${this.cityName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            }
        }
    }
}

```

