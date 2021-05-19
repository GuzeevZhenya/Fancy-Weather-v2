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
        .then((data) => createWeatherBlocks(data[weatherType], weatherType))
        .catch((e) => alert(e));
}

function getCityGeolocation(cityName) {
    return fetch(`https://open.mapquestapi.com/geocoding/v1/address?key=${geolocationApiKey}&location=${cityName}`)
        .then((resp) => resp.json())
        .then((data) => data.results[0].locations[0].latLng)

}

function createWeatherBlocks(dataInfo, weatherType) {
    //  weatherInformation.textContent = "";

    for (let i = 0; i < 4; i++) {
        console.log(dataInfo[i])
        createWeatherCard(dataInfo[0], city.value, weatherType);
        secondDay(dataInfo[1]);
        thirdDay(dataInfo[2]);
        fourdDay(dataInfo[3]);
    }
}


function createWeatherCard(weatherInfo, cityName, weatherType) {
    const temp = Math.floor(weatherType === 'hourly' ? weatherInfo.temp : weatherInfo.temp.day) - 273;
    document.querySelector('.current_city').textContent = cityName;
    document.querySelector('.temperature_number span').textContent = temp;
    document.querySelector('.wind span').textContent = weatherInfo.wind_speed;
    document.querySelector('.humidity span').textContent = weatherInfo.humidity;
    document.querySelector('.details_clouds').textContent = weatherInfo.weather[0]["description"];
    document.querySelector('.temperature_symbol').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png">`
}

function secondDay(weatherInfo) {
    let dateTimeInfo = getTimeInfo();
    const temp = Math.floor(weatherInfo.temp.day - 273);
    document.querySelector('.day_1').textContent = `${weekDays[dateTimeInfo.dayName+1]} `
    document.querySelector('.temp_1').textContent = temp
    document.querySelector('.icon_1').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png">`
}

function thirdDay(weatherInfo) {
    let dateTimeInfo = getTimeInfo();
    const temp = Math.floor(weatherInfo.temp.day - 273);
    document.querySelector('.day_2').textContent = `${weekDays[dateTimeInfo.dayName+2]} `
    document.querySelector('.temp_2').textContent = temp
    document.querySelector('.icon_2').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png">`
}

function fourdDay(weatherInfo) {
    let dateTimeInfo = getTimeInfo();
    const temp = Math.floor(weatherInfo.temp.day - 273);
    document.querySelector('.day_3').textContent = `${weekDays[dateTimeInfo.dayName+3]} `
    document.querySelector('.temp_3').textContent = temp
    document.querySelector('.icon_3').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png">`
}

let index = 0;
const randomBackground = () => {
    let weatherBackground = document.querySelector('.weather');
    let backgrounds = [
        "url(img/weather.jpg)",
        "url(img/1.jpg)",
        "url(img/2.jpg)"
    ];
    // let randomImg = backgrounds[Math.floor(Math.random() * (backgrounds.length + 1))];
    
    let item = backgrounds[index];
    index++;
    if (index >= backgrounds.length) {
        index = 0;
    }
     
     weatherBackground.style.background = item;
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
let weekDays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
let monthNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

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
    let dateNow = new Date().getTime();
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