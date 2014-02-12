var app = {
    registerEvents: function() {
        $(window).on('hashchange', $.proxy(this.route, this));
    },
    /* // LOTS OF ISSUES GETTING THIS TO WORK, SET ASIDE FOR NOW
    loadMapScript: function() {
        var script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"
        +"&callback=mapper.initialize";
        //&"+"callback=app.gotoTourHome";
        document.body.appendChild(script);
    },*/
    gotoTourHome: function() {
         //window.alert("Map page is still loading.  Please be patient, your network might be unstable. For the meanwhile, please use the Statue List page instead");
        if (typeof google === 'object' && typeof google.maps === 'object') {
            $.mobile.changePage('#tourpage_home');
        }else{
            window.alert("Map page is still loading.  Please be patient, your network might be unstable. For the meanwhile, please use the Statue List page instead");
        }
    },
    gotoPage: function(page) {
        $.mobile.changePage(page);
    },
	routeTo: function(statueID) {
		//to prevent auto routing
		if($('#checkbox-1').is(':checked')){
			return;
		}
		//change header
		if (statueID === app.numStatues){
			$('#headerText').html('City of Riverside');
            $('.audioFile_home').attr('src','audio/tourhome_eng.mp3');
            
		}else{
			var statue = app.store.statues[statueID];
			$('#headerText').html(statue.name);
			var language = $('input[name="radio-choice-2"]:checked').val();
			if (language == 'english'){
				$('#statue_text').html(statue.info.english);
				$('.audioFile').attr('src','audio/'+statue.urlstring+'_eng.mp3');			
			}else{
				$('#statue_text').html(statue.info.spanish);
				$('.audioFile').attr('src','audio/'+statue.urlstring+'_esp.mp3');
			}
            $('.audioControl').trigger('load');
			//change images
			$('.image_1').attr('src','img/'+statue.urlstring+'_1.jpg');
			$('.image_2').attr('src','img/'+statue.urlstring+'_2.jpg');
			$('.image_3').attr('src','img/'+statue.urlstring+'_3.jpg');
			$('.image_4').attr('src','img/'+statue.urlstring+'_4.jpg');
			$('.image_5').attr('src','img/'+statue.urlstring+'_5.jpg');
		}
        cur_statue = statueID;
		$.mobile.changePage("#tourpage", {allowSamePageTransition:true});
	},
	showDetails: function(statueID) {
        //unbind previous onclick event
        $('#mapit, #statuedetails_static_map_img').off('click');
		var statue = app.store.statues[statueID];
		$('#statuedetails_thumb').attr('src','img/'+statue.urlstring+'_thumb3.jpg');
		$('#statuedetails_thumbtext h2').html(statue.name);
        //change images
        $('#statuedetails_imgholder').attr('href','img/'+statue.urlstring+'_1.jpg');
        $('#statuedetails_img_2').attr('href','img/'+statue.urlstring+'_2.jpg');
        $('#statuedetails_img_3').attr('href','img/'+statue.urlstring+'_3.jpg');
        $('#statuedetails_img_4').attr('href','img/'+statue.urlstring+'_4.jpg');
		var language = $('input[name="radio-choice-2"]:checked').val();
		if (language == 'english'){
			$('#statuedetails_detailstext p').html(statue.info.english);
            $('#statuedetails_address a').html(statue.street);
			$('.statuedetails_audioFile').attr('src','audio/'+statue.urlstring+'_eng.mp3');
		}else{
			$('#statuedetails_detailstext p').html(statue.info.spanish);
            $('#statuedetails_address a').html(statue.street_spanish);
			$('.statuedetails_audioFile').attr('src','audio/'+statue.urlstring+'_esp.mp3');
		}
		$('.statuedetails_audioControl').trigger('load');
		$('#statuedetails_static_map_img').attr('src','img/'+statue.urlstring+'_map.jpg');
        var siteURL = 'http://maps.google.com/maps?' +
            'saddr=' + globalLat + ',' + globalLon + '&' +
            'daddr=' + statue.lat + ',' + statue.lon;
        //bind new onclick event
        $('#mapit, #statuedetails_static_map_img').click(function(){
             console.log(siteURL);
             window.open(siteURL, '_blank', 'location=yes');
             });
        $.mobile.changePage("#statuedetails");
	},
	createStatuelist: function() {
		//append list
		if (!app.statuelistCreated){
			var html = '';
			for (var i=0; i<app.numStatues; i++) {
				var statue = app.store.statues[i];
				html += '<li>';
				html += '<img src=img/' + statue.urlstring + '_thumb3.jpg>';
				html += '<h3>' + statue.name + '</h3>';
				html += '</li>';
			}
			$('#statuelist_holder').append(html);
		}
		//add onclick 
		$('#statuelist_holder li').each(function(i) {
			$(this).click(function(){
				//change page to statuedetails
				app.showDetails(i);
			});
		});
		app.statuelistCreated = true;
	},	
	startTracking: function() {
        //alert("calling startTracking");
		var options = {
			maximumAge : 1000,
			enableHighAccuracy : true
		};
		return navigator.geolocation.watchPosition(app.onSuccess, app.onError, options);
	},
	onSuccess: function (position) {
        //update global variables
        globalLat = position.coords.latitude;
        globalLon = position.coords.longitude;
		//update our map marker and radius
		if (mapper){
			var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			mapper.marker.setPosition(latlng);
			mapper.circle.setCenter(latlng);
			//mapper.circle.setRadius(position.coords.accuracy);
		}	
        if (cur_page == 1 && app.lock == 0){
            app.lock = 1;
			console.log("calling on success");			
			for (var i=0; i<app.numStatues; i++) {
				var statue = app.store.statues[i];
				var distance = app.getDistanceFromLatLonInFeet(position.coords.latitude,position.coords.longitude,statue.lat,statue.lon);
				var htmlString = 'id_' + statue.id + ' is ' + Math.floor(distance) + ' feet away<br/>';
				if(distance <= statue.distance && cur_statue != statue.id){
					app.routeTo(statue.id);
					return;
				}
			}
			app.lock = 0;
		}
	},
	onError: function (error) {
		//alert('code: '    + error.code    + '\n' +
		//	  'message: ' + error.message + '\n');
	},
	getDistanceFromLatLonInFeet: function (lat1,lon1,lat2,lon2) {
		var R = 6371; // Radius of the earth in km
		var dLat = app.deg2rad(lat2-lat1);  // deg2rad below
		var dLon = app.deg2rad(lon2-lon1);
		var a =
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(app.deg2rad(lat1)) * Math.cos(app.deg2rad(lat2)) *
		Math.sin(dLon/2) * Math.sin(dLon/2)
		;
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c * 3280.8; // Distance in feet
		return d;
	},  
	deg2rad: function (deg) {
		return deg * (Math.PI/180);
	},    
    initialize: function() {
		//this.statueID = 0;	// **not needed, explicitly call destination **
		app.numStatues = 6;
		app.functionRunning = false;
		app.counter = 0;
        app.lock = 0;
        var self = this;
        //this.detailsURL = /^#statues\/(\d{1,})/;
        this.registerEvents();
		//initialize and create map
        this.store = new MemoryStore(function() {
           window.mapper.initialize();
           //issues with async loading, dont use
           //app.loadMapScript();
        });
		this.initialized = true;
		this.statuelistCreated = false;
    }
};