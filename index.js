const weatherInformation = document.querySelector('.pricing-table');
const searchButton = document.querySelector('.input_submit');
const city = document.querySelector('.input_search');
const weatherApiKey = "ea04db02d64d4b2b6453bfc814cd3cf9";
const geolocationApiKey = "hqZM0yzr5AMhh6Au5FZzvResHAEELg2N";
const opencagedataKey = "236efb487f0e461d9f1e4483d233acac";
const refreshBtn = document.querySelector('.refresh');
let map;

let curLang = 'en';
let langForTime;

let lang = document.querySelector('.lang')
const dayInfo = document.querySelector('.current_date');
const timeInfo = document.querySelector('.current_time');

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
        .then((data) => data)
        .then((data) => data.loc.split(','))

        .catch((err) => {
            alert("Something went wrong");
            console.log("err getUserLocation")
        });
}

updateUserLocation();

function createWeatherBlocks(dataInfo, curLang = 'en') {
    createWeatherCard(dataInfo,curLang);
    showWeatherDay(dataInfo);
}


function createWeatherCard(weatherInfo, curLang) {
    console.log(curLang)
    city.placeholder = languagesText[curLang].searchCity;
    searchButton.textContent = languagesText[curLang].btnSearch;
    document.querySelector('.current_city').textContent = weatherInfo.city.name;
    document.querySelector('.temperature_number span').textContent = Math.floor(weatherInfo.list[0].main.temp_max);
    document.querySelector('.feels_like').textContent = languagesText[curLang].feelsLike  + ':'+ Math.floor(weatherInfo.list[0].main.feels_like);
    document.querySelector('.wind').textContent = languagesText[curLang].wind + ':' + weatherInfo.list[0].wind['speed'] + languagesText[curLang].windSpeedUnit;
    document.querySelector('.humidity').textContent = languagesText[curLang].humidity + ':' + weatherInfo.list[0].main.humidity + '%';
    document.querySelector('.details_clouds').textContent = languagesText[curLang].feelsLike + ':' + weatherInfo.list[0].weather[0]["description"];
    document.querySelector('.temperature_symbol').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.list[0].weather[0].icon}@2x.png">`
    document.querySelector('.coordinates_lat').textContent = languagesText[curLang].latitude + ':' + weatherInfo.city.coord['lat'];
    document.querySelector('.coordinates_lng').textContent =languagesText[curLang].longitude + ':' +  weatherInfo.city.coord['lon'];
    
}


function showWeatherDay(weatherInfo) {
    let today = Date.now(),
        first = new Date(today),
        second = new Date(today),
        third = new Date(today),
        dayNow = new Date(today);
    
    dayNow.setDate(dayNow.getDate());
    first.setDate(first.getDate() + 1);
    second.setDate(second.getDate() + 2);
    third.setDate(third.getDate() + 3);
   

   //Проверка, какой язык включен
    curLang === 'en' ? langForTime = 'en-US' : langForTime = 'ru-RU';

    document.querySelector('.current_day').textContent = new Intl.DateTimeFormat(langForTime, { weekday: 'long' }).format(dayNow);
    document.querySelector(`.day_1`).textContent = new Intl.DateTimeFormat(langForTime, { weekday: 'long' }).format(first);
    document.querySelector(`.day_2`).textContent = new Intl.DateTimeFormat(langForTime, { weekday: 'long' }).format(second);
    document.querySelector(`.day_3`).textContent = new Intl.DateTimeFormat(langForTime, { weekday: 'long' }).format(third);
    
    for (let i = 1; i <= 3; i++) {
        document.querySelector(`.temp_${i}`).textContent = Math.floor((weatherInfo.list[`${i * 8}`].main.temp_max));
        document.querySelector(`.icon_${i}`).innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.list[`${i*8}`].weather[0].icon}@2x.png">`;
    }
}

let index = 0;
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


//Кнопка обновления фона
refreshBtn.addEventListener('click', randomBackground);

