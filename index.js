const weatherInformation = document.querySelector('.pricing-table');
const searchButton = document.querySelector('.input_submit');
const city = document.querySelector('.input_search');
const weatherApiKey = "ea04db02d64d4b2b6453bfc814cd3cf9";
const geolocationApiKey = "hqZM0yzr5AMhh6Au5FZzvResHAEELg2N";

const refreshBtn = document.querySelector('.refresh');
const en = document.querySelector('.en');
const ru = document.querySelector('.ru');


searchButton.addEventListener('click', () => weatherAPI('daily'));

function weatherAPI(weatherType) {
    getCityGeolocation(city.value)
        .then(({
                lat,
                lng
            }) =>

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&dt=1586468027&lang=ru&appid=${weatherApiKey}`)
        )

        .then((resp) => resp.json())
        .then((data) => createWeatherBlocks(data[weatherType], weatherType, data.lat, data.lon))

        .catch((e) => alert(e));
}

function getCityGeolocation(cityName) {
    return fetch(`https://open.mapquestapi.com/geocoding/v1/address?key=${geolocationApiKey}&location=${cityName}`)
        .then((resp) => resp.json())
        .then((data) => data.results[0].locations[0].latLng)
}



function updateUserLocation(weatherType) {
    getUserLocation()
        .then((data) => data)
        .then((data) => data.loc.split(','))
        .then(([
                lat, lng
            ]) =>
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&dt=1586468027&lang=ru&appid=${weatherApiKey}`)
        )
        .then((resp) => resp.json())
        .then((data) => createWeatherBlocks(data[weatherType], weatherType, data.lat, data.lon, city))
        .catch((e) => alert(e));
}

function getUserLocation() {
    return fetch("https://ipinfo.io/json?token=2a0ee799551687")
        .then((response) => {
            return response.json();
        })
        .then((data) => data)

        .catch((err) => {
            alert("Something went wrong");
            console.log("err getUserLocation")
        });
}
updateUserLocation('daily');



function createWeatherBlocks(dataInfo, weatherType, lat, lon) {
    createWeatherCard(dataInfo[0], city.value, weatherType, lat, lon);
    showWeatherDay(dataInfo);
}


function createWeatherCard(weatherInfo, cityName, weatherType, lat, lon) {
    const temp = Math.floor(weatherType === 'hourly' ? weatherInfo.temp : weatherInfo.temp.day) - 273;
    document.querySelector('.current_city').textContent = cityName ? cityName : 'В вашем городе';
    document.querySelector('.temperature_number span').textContent = temp;
    document.querySelector('.wind span').textContent = weatherInfo.wind_speed;
    document.querySelector('.humidity span').textContent = weatherInfo.humidity;
    document.querySelector('.details_clouds').textContent = weatherInfo.weather[0]["description"];
    document.querySelector('.temperature_symbol').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png">`
    document.querySelector('.coordinates_lat span').textContent = lat;
    document.querySelector('.coordinates_lng span').textContent = lon;
}


function showWeatherDay(weatherInfo, dayNumber) {
    let dateTimeInfo = getTimeInfo();
    document.querySelector('.day_1').textContent = `${weekDays[dateTimeInfo.dayName - 6]} `
    document.querySelector('.temp_1').textContent = Math.floor(weatherInfo[1].temp.day - 273);
    document.querySelector('.icon_1').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo[1].weather[0].icon}@2x.png">`;
    document.querySelector('.day_2').textContent = `${weekDays[dateTimeInfo.dayName -5]} `
    document.querySelector('.temp_2').textContent = Math.floor(weatherInfo[2].temp.day - 273);
    document.querySelector('.icon_2').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo[2].weather[0].icon}@2x.png">`;
    document.querySelector('.day_3').textContent = `${weekDays[dateTimeInfo.dayName - 4]} `
    document.querySelector('.temp_3').textContent = Math.floor(weatherInfo[3].temp.day - 273);
    document.querySelector('.icon_3').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo[3].weather[0].icon}@2x.png">`;
}

let index = 0;
const randomBackground = () => {
    const weatherBackground = document.querySelector('.weather');
    const backgrounds = [
        "url(img/weather.jpg)",
        "url(img/1.jpg)",
        "url(img/2.jpg)"
    ];

    let item = backgrounds[index];
    index++;
    if (index >= backgrounds.length) {
        index = 0;
    }

    weatherBackground.style.background = item;
    weatherBackground.style.backgroundSize = 'cover';
}


