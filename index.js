import {
    languagesText
} from './weatherLanguage.js';

const weatherInformation = document.querySelector('.pricing-table');
const searchButton = document.querySelector('.input_submit');
const city = document.querySelector('.input_search');
const weatherApiKey = "ea04db02d64d4b2b6453bfc814cd3cf9";
const geolocationApiKey = "hqZM0yzr5AMhh6Au5FZzvResHAEELg2N";
const opencagedataKey = "236efb487f0e461d9f1e4483d233acac";
const refreshBtn = document.querySelector('.refresh');
let map;
let curLang = 'ru';
let lang = document.querySelector('.lang')
const dayInfo = document.querySelector('.current_date');
const timeInfo = document.querySelector('.current_time');
let temperatureBlock = document.querySelector('.temperature');
let index = 0;

function weatherAPI(units = 'imperial') {
    getCityGeolocation(city.value)
        .then(({
                lat,
                lng
            }) =>
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&lang=${curLang}`)
        )
        .then((resp) => resp.json())
        .then((data) => createWeatherBlocks(data, curLang))
        .catch((e) => alert(e));
}

function updateUserLocation(units = 'imperial') {
    getUserLocation()
        .then(([
                lat, lng
            ]) =>
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=${units}&lang=${curLang}`)
        )
        .then((resp) => resp.json())
        .then((data) => createWeatherBlocks(data, curLang))
        .catch((e) => alert(e));
}

function getCityGeolocation(cityName) {
    return fetch(`https://open.mapquestapi.com/geocoding/v1/address?key=${geolocationApiKey}&location=${cityName}`)
        .then((resp) => resp.json())
        .then((data) => data.results[0].locations[0].latLng)
}

function getUserLocation() {
    return fetch("https://ipinfo.io/json?token=2a0ee799551687")
        .then((response) => {
            return response.json();
        })
        .then((data) => data.loc.split(','))
        .catch((err) => {
            alert("Something went wrong");
            console.log("err getUserLocation")
        });
}

function createWeatherBlocks(dataInfo, curLang = 'en') {
    createWeatherCard(dataInfo, curLang);
    showWeatherDay(dataInfo);
}

function createWeatherCard(weatherInfo, curLang) {
    const translateParams = {
        currentCity: weatherInfo.city.name,
        temperature: Math.floor(weatherInfo.list[0].main.temp_max),
        feelsLike: Math.floor(weatherInfo.list[0].main.feels_like),
        wind: weatherInfo.list[0].wind['speed'],
        humidity: weatherInfo.list[0].main.humidity,
        overcast: weatherInfo.list[0].weather[0]["description"],
        latitude: weatherInfo.city.coord['lat'],
        longitude: weatherInfo.city.coord['lon']
    }

    document.querySelectorAll('[data-translate]').forEach(element => {
        const translateKey = element.dataset.translate;
        element.textContent = languagesText[curLang][translateKey].replace(`{{value}}`, translateParams[translateKey]);
    })

    city.placeholder = languagesText[curLang].searchCity;
    searchButton.textContent = languagesText[curLang].btnSearch;
    document.querySelector('.current_city').textContent = weatherInfo.city.name;
    document.querySelector('.temperature_symbol').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.list[0].weather[0].icon}@2x.png">`
}


function showWeatherDay(weatherInfo) {
    let langForTime;
    let today = Date.now();
    let dayNow = new Date(today);

    //Проверка, какой язык включен
    curLang === 'en' ? langForTime = 'en-US' : langForTime = 'ru-RU';

    document.querySelector('.current_day').textContent = new Intl.DateTimeFormat(langForTime, {
        weekday: 'long'
    }).format(dayNow);

    for (let i = 1; i <= 3; i++) {
        document.querySelector(`.day_${i}`).textContent = new Intl.DateTimeFormat(langForTime, {
            weekday: 'long'
        }).format(dayNow.setDate(dayNow.getDate() + 1));
    }

    for (let i = 1; i <= 3; i++) {
        document.querySelector(`.temp_${i}`).textContent = Math.floor((weatherInfo.list[`${i * 8}`].main.temp_max));
        document.querySelector(`.icon_${i}`).innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.list[`${i*8}`].weather[0].icon}@2x.png">`;
    }
}