const languagesText = {
    en: {
      dayNames: ['Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday',
      ],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ],
      temp: 'Temp',
      feelsLike: 'Feels like',
      wind: 'Wind',
      windSpeedUnit: 'm/s',
      humidity: 'Humidity',
      longitude: 'Longitude',
      latitude: 'Latitude',
      btnBackground: 'Background',
      btnVoice: 'Voice',
      btnSearch: 'Search',
      searchCity: 'Search city',
    },
    ru: {
      dayNames: ['Воскресенье', 'Понедельник', 'Вторник',
        'Среда', 'Четверг', 'Пятница', 'Суббота',
      ],
      monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
      ],
      temp: 'Температура',
      feelsLike: 'Ощущение',
      wind: 'Ветер',
      windSpeedUnit: 'м/с',
      humidity: 'Влажность',
      longitude: 'Долгота',
      latitude: 'Широта',
      btnBackground: 'Фон',
      btnVoice: 'Голос',
      btnSearch: 'Поиск',
      searchCity: 'Поиск города',
    },
  };




//Изменения языка
// function changeLanguage(lang) {
//     if (lang === 'ru') {
//         searchButton.value = 'ПОИСК';
//         city.placeholder = "Название города";
//         document.querySelector('.coordinates_lat b').innerHTML = 'Широта';
//         document.querySelector('.coordinates_lng b').innerHTML = 'Долгота';
//         document.querySelector('.feels_like b').textContent = 'ОЩУЩАЕТСЯ';
//         document.querySelector('.wind b').textContent = 'ВЕТЕР ';
//         document.querySelector('.humidity b').textContent = 'ВЛАЖНОСТЬ ';
//     } else {
//         searchButton.value = 'SEARCH';
//         city.placeholder = "Search city";
//         document.querySelector('.coordinates_lat b').innerHTML = 'Latitude';
//         document.querySelector('.coordinates_lng b').innerHTML = 'Longitude';
//         document.querySelector('.feels_like b').textContent = `FEELS LIKE `;
//         document.querySelector('.wind b').textContent = 'WIND ';
//         document.querySelector('.humidity b').textContent = 'HUMIDITY ';
//     }
// }

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

lang.addEventListener('click', (e) => {
    let target = e.target;
    let langName = target.getAttribute('data-langName')
    let langButtons = lang.querySelectorAll('button')
    langButtons.forEach(item => {
        item.classList.remove('button_active')
    })
    target.classList.add('button_active')
    
   if(langName === 'ru'){
       curLang = 'ru'
   } else {
       curLang = 'en'
    }

   
    if (city.value = '') {
        console.log(1)
        getUserLocation();
    } else {
        console.log(1)
        weatherAPI();
    }
    
})

let temperatureBlock = document.querySelector('.temperature');

temperatureBlock.addEventListener('click', (e) => {
    let target = e.target;
    let temperatureName = target.getAttribute('data-temperatureName');
    let temperatureButtons = lang.querySelectorAll('button')
    temperatureButtons.forEach(item => {
        item.classList.remove('button_active')
    })
    target.classList.add('button_active')
    getTemperature(temperatureName)
})

//Время

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
    let today = Date.now();
    let dayNow = new Date(today);
    dayNow.setDate(dayNow.getDate());

    
    timeInfo.textContent = `${addZero(dateTimeInfo.hour)}:${addZero(dateTimeInfo.min)}:${addZero(dateTimeInfo.sec)}`;
}
setInterval(showDateTime, 1000);


function getUserMap() {
    getUserLocation()
        .then((data) => data)
        .then(([lat, lng]) => init(lat, lng))
}

function getSearchMap() {
    getCityGeolocation(city.value)
        .then((data) => data)
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
    let mapName = {
        bearing: 27,
        center: [lng,lat],
        zoom: 10.2,
        pitch: 45,
        essential: true
    }
    map.flyTo(mapName);
}

searchButton.addEventListener('click', () => {
    weatherAPI(),
    getSearchMap()
});

getUserMap();




