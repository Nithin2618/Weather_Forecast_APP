"use strict";

const API_Key = "89dd1d69da6ee72bc94df9808b645482";

const dayEle = document.querySelector(".default_day");
const dateEle = document.querySelector(".default_date");
const btnEle = document.querySelector(".btn_search");
const inputEle = document.querySelector(".input_field");
const iconsContainer = document.querySelector(".icons");
const dayInfoEle = document.querySelector(".day_info");
const listContentEle = document.querySelector(".list_content ul");

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

//display day
const day = new Date();
const dayName = days[day.getDay()];
dayEle.textContent = dayName;

//display date
let month = day.toLocaleString("default", {month: "long"});
let date = day.getDate();
let year = day.getFullYear();

dateEle.textContent = date + " " + month + " " + year;

//add event
btnEle.addEventListener("click", (e) => {
    e.preventDefault();

    //check empty value
    if (inputEle.value !== "") {
        const search = inputEle.value;
        inputEle.value = "";
        findLocation(search);
    }
    else {
        console.log("Please Enter City or Country Name");
    }
});

async function findLocation(city) {

    iconsContainer.innerHTML = "";
    dayInfoEle.innerHTML = "";
    listContentEle.innerHTML = "";

    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}`;
        const data = await fetch(API_URL);
        const result = await data.json();

        if (result.cod !== "404") {
            //display image content
            const imageContent = displayImageContent(result);

            //display right side content
            const rightSide = rightSideContent(result);

            //forecast function
            displayForeCast(result.coord.lat, result.coord.lon);

            iconsContainer.insertAdjacentHTML("afterbegin", imageContent);
            iconsContainer.classList.add("fadeIn");
            dayInfoEle.insertAdjacentHTML("afterbegin", rightSide);
        }
        else {
            const message = `<h2 class="text-2xl font-semibold">${result.cod}</h2>
                            <h3 class="text-2xl font-semibold">${result.message}</h3>`;
            iconsContainer.insertAdjacentHTML("afterbegin", message);
        }        
    }
    catch (error) {

    }
}

//display image content and temp
function displayImageContent(data) {
    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="image" class="mx-auto w-3/4 object-cover"/>
        <h2 class="text-3xl font-extrabold mt-2">${data.name}</h2>    
        <h2 class="weather_temp text-3xl font-extrabold mt-2">${Math.round(data.main.temp - 275.15)}°c</h2>
        <h3 class="cloudtxt text-xl capitalize">${data.weather[0].description}</h3>`;
}

//display the right side content
function rightSideContent(result) {
    return `<div class="bg-blue-100 rounded-md">
                <div class="content flex justify-between items-center mx-3 bg-slate-500 text-zinc-50 py-2 rounded-md my-3">
                    <figure class="float-start mx-5 px-7">
                        <img src="images/wind.png" class="mx-5" alt="" width="18%">
                        <p class="title font-bold text-xl">Wind Speed</p>
                    </figure>
                    <span class="value mx-5 px-7 text-xl font-bold">${result.wind.speed}<span class="text-sm">km/h</span></span>
                </div>
                <div class="content flex justify-between items-center mx-3 bg-slate-500 text-zinc-50 py-2 rounded-md my-3">
                    <figure class="float-start mx-5 px-7">
                        <img src="images/humidity.png" class="mx-3" alt="" width="18%">
                        <p class="title font-bold text-xl">Humidity</p>
                    </figure>
                    <span class="value mx-5 px-7 text-xl font-bold">${result.main.humidity}%</span>
                </div>
                <div class="content flex justify-between items-center mx-3 bg-slate-500 text-zinc-50 py-2 rounded-md my-3">
                    <figure class="float-start mx-5 px-7">
                        <img src="images/pressure.png" class="mx-4" alt="" width="18%">
                        <p class="title font-bold text-xl">Pressure</p>
                    </figure>
                    <span class="value mx-5 px-7 text-xl font-bold">${result.main.pressure}<span class="text-sm">Pa</span></span>
                </div>
            </div>`;
}

async function displayForeCast(lat, lon) {
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_Key}`;
    const data = await fetch(ForeCast_API);
    const result = await data.json();
    //filtermthe forecast
    const uniqueForeCastDays = [];
    const daysForeCast = result.list.filter((forecast) => {
        const foreCastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForeCastDays.includes(foreCastDate)) {
            return uniqueForeCastDays.push(foreCastDate);
        }
    });
    console.log(daysForeCast);

    daysForeCast.forEach((content, indx) => {
        if (indx <= 4) {
            listContentEle.insertAdjacentHTML("afterbegin", forecast(content));
        }
    });
}
       
//forecast html element data
function forecast(frContent) {
    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()];
    const splitDay = dayName.split("", 3);
    const joinDay = splitDay.join("");

    return `<li class="flex flex-col mx-1 items-center p-2 rounded-xl bg-slate-300 transition-transform transform hover:scale-110 hover:bg-white hover:text-gray-800 hover:shadow-lg">
                <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png" alt="image" class="w-1/2 object-cover">
                <span class="">${joinDay}</span>
                <span class="font-semibold text-xl">${Math.round(frContent.main.temp - 275.15)}°c</span>
            </li>`;
}

const defaultCity = 'Mysore';
findLocation(defaultCity);