'use strict'
 
window.onload = ()=>{
    cityDropdown()
    
    let citiesDropdown = document.querySelector('#citiesDropdown')
    let getLocationButton = document.querySelector('#getLocationButton')
    getLocationButton.addEventListener('click',getYourLocationData)
    citiesDropdown.addEventListener('change', getCityData)
}

function cityDropdown(){
    let citiesDropdown = document.querySelector('#citiesDropdown')
    let defaultOption = document.createElement('option')
    defaultOption.textContent = 'Select a City'
        defaultOption.value = ''
        citiesDropdown.appendChild(defaultOption)
    for(let i = 0; i<cities.length;i++){
        let cityOption = document.createElement('option')
        cityOption.textContent = cities[i].name
        cityOption.value = cities[i].name
        citiesDropdown.appendChild(cityOption)
    }
   
}

function getCityData(){
    let citiesDropdown = document.querySelector('#citiesDropdown')
    let tableBody = document.querySelector('#tableBody')
   let chosen= citiesDropdown.selectedIndex -1
   if(chosen === -1){
    return tableBody.textContent= 'Select a City Please!'
   
   }else{
    tableBody.textContent= ''
    
   }
   let latitude = cities[chosen].latitude
   let longitude = cities[chosen].longitude
    fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
    .then((response)=>{
        return response.json()
    })
    .then((cityData)=>{
        fetchingURL(cityData.properties.forecast)
    })
}

function fetchingURL(url){
    let tableBody = document.querySelector('#tableBody')
    fetch(`${url}`)
    .then((response)=>{
        return response.json()
    })
    .then((urlData)=>{
        let arrayData = urlData.properties.periods
        console.log(arrayData.length)
        for(let j =0;j<arrayData.length;j++){
            let newRow = tableBody.insertRow(-1)
            let cell1 = newRow.insertCell(0)
            cell1.innerHTML = arrayData[j].name
            let cell2 = newRow.insertCell(1)
            cell2.innerHTML = `Temperature ${arrayData[j].temperature} ${arrayData[j].temperatureUnit} Winds ${arrayData[j].windDirection} ${arrayData[j].windSpeed}`
            let cell3 = newRow.insertCell(2)
            cell3.innerHTML = `${arrayData[j].shortForecast}`
        }
    })
}

function getYourLocationData(){
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      
      function success(pos) {
        const crd = pos.coords;
        console.log(pos)
        console.log("FOUND YOU: >:)");
        // console.log(`Latitude : ${crd.latitude}`);
        // console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        fetch(`https://api.weather.gov/points/${crd.latitude},${crd.longitude}`)
    .then((response)=>{
        return response.json()
    })
    .then((yourData)=>{
        yourForcast(yourData.properties.forecast)
        console.log(yourData.properties.relativeLocation.properties.state)
        let state = yourData.properties.relativeLocation.properties.state
        let newRow = tableBody.insertRow(-1)
        let cell1 = newRow.insertCell(0)
        cell1.innerHTML = "FOUND YOU!!! >:) :"
        let cell2 = newRow.insertCell(1)
        cell2.innerHTML = state
    })
      }
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    
      navigator.geolocation.getCurrentPosition(success, error, options);
  }
function yourForcast(yourUrl){
    
    fetch(yourUrl)
    .then((response)=>{
        return response.json()
    })
    .then((yourWeatherData)=>{
        let weatherData = yourWeatherData.properties.periods
       console.log(weatherData)
       for(let h =0;h<weatherData.length;h++){
        let newRow = tableBody.insertRow(-1)
        let cell1 = newRow.insertCell(0)
        cell1.innerHTML = weatherData[h].name
        let cell2 = newRow.insertCell(1)
        cell2.innerHTML = `Temperature ${weatherData[h].temperature} ${weatherData[h].temperatureUnit} Winds ${weatherData[h].windDirection} ${weatherData[h].windSpeed}`
        let cell3 = newRow.insertCell(2)
        cell3.innerHTML = `${weatherData[h].shortForecast}`
    }
    })
}