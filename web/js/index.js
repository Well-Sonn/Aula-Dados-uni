function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', '../csv/dados-transporte.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      var jsonData = JSON.parse(xobj.responseText);
      callback(jsonData);
    }
  };
  xobj.send(null);
}

function clearData() {
  document.getElementById("quoteForm").reset();

  document.getElementById("distanceResult").value = "";
  document.getElementById("totalCostResult").value = "";
  document.getElementById("travelTimeResult").value = "";
  document.getElementById("departureDateTimeResult").value = "";
  document.getElementById("arrivalDateTimeResult").value = "";

  document.getElementById("transportData").style.display = "none";

  document.getElementById("mapContainer").innerHTML = "";
}

function showDistance() {
  loadJSON(function (jsonData) {
    var originId = document.getElementById("origin").value;
    var destinationId = document.getElementById("destination").value;

    var originData = findCityDataById(originId, jsonData);
    var destinationData = findCityDataById(destinationId, jsonData);

    var distance = calculateDistance(originData, destinationData);

    var resultElement = document.getElementById("distanceResult");
    var totalCostElement = document.getElementById("totalCostResult");
    var travelTimeElement = document.getElementById("travelTimeResult");
    var departureDateTimeElement = document.getElementById("departureDateTimeResult");
    var arrivalDateTimeElement = document.getElementById("arrivalDateTimeResult");

    if (distance !== null) {
      // Ajustes necessários para correção
      resultElement.value = distance.toFixed(2) + " km";

      var costPerKilometer = 20;
      var totalCost = distance * costPerKilometer;
      totalCostElement.value = "R$" + totalCost.toFixed(2);

      var speed = 100;
      var travelTime = distance / speed;
      travelTimeElement.value = travelTime.toFixed(2) + " horas";

      var currentDate = new Date();
      var departureDateTime = new Date(currentDate);
      departureDateTime.setDate(currentDate.getDate() + 1);
      departureDateTime.setHours(8, 0, 0, 0);

      var remainingDistance = distance;
      var daysToComplete = Math.ceil(remainingDistance / 500);
      var arrivalDateTime = new Date(departureDateTime.getTime());

      for (var i = 0; i < daysToComplete; i++) {
        var distanceToday = Math.min(remainingDistance, 500);
        var hoursToCompleteToday = distanceToday / speed;

        remainingDistance -= distanceToday;

        if (remainingDistance > 0) {
          arrivalDateTime.setDate(arrivalDateTime.getDate() + 1); // Adiciona um dia para o próximo trecho
        }
      }

      arrivalDateTime.setHours(8 + Math.floor(hoursToCompleteToday), Math.floor((hoursToCompleteToday % 1) * 60), 0, 0);

      departureDateTimeElement.value = formatDateTime(departureDateTime);
      arrivalDateTimeElement.value = formatDateTime(arrivalDateTime);

      document.getElementById("transportData").style.display = "block";

      // Exibe o mapa da rota
      displayRouteMap(originData, destinationData);
    } else {
      // Ajustes necessários para correção
      resultElement.value = "Erro ao calcular a distância.";
      totalCostElement.value = "";
      travelTimeElement.value = "";
      departureDateTimeElement.value = "";
      arrivalDateTimeElement.value = "";

      // Esconde o bloco de dados de transporte
      document.getElementById("transportData").style.display = "none";
    }
  });
}

function findCityDataById(cityId, data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].ID == cityId) {
      return data[i];
    }
  }
  return null;
}

function calculateDistance(origin, destination) {
  if (origin && destination) {
    var lat1 = toRadians(origin.Latitude);
    var lon1 = toRadians(origin.Longitude);
    var lat2 = toRadians(destination.Latitude);
    var lon2 = toRadians(destination.Longitude);

    var R = 6371;
    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;

    return distance;
  } else {
    return null;
  }
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function formatDateTime(dateTime) {
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  };
  return dateTime.toLocaleString('pt-BR', options);
}

function displayRouteMap(origin, destination) {
  // Cria o contêiner para o mapa
  var mapContainer = document.createElement("div");
  mapContainer.id = "mapContainer";
  mapContainer.style.width = "100%";
  mapContainer.style.height = "300px";
  mapContainer.style.alignItems = "center";
  document.getElementById("transportData").appendChild(mapContainer);

  // Configuração da API do Google Maps
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 8,
    center: { lat: origin.Latitude, lng: origin.Longitude }
  };
  var map = new google.maps.Map(document.getElementById('mapContainer'), mapOptions);
  directionsRenderer.setMap(map);

  // Configuração da solicitação de rota
  var request = {
    origin: new google.maps.LatLng(origin.Latitude, origin.Longitude),
    destination: new google.maps.LatLng(destination.Latitude, destination.Longitude),
    travelMode: google.maps.TravelMode.DRIVING
  };

  // Obtenção da rota do serviço de direções
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
    } else {
      console.error("Erro ao obter a rota:", status);
    }
  });
}