//Кнопка обновления фона
refreshBtn.addEventListener('click', randomBackground);


//Изменения языка
function changeLanguage(lang) {
    if (lang === 'ru') {
        searchButton.value = 'ПОИСК';
        city.placeholder = "Название города";
        document.querySelector('.coordinates_lat').innerHTML = 'Широта:';
        document.querySelector('.coordinates_lng').innerHTML = 'Долгота:';
        document.querySelector('.feels_like').textContent = 'ОЩУЩАЕТСЯ:';
        document.querySelector('.wind').textContent = 'ВЕТЕР: ';
        document.querySelector('.humidity').textContent = 'ВЛАЖНОСТЬ: ';
    } else {
        searchButton.value = 'SEARCH';
        city.placeholder = "Search city";
        document.querySelector('.coordinates_lat').innerHTML = 'Latitude:';
        document.querySelector('.coordinates_lng').innerHTML = 'Longitude:';
        document.querySelector('.feels_like').textContent = `FEELS LIKE :`;
        document.querySelector('.wind').textContent = 'WIND: ';
        document.querySelector('.humidity').textContent = 'HUMIDITY: ';
    }
}

en.addEventListener('click', () => {
    en.classList.add('button_active');
    ru.classList.remove('button_active');
    changeLanguage('en')
})

ru.addEventListener('click', () => {
    en.classList.remove('button_active');
    ru.classList.add('button_active');
    changeLanguage('ru');
})

//Время

const dayTime = document.querySelector('.current_date');
const dayInfo = document.querySelector('.current_day');
const time = document.querySelector('.current_time');
const weekDays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const monthNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function getTimeInfo(hour) {
    if (hour > 0 && hour < 5) {
        return 'Доброй ночи'
    } else if (hour > 6) {
        return 'Утро'
    } else if (hour > 11) {
        return 'День'
    } else {
        return 'Вечер'
    }
}

function getTimeInfo() {
    let data = new Date();
    let hour = data.getHours(); //Время
    let min = data.getMinutes(); //Минуты
    let sec = data.getSeconds(); //Секунды
    let dayName = data.getDay(); //День
    let day = data.getDate();
    return {
        hour,
        min,
        sec,
        dayName,
        day
    }
}

function showDateTime() {
    let dateTimeInfo = getTimeInfo();
    dayInfo.textContent = `${weekDays[dateTimeInfo.dayName]} `
    dayTime.textContent = `${dateTimeInfo.day} ${monthNames[dateTimeInfo.dayName]}`
    time.textContent = `${addZero(dateTimeInfo.hour)}:${addZero(dateTimeInfo.min)}:${addZero(dateTimeInfo.sec)}`;
}
setInterval(showDateTime, 1000);


// const map_container = document.querySelector("#map");

// function getMap(coords) {
//     mapboxgl.accessToken = 'pk.eyJ1Ijoia2lzbG9yb2QiLCJhIjoiY2tvcHhsbDVwMHBzeTJ2c2o1djVzODY3eSJ9.S2bQVUWkOds89dtJzU-12Q';
//     var map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/streets-v11',
//         center: [coords[1], coords[0]],
//         zoom: 9
//     });

//     map.on('click', function (e) {
//         getWeather(getWeatherApiUrlByCoords([e.lngLat.lat, e.lngLat.lng]));
//     });

//     var marker = new mapboxgl.Marker()
//         .setLngLat([coords[1], coords[0]])
//         .addTo(map);

//     document.querySelector(".mapboxgl-ctrl-bottom-right").innerHTML = "";
// }

// function getMapCoords() {
//     console.log(map.transform.center);
// }

// async function getMyCity() {
//     const url = "https://ipinfo.io/json?token=74a0efcb8235f4";
//     const res = await fetch(url);
//     const data = await res.json();
//     return data.city;
// }


// getMap(weatherCoords);
function getUserMap() {
    getUserLocation()
        .then((data) => data)
        .then((data) => data.loc.split(','))
        // .then(({
        //     lat,
        //     lng
        // }))
        .then(initMap)
}


function initMap(lat, lng) {
    let element = document.getElementById('map');

    let options = {
        zoom: 5,
        center: {
            lat: `${lat}`,
            lng: `${lng}`
        }
    };
    let myMap = new google.maps.Map(element, options);
}

getUserMap();