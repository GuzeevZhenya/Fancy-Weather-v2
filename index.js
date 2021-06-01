const weatherInformation = document.querySelector('.pricing-table');
const searchButton = document.querySelector('.input_submit');
const city = document.querySelector('.input_search');
const weatherApiKey = "ea04db02d64d4b2b6453bfc814cd3cf9";
const geolocationApiKey = "hqZM0yzr5AMhh6Au5FZzvResHAEELg2N";
const opencagedataKey = "236efb487f0e461d9f1e4483d233acac";
const refreshBtn = document.querySelector('.refresh');
const en = document.getElementById('en');
const ru = document.getElementById('ru');


searchButton.addEventListener('click', () => weatherAPI());


// function getApiData() {
//     getCityGeolocation(city.value)
//     .then((data) => data.loc.split(','))
//         .then(({
//                 lat,
//                 lng
//             }) =>
//             fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${weatherApiKey}`)
//         )
//         .then((resp) => resp.json())
//         .then((data) => createWeatherBlocks(data))
//         .catch((e) => alert(e));
// }

function weatherAPI() {
    getCityGeolocation(city.value)
        .then(({
                lat,
                lng
            }) =>
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${weatherApiKey}`)
        )
        .then((resp) => resp.json())
        .then((data) => createWeatherBlocks(data))
        .catch((e) => alert(e));
}

function getCityGeolocation(cityName) {
    return fetch(`https://open.mapquestapi.com/geocoding/v1/address?key=${geolocationApiKey}&location=${cityName}`)
        .then((resp) => resp.json())
        .then((data)=>console.log(data))
        .then((data) => data.results[0].locations[0].latLng)
}
function updateUserLocation() {
    getUserLocation()
        .then((data) => data.loc.split(','))
        .then(([
                lat, lng
            ]) =>
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${weatherApiKey}`)
        )
        .then((resp) => resp.json())
        .then((data) => createWeatherBlocks(data))
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

updateUserLocation();

function createWeatherBlocks(dataInfo) {
    createWeatherCard(dataInfo);
    showWeatherDay(dataInfo);
}


function createWeatherCard(weatherInfo) {
    console.log(weatherInfo)
    document.querySelector('.current_city').textContent = weatherInfo.city.name;
    document.querySelector('.temperature_number span').textContent = Math.floor(weatherInfo.list[0].main.temp_max);
    document.querySelector('.feels_like span').textContent = Math.floor(weatherInfo.list[0].main.feels_like);
    document.querySelector('.wind span').textContent = weatherInfo.list[0].wind['speed'];
    document.querySelector('.humidity span').textContent = weatherInfo.list[0].main.humidity;
    document.querySelector('.details_clouds').textContent = weatherInfo.list[0].weather[0]["description"];
    document.querySelector('.temperature_symbol').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.list[0].weather[0].icon}@2x.png">`
    // document.querySelector('.coordinates_lat span').textContent = weatherInfo.results[0].geometry['lat'];
    // document.querySelector('.coordinates_lng span').textContent = weatherInfo.results[0].geometry['lng'];
}


function showWeatherDay(weatherInfo) {
   
    let week = [];

    week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday",
    ];
    let today = new Date();
    let day = today.getDay();
    document.querySelector('.current_day').textContent = week[day];

    for (let i = 1; i <= 3; i++) {
        document.querySelector(`.day_1`).textContent = week[day + 1];
        document.querySelector(`.temp_${i}`).textContent = Math.floor((weatherInfo.list[`${i * 8}`].main.temp_max));
        document.querySelector(`.icon_${i}`).innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.list[`${i*8}`].weather[0].icon}@2x.png">`;
    }

    // document.querySelector(`.temp_1`).textContent = Math.floor((weatherInfo.list[8].main.temp_max));
    // document.querySelector(`.icon_1`).innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.list[8].weather[0].icon}@2x.png">`;

    // document.querySelector(`.temp_2`).textContent = Math.floor((weatherInfo.list[16].main.temp_max));
    // document.querySelector(`.icon_2`).innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.list[16].weather[0].icon}@2x.png">`;

    // document.querySelector(`.temp_3`).textContent = Math.floor((weatherInfo.list[24].main.temp_max));
    // document.querySelector(`.icon_3`).innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.list[24].weather[0].icon}@2x.png">`;
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

let lang = document.querySelector('.lang')

lang.addEventListener('click', (e) => {
    let target = e.target;
    let langName = target.getAttribute('data-langName')
    let langButtons = lang.querySelectorAll('button')
    langButtons.forEach(item => {
        item.classList.remove('button_active')
    })
    target.classList.add('button_active')
    changeLanguage(langName)
})

//Время

const dayInfo = document.querySelector('.current_date');
const timeInfo = document.querySelector('.current_time');
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
    dayInfo.textContent = `${dateTimeInfo.day} ${monthNames[dateTimeInfo.dayName+2]}`
    timeInfo.textContent = `${addZero(dateTimeInfo.hour)}:${addZero(dateTimeInfo.min)}:${addZero(dateTimeInfo.sec)}`;
}
setInterval(showDateTime, 1000);


// function getUserMap() {
//     getUserLocation()
//         .then((data) => data)
//         .then((data) => data.loc.split(','))
//         .then(([lat, lng]) => initMap(lat, lng))
// }

// function getSearchMap() {
//     getCityGeolocation()
//         .then((data) => data)
//         .then((data) => initMap(data.lat, data.lng))
// }

// function initMap(lat, lng) {
//     let element = document.getElementById('map');
//     let options = {
//         zoom: 10,
//         center: {
//             lat: +lat,
//             lng: +lng
//         }
//     };
//     let myMap = new google.maps.Map(element, options)
// }

// getSearchMap();