const randomBackground = () => {
    const weatherBackground = document.querySelector('.weather');
    const backgrounds = [
        "url(img/1.jpg)",
        "url(img/2.jpg)",
        "url(img/3.jpg)"
    ];

    let item = backgrounds[index];
    index++;
    if (index >= backgrounds.length) {
        index = 0;
    }
    weatherBackground.style.background = item;
    weatherBackground.style.backgroundSize = 'cover';
}

function getTemperature(temperature) {
    if (!city.value) {
        if (temperature === 'faringeit') {
            updateUserLocation('imperial')
        } else {
            updateUserLocation('metric')
        }
    } else {
        if (temperature === 'faringeit') {
            weatherAPI('imperial')
        } else {
            weatherAPI('metric')
        }
    }
}



let weatherPanel = document.querySelector('.weather_panel');
weatherPanel.addEventListener('click', (e) => {
    let target = e.target.parentNode;
    let buttons = target.querySelectorAll('button');
    buttons.forEach(elem => {
        console.log(elem)
        elem.classList.remove('button_active')
        let targetAttribute = elem.getAttribute('data-info')
        console.log(targetAttribute)
    })
    target.classList.add('button_active')
   
}); 


// lang.addEventListener('click', (e) => {
//     let target = e.target;
//     let langName = target.getAttribute('data-langName')
//     let langButtons = lang.querySelectorAll('button')
//     langButtons.forEach(item => {
//         item.classList.remove('button_active')
//     })
//     target.classList.add('button_active')

//     if (langName === 'ru') {
//         curLang = 'ru'
//     } else {
//         curLang = 'en'
//     }

//     if (city.value == '') {
//         weatherAPI();
//     } else {
//         weatherAPI();
//     }
// })

// temperatureBlock.addEventListener('click', (e) => {
//     let target = e.target;
//     let temperatureName = target.getAttribute('data-temperatureName');
//     let temperatureButtons = temperatureBlock.querySelectorAll('button')
//     temperatureButtons.forEach(item => {
//         item.classList.remove('button_active')
//     })
//     target.classList.add('button_active')
//     getTemperature(temperatureName)
// })

function addZero(n) {
    //добавление 0 для времени
    return `0${n}`.slice(-2)
}

function getTimeInfo() {
    let data = new Date();
    return {
        hour: data.getHours(),
        min: data.getMinutes(),
        sec: data.getSeconds(),
        dayName: data.getDay(),
        day: data.getDate(),
    }
}

function showDateTime() {
    let dateTimeInfo = getTimeInfo();
    timeInfo.textContent = `${addZero(dateTimeInfo.hour)}:${addZero(dateTimeInfo.min)}:${addZero(dateTimeInfo.sec)}`;
}

function getUserMap() {
    getUserLocation()
        .then(([lat, lng]) => init(lat, lng))
}

function getSearchMap() {
    getCityGeolocation(city.value)
        .then((data) => {
            if (map) {
                flyTo(data.lat, data.lng)
            } else {
                init(data.lat, data.lng)
            }
        })
}

function init(lat, lng) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmFuZ3VzIiwiYSI6ImNrcDN6cWUycTFmY2gycG13YXV4aGY0eHEifQ.a3Eu2Aj9YHQUeSlYJn2Xiw';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 10.2
    });
}

function flyTo(lat, lng) {
    map.flyTo({
        center: [lng, lat],
        essential: true,
        zoom: 10,
        pitch: 45,
        bearing: 27,
    });
}


searchButton.addEventListener('click', () => {
    weatherAPI(),
        getSearchMap()
});

updateUserLocation();
//Кнопка обновления фона
refreshBtn.addEventListener('click', randomBackground);
setInterval(showDateTime, 1000);
getUserMap();