var mapper = {
    resize: function() {
        google.maps.event.trigger(mapper.map, 'resize');
        var tempCenter = new google.maps.LatLng(33.981905, -117.374513);
        mapper.map.setCenter(tempCenter);
        //mapper.map.setZoom(17);
    },
	createMarker: function(statue) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(statue.lat,statue.lon),
			map: this.map,
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
				{enableHighAccuracy: true,timeout: 10000,maximumAge: 5000});
		}else{
			alert('no navigator');
		}
	},
    initialize: function() {
		//create the map
		this.mapOptions = {
			zoom: 16,
			center: new google.maps.LatLng(33.981905, -117.374513),
            panControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            overviewMapControl: false,
            styles: [{featureType: "poi", stylers: [{visibility: "off"}]}]
		};
		this.map = new google.maps.Map(document.getElementById('map-canvas'),this.mapOptions); 
		//define current position icon
		var pinImage = new google.maps.MarkerImage(
			'img/nav_plain_blue.png',
			null,
			new google.maps.Point(0, 0),
			new google.maps.Point(8, 8),
			new google.maps.Size(16, 16)
		);
		//define current position marker
		this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(33.981905, -117.374513),
			map: this.map,
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
		this.circle = new google.maps.Circle(options);
		//current position on click
		google.maps.event.addListener(mapper.marker, 'click', function() {
			//app.routeTo(marker.index);
			mapper.announcePosition();
		});
		for (var i=0; i < app.numStatues; i++) {	
			mapper.createMarker(app.store.statues[i]);
		}		
		this.attached = false;
        //idle fires when map is ready, resize is called to size map to div
        /*google.maps.event.addListenerOnce(mapper.map, 'idle', function() {
            google.maps.event.trigger(mapper.map, 'resize');
            var tempCenter = new google.maps.LatLng(33.981905, -117.374513);
            mapper.map.setCenter(tempCenter); 
            mapper.map.setZoom(17);
        });*/
        google.maps.event.addListenerOnce(mapper.map, 'bounds_changed', function() {
           google.maps.event.trigger(mapper.map, 'resize');
           var tempCenter = new google.maps.LatLng(33.981905, -117.374513);
           mapper.map.setCenter(tempCenter);
           mapper.map.setZoom(17);
        });
		console.log(mapper.map);
    }    
}
