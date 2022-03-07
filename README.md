# travel-guide-api
This api giving data of restaurants, and hotels and attractions from several cities for a web application.

## **Using for this api:**

 Add this endpoint part of api for your application.

`https://travelguide-api.herokuapp.com/addresses/{service}/{cityName}`

## **For example, for Laravel 6 + Vue.js**

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

Setting in Vue.js:

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

