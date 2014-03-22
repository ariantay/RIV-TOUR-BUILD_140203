var mapper = {
    resize: function() {
        google.maps.event.trigger(mapper.map, 'resize');
        var tempCenter = new google.maps.LatLng(33.981905, -117.374513);
        mapper.map.setCenter(tempCenter);
        //mapper.map.setZoom(17);
    },
    mapLoadFail: function() {
        window.alert("Due to unstable network connection, your experience with the Guided Tour might not be optimal. We suggest using the Statue List page instead");
        //$.mobile.changePage("#homepage", {allowSamePageTransition:true});
    },
	createMarker: function(statue) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(statue.lat,statue.lon),
			map: mapper.map,
			title:statue.name,
			index: statue.id
		});
		google.maps.event.addListener(marker, 'click', function() {
			app.routeTo(marker.index);
		});
		//return marker;
	},
	announcePosition: function(){
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				function(position){alert (position.coords.latitude + " " + position.coords.longitude);},
				function(error){alert (error.code + " " + error.message);},
				{enableHighAccuracy: true,timeout: 10000,maximumAge: 1000});
		}else{
			alert('no navigator');
		}
	},
    initialize: function() {
		console.log("map initializing");
		//create the map
		mapper.mapOptions = {
			zoom: 16,
			center: new google.maps.LatLng(33.981905, -117.374513),
            panControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            overviewMapControl: false,
            styles: [{featureType: "poi", stylers: [{visibility: "off"}]}]
		};
		mapper.map = new google.maps.Map(document.getElementById('map-canvas'),mapper.mapOptions);
        //add timeout counter
        mapTimer = window.setTimeout(mapper.mapLoadFail, mapTimeout * 1000);
		//define current position icon
		var pinImage = new google.maps.MarkerImage(
			'img/nav_plain_blue.png',
			null,
			new google.maps.Point(0, 0),
			new google.maps.Point(8, 8),
			new google.maps.Size(16, 16)
		);
		//define current position marker
		mapper.marker = new google.maps.Marker({
			position: new google.maps.LatLng(33.981905, -117.374513),
			map: mapper.map,
			title:"You are here",
			index: app.numStatues,
			icon: pinImage
		});
		//define current position radius
		var options = {
			strokeColor: '#79BEDB',
			strokeOpacity: .8,
			strokeWeight: .8,
			fillColor: '#79BEDB',
			fillOpacity: 0.4,
			map: mapper.map,
			center: new google.maps.LatLng(33.981905, -117.374513),
			radius: 60
		};
		//mapper.circle = new google.maps.Circle(options);
		//current position on click
		google.maps.event.addListener(mapper.marker, 'click', function() {
			//app.routeTo(marker.index);
			mapper.announcePosition();
		});
		for (var i=0; i < app.numStatues; i++) {	
			mapper.createMarker(app.store.statues[i]);
		}		
		mapper.attached = false;
        //Add listener to detect if map.resize() is needed
        google.maps.event.addListenerOnce(mapper.map, 'bounds_changed', function() {
           google.maps.event.trigger(mapper.map, 'resize');
           var tempCenter = new google.maps.LatLng(33.981905, -117.374513);
           mapper.map.setCenter(tempCenter);
           mapper.map.setZoom(17);
        });
        //Add listener to detect if map has loaded tiles(for timeout)
        google.maps.event.addListener(mapper.map, 'tilesloaded', function() {
           window.clearTimeout(mapTimer);
           mapLoaded = true;
        });
		console.log("Mapper initialized: " + mapper.map);
    }    
}
