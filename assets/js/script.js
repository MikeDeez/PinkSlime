$(document).ready(function() {
     // Sets up geolocation
     (function getGeoLocation(){		  
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				var lat = position.coords.latitude;
                var lng = position.coords.longitude;	
				// Find name of location
				getLocationName(lat,lng);
				// Checks weather
				getWeather(lat, lng);
				// Finds burger place
				getBurger (lat,lng);
			});
		}else{
			alert("Your browser doesn't support Geolocation!");
		}
	})();
	
	// Get location using Google Geocode API 
	function getLocationName(lat,lng){	
		$.ajax({
			type: 'GET',
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyCQ3PYEzSuizi_wBDpGnYYjnb5RKxSUqj8',
			success: function(data){
				
				//console.log(data);

				var placeName = data.results[0].formatted_address
				var streetNo = data.results[0].address_components[0].short_name
				var streetName = data.results[0].address_components[1].short_name
				var surburbName = data.results[0].address_components[2].short_name
				var stateName = data.results[0].address_components[3].short_name
				var stateNo = data.results[0].address_components[5].short_name
				var address = "";
				
				(function getAddress(){
					address += streetNo +' ';
					address += streetName +', ';
					address += surburbName +' ';
					address += stateName +' ';
					address += stateNo;
				})();
				
				
				$("#location, #location2").append(address);
				
			}
		});
	}	

	//Get weather from forecast.io
	function getWeather(lat,lng){
		$.ajax({
			type: 'GET',
			dataType:"jsonp",
			url: 'https://api.forecast.io/forecast/7fb1fc39285535b75ba021d80281c9ff/'+lat+','+lng+'?units=si',
			success: function(data){
				
				// console.log(data);
				
				var temperature = data.currently.temperature
				var temperaturew = Math.round(temperature*10)/10
				var weather = data.currently.summary
				$("#currenttmp, #currenttmp2").append(temperaturew);
				$("#currentwht, #currentwht2").append(weather);
			}
		});
	}
	
	//Get burger from foresquare api
	function getBurger(lat,lng){
		$.ajax({
			type: 'GET',
			dataType: "json",
			url: 'https://api.foursquare.com/v2/venues/explore?client_id=NUKPX0YF4IA02JYZ3CD3Y5RCN02ZUADFCE0EGNWSG4YCNOCL&client_secret=1S4Z24VPME4NN2FGVHHCFZ5CICW4FU5CMR5Z4G4NZYQCNJQA&v=20130815&ll='+lat+','+lng+'&llAcc=1000.0&radius=2000&venuePhotos=1&limit=15&query=burger',
			success: function(data2){
				
				//console.log(data2);
				
				var burgerPlaces = data2.response.groups[0].items

				if(burgerPlaces.length > 0){
						//each method
						$.each(burgerPlaces, function(index, element){
							var burgerName = element.venue.name
							var burgerStreet = element.venue.location.formattedAddress[0]
							var burgerSurburb = element.venue.location.formattedAddress[1]
							var burgerDistance = element.venue.location.distance
							var burgerRating = element.venue.rating
							var burgerLat = element.venue.location.lat
							var burgerLng = element.venue.location.lng
							var source = $("#location-template").html();
							var template = Handlebars.compile(source);
							var context = {
							   locationtitle: burgerName, 
							   locationstreet: burgerStreet,
							   locationsurburb: burgerSurburb,
							   locationdistance: burgerDistance,
							   locationrating: burgerRating,
							   burgerlat: burgerLat,
							   burgerlng: burgerLng
						   };
							var html  = template(context);
						
						   
							$('.location-container').append(template(context));
						})
						
						$('.location-results').each(function(i, e){
							  $(e).delay(i * 800).fadeIn(1600);
							  $('.preloader-container').fadeOut(100);

							  var valno = $(this).find('#location-rating-no').text()
							  var valnoFace = $(this).find('#face')
							  var valnoText = $(this).find('#location-rating')
							  
							  // console.log(valno)
							  
							//Burger ratings filter
								if(valno >= 7){
									$(valnoFace).html('<i class="twa twa-grin twa-lrg"></i>')
								}else if(valno >= 4 && valno <= 6.9){
									$(valnoFace).html('<i class="twa twa-smile twa-lrg"></i>')
								}else if(valno >= 1 && valno <= 3.9){
									$(valnoFace).html('<i class="twa twa-disappointed twa-lrg"></i>')
								}else{
									$(valnoText).html('<i id="norating" class="twa twa-cry twa-lrg"></i> No rating')
								}				
							}).promise().done();
					// }else{
					// 	$('#noresults-container').fadeIn(1000)
					}
			}
		});		
	}
});
