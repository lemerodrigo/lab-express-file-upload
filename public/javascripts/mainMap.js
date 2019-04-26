const directionsService = new google.maps.DirectionsService;
const directionsDisplay = new google.maps.DirectionsRenderer;

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const myLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      startMap(myLoc);
    }, function () {
      console.log('Error in the geolocation service.');
    });
  } else {
    // Browser says: Nah! I do not support this.
    console.log('Browser does not support geolocation.');
  }
}

function startMap(myLoc) {
  const map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 11,
      center: {
        lat: -23.547648,
        lng: -46.632870,
      },
    },
  );

  const myHome = {
    lat: -23.601792,
    lng: -46.823963
  };

  const myHouse = new google.maps.Marker({
    position: myHome,
    map: map,
    title: 'Home'
  });

  const whereAmI = new google.maps.Marker({
    position: myLoc,
    map: map,
    title: 'Where I am!'
  });

  const directionRequest = {
    origin: myLoc,
    destination: myHome,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: new Date(Date.now()),
      trafficModel: 'optimistic',
    },
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  directionsService.route(
    directionRequest,
    function(response, status) {
      if (status === 'OK') {
        console.log(response)
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
              '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }

        var point = response.routes[0].legs[0];
        document.getElementById('travel-data').innerHTML = 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')';

      } else {
        // something went wrong
        window.alert('Directions request failed due to ' + status);
      }
    }
  );
  directionsDisplay.setMap(map);
}

getUserLocation();
