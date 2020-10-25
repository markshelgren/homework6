$(document).ready( function() {     

// Global Variables
var APIKey = "2f894fb42bc94b948578a732b8d8b4a8";

var citiesInput = document.querySelector("#citiesText");
var citiesForm = document.querySelector("#citiesForm");
var citiesList = document.querySelector("#citiesList");
var citiesCountSpan = document.querySelector("#citiesCount");
var cityEntered = "";

var cities = ["Irvine", "Grants Pass"];

rendercities();

function rendercities() {
  // Clear citiesList element and update citiesCountSpan

  citiesList.innerHTML = "";
  citiesCountSpan.textContent = cities.length;

  // Render a new li for each cities
  for (var i = 0; i < cities.length; i++) {

    var li = document.createElement("li");
    li.textContent = cities[i];
    citiesList.appendChild(li);
  }
}

// When form is submitted...
citiesForm.addEventListener("submit", function(event) {
  event.preventDefault();

  var citiesText = citiesInput.value.trim();

  // Return from function early if submitted citiesText is blank
  if (citiesText === "") {
    return;
  }

  // Add new citiesText to cities array, clear the input
  cities.push(citiesText);
  citiesInput.value = "";
  cityEntered = citiesText;

// Call the function to retrieve the weather for the city entered in the search
getWeather();

  // Re-render the list
  rendercities();
});

function getWeather() {
  console.log(cityEntered);
      // This is our API key. Add your own API key between the ""
      var searchCity = cityEntered;

      console.log("This is the value of Search City" + searchCity);
			// Here we are building the URL we need to query the database
			var queryURL =
				"https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=" + 	APIKey;

       // Log the queryURL
					console.log(queryURL);
			// Here we run our AJAX call to the OpenWeatherMap API

      $.ajax({
				url: queryURL,
				method: "GET",
			})
				// We store all of the retrieved data inside of an object called "response"
				.then(function (apiResult) {
          
          $("col-sm-10 text-left"); 

					// Log the resulting object
					console.log(apiResult);

          // Transfer content to HTML
          var cityName = apiResult.name;
          $("#cardtitle").text(cityName);
     
          var newIcon = $("#cardimage").attr("src", "http://openweathermap.org/img/w/" + apiResult.weather[0].icon + ".png" )
              newIcon = $("#cardimage").addClass("card-img-top") 
          console.log("newIcon " + newIcon);         


					$("#wind").text("Wind Speed: " + apiResult.wind.speed);
          $("#humidity").text("Humidity: " + apiResult.main.humidity);

					// Convert the temp to fahrenheit
					var tempF = (apiResult.main.temp - 273.15) * 1.8 + 32;

					// add temp content to html
					$("#temp").text("Temperature (K) " + apiResult.main.temp);
          $("#tempF").text("Temperature (F) " + tempF.toFixed(2));

          var tempFdiv = $("<div>").addClass("tempF").text("Temperature (F) " + tempF.toFixed(2)); 
          console.log("tempFdiv " + tempFdiv);   
      
          $("#cardimage").append(newIcon);  

          // The iconCode and URL concept does not seem to work - trying this technique which produces correct icon result
          // $("#icon").html("<img src='http://openweathermap.org/img/w/" + apiResult.weather[0].icon + ".png' alt='Icon depicting current weather.'>");
          
          // Log the data in the console as well
					console.log("Wind Speed: " + apiResult.wind.speed);
					console.log("Humidity: " + apiResult.main.humidity);
          console.log("Temperature (F): " + tempF);  
          
          // Use the latitude and longitude to get the UV Index
          getUVIndex(apiResult);
        });
        
      };


      function getUVIndex(apiResult) {
        console.log(apiResult);
            // Same API Key for latitude longitude
            var savedResult = apiResult;

            console.log("Saved Variable Results passed to getUVINdex" + savedResult);
            console.log("Try for LAT:" + apiResult.coord.lat);
            console.log("Try for LON:" + apiResult.coord.lon);
            
            // Here we are building the URL we need to query the database with lattitude and longitude 
            var uvqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + apiResult.coord.lat + "&lon=" + apiResult.coord.lon + "&appid=" + APIKey;

                // Log the queryURL
                console.log("URL With LAT & LON" + uvqueryURL);

            // Here we run our AJAX call to the OpenWeatherMap API
            $.ajax({
              url: uvqueryURL,
              method: "GET",
            })
              // We store all of the retrieved data inside of an object called "response"
              .then(function (uvapiResult) {
      
                // Log the resulting object
                console.log(uvapiResult);
      
                // Add the UVindex to the HTML  
                $("#uvindex").text("UV Index: " + uvapiResult.value);

              //  check value and colorize according to requirement   
                if (uvapiResult.value < 2) {
                  $("#uvindex").addClass("bg-green");
              }
        
        
              if (uvapiResult.value >= 2.01 && uvapiResult.value <= 5.00) {
                  $("#uvindex").addClass("bg-yellow")
              }
        
              if (uvapiResult.value >= 5.01) {
                  $("#uvindex").addClass("bg-red")
              }
      
     
                // Log the data in the console as well
                console.log("UV Index: " + uvapiResult.value);
              });
        
            };

          } );