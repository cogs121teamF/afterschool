var mymap = L.map('map').setView([32.77, -117.19], 11);
    L.mapbox.accessToken = 'pk.eyJ1IjoicGphbWFzMTgwIiwiYSI6ImNpb3AzN2szMzAwMmp1cGtxZzVxZHlnYW8ifQ.Ml7vL74HZOhLKcF2qNQ58g';
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      /*attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',*/
      maxZoom: 18,
      id: 'pjamas180.084e08al',
      accessToken: 'pk.eyJ1IjoicGphbWFzMTgwIiwiYSI6ImNpb3AzN2szMzAwMmp1cGtxZzVxZHlnYW8ifQ.Ml7vL74HZOhLKcF2qNQ58g'
    }).addTo(mymap);
    mymap.scrollWheelZoom.disable();

    var libArray = new Array();
    var parkArray = new Array();
    var recArray = new Array();

    var libClicked = false;
    var parkClicked = false;
    var recClicked = false;

    document.getElementById("libBox").onclick = function() {
      if(libClicked) {
        for(var i = 0; i < libArray.length; i++) {
          mymap.removeLayer(libArray[i]);
        }
        libClicked = false;
      }
      else {
        $.getJSON("./libData", function(libraries) {
          for(var i = 0; i < libraries.length; i++) {
            var placeMarker = L.marker(new L.LatLng(libraries[i].LATITUDE, libraries[i].LONGITUDE), {
              icon: L.mapbox.marker.icon({'marker-symbol': 'library', 'marker-color': 'F1C40F'})
            });
            placeMarker.bindPopup(libraries[i].NAME);
            libArray.push(placeMarker);
            mymap.addLayer(libArray[i]);
          }
        });
        libClicked = true;
      }
    };
    document.getElementById("parkBox").onclick = function() {
      if(parkClicked) {
        for(var i = 0; i < parkArray.length; i++) {
          mymap.removeLayer(parkArray[i]);
        }
        parkClicked = false;
      }
      else {
        $.getJSON("./parkData", function(parks) {
          for(var i = 0; i < parks.length; i++) {
            var placeMarker = L.marker(new L.LatLng(parks[i].LATITUDE, parks[i].LONGITUDE), {
              icon: L.mapbox.marker.icon({'marker-symbol': 'park', 'marker-color': '2ECC71'})
            });
            placeMarker.bindPopup(parks[i].NAME);
            parkArray.push(placeMarker);
            mymap.addLayer(parkArray[i]);
          }
        });
        parkClicked = true;
      }
    };
    document.getElementById("recBox").onclick = function() {
      if(recClicked) {
        for(var i = 0; i < recArray.length; i++) {
          mymap.removeLayer(recArray[i]);
        }
        recClicked = false;
      }
      else {
        $.getJSON("./recData", function(recCenters) {
          //console.log(recCenters);
          for(var i = 0; i < recCenters.length; i++) {
            var placeMarker = L.marker(new L.LatLng(recCenters[i].LATITUDE, recCenters[i].LONGITUDE), {
              icon: L.mapbox.marker.icon({'marker-symbol': 'basketball', 'marker-color': 'E74C3C'})
            });
            placeMarker.bindPopup(recCenters[i].NAME);
            recArray.push(placeMarker);
            mymap.addLayer(recArray[i]);
          }
        });
        recClicked = true;
      }
    };

    var data = {};

    // For each school, create a new marker
    $.ajax({
      type: 'GET',
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: './schoolData',
      success: function(data) {
          var markers = new L.MarkerClusterGroup();
          var markerList = [];
          for (var i= 0; i < data.length; i++) {
            var marker = L.marker(new L.LatLng(data[i].LATITUDE, data[i].LONGITUDE), {
              icon: L.mapbox.marker.icon({'marker-symbol': 'school', 'marker-color': 'EE6E73'}),
              title: data[i].NAME
            });
            marker.bindPopup(data[i].NAME);
            markers.addLayer(marker);
            markerList.push(marker);
          }
          mymap.addLayer(markers);

      }
    });
