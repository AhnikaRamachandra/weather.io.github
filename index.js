let searchInp=document.querySelector('.weathersearch');
let city=document.querySelector('.weathercity');
let day =document.querySelector('.weatherday');
let humidity=document.querySelector('.weatherindicator--humidity>.value');
let wind=document.querySelector('.weatherindicator--wind>.value');
let pressure =document.querySelector('.weatherindicator--pressure>.value');
let image=document.querySelector('.weatherimage');
let temperature=document.querySelector('.weathertemperature>.value');




let weatherAPIKey ='a508872cc9b050ffac8a70db4fb0d65b';
let weatherBaseEndpoint='https://api.openweathermap.org/data/2.5/weather?units=metric&appid='+weatherAPIKey;
let getWeatherBycityname=async (city)=>{
    let endpoint =weatherBaseEndpoint+'&q='+city;
   let response= await fetch(endpoint);
   let weather=await response.json();
   return weather
}
searchInp.addEventListener('keydown', async(e)=>{
    if (e.keyCode===13) {
    let weather= await getWeatherBycityname(searchInp.value);
    let forecast = await getFiveDayForecast(searchInp.value);
updateCurrentWeather(weather);
updateFiveDayForecast(forecast);
    }
})
 let updateCurrentWeather = (data) =>{
    console.log(data)
   city.textContent = data.name  +', ' +  data.sys.country;
 day.textContent=dayofweek();
 humidity.textContent=data.main.humidity;
 pressure.textContent=data.main.pressure;
 let deg=data.wind.deg;
 if(deg>45&&deg<=135){
    winddirection='East';
 }
 else if (deg>135&&deg<=225) {
    winddirection='South';
 }
 else if (deg>225&&deg<=315) {
    winddirection='West';
 }
 else{
    winddirection='North';
 }
 wind.textContent=winddirection+' ,'+data.wind.speed;
temperature.textContent=data.main.temp>0 ?'+' +Math.round(data.main.temp) :Math.round(data.main.temp);


}
 let dayofweek=()=>{
   return new Date().toLocaleDateString('en-EN',{'weekday':'long'});
 }

const getFiveDayForecast = async (city) => {
    let endpoint = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${weatherAPIKey}&q=${city}`;
    let response = await fetch(endpoint);
    let forecast = await response.json();
    return forecast;
}


const updateFiveDayForecast = (data) => {
    const forecastItems = document.querySelectorAll('.weatherforecast--item');

    
    for (let i = 0; i < forecastItems.length; i++) {
        const forecast = data.list[i * 8]; 
        const forecastItem = forecastItems[i];

        forecastItem.querySelector('.weatherforecastday').textContent = getDayName(forecast.dt);
        forecastItem.querySelector('.weatherforecasttemperature .value').textContent = `${Math.round(forecast.main.temp)}°C`;
        
    }
}


const getDayName = (timestamp) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(timestamp * 1000); 
    return days[date.getDay()];
}

 updateCurrentWeather = (data) => {
    // ... Other weather data updates ...

    // Get the weather condition icon code
    const weatherIconCode = data.weather[0].icon; // Assuming the API provides an icon code

    // Construct the image source URL using the weather icon code
    const weatherImageSrc = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

    // Update the image source
    image.src = weatherImageSrc;
}


 updateFiveDayForecast = (data) => {
    const forecastItems = document.querySelectorAll('.weatherforecast--item');

    // Loop through the forecast data and update each forecast item
    for (let i = 0; i < forecastItems.length; i++) {
        const forecast = data.list[i * 8]; // Forecast data for every 8th interval (next day)
        const forecastItem = forecastItems[i];

        // Update the image source based on the weather condition icon code
        const weatherIconCode = forecast.weather[0].icon; // This will be something like '04d' or '10n'
        const weatherImageSrc = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;

        // Update the image source of the forecast item
        const forecastImage = forecastItem.querySelector('.weatheforecasticon');
        forecastImage.src = weatherImageSrc;

        // Update other forecast details as needed (e.g., day, temperature, etc.).
        forecastItem.querySelector('.weatherforecastday').textContent = getDayName(forecast.dt);
        forecastItem.querySelector('.weatherforecasttemperature .value').textContent = `${Math.round(forecast.main.temp)}°C`;
    }
}
