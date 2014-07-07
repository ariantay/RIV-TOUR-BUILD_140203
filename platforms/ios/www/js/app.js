var cur_statue = -1;
var cur_page = 0;  //used to determine if on tour pages or not
var first_run = true; //check when app is first opened
var globalLat = 0; //used to store geolocation result
var globalLon = 0; //used to store geolocation result
var mapTimeout = 5; //if map doesn't load in tour home, kick back to homepage
var mapLoaded = false;
var mapTimer = 0; //to keep track of map loading time
//android only vars
var audioPlaying = false; //tracks whether media is playing
var audioFile = 0;  //references phonegap media object
var audioTimer = null; //function that tracks current audio position
var watchID = 0; //geolocation tracker id
var popupTimer = 0; //timer for popup close
//var markerArray = 0; //array for holding matched markers **this shouldnt be global..
//var pageLock = 0; //variable to prevent pageChange/popups

var app = {
    registerEvents: function() {
        console.log('register events called');
        $(window).on('hashchange', $.proxy(app.route, app));
    },
    /* // LOTS OF ISSUES GETTING THIS TO WORK, SET ASIDE FOR NOW*/
    loadMapScript: function() {
        var script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"
           +"&callback=mapper.initialize";
        //&"+"callback=app.gotoTourHome";
        document.body.appendChild(script);
    },
    gotoTourHome: function() {
         //window.alert("Map page is still loading.  Please be patient, your network might be unstable. For the meanwhile, please use the Statue List page instead");
        if (typeof mapper === 'object' && typeof google === 'object' && typeof google.maps === 'object') {
            $.mobile.changePage('#tourpage_home');
        }else{
            //window.alert("Map page is still loading.  Please be patient, your network might be unstable. For the meanwhile, please use the Statue List page instead");
        }
    },
    gotoPage: function(page) {
        console.log('changing page to ' + page);
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
        var html = '';
        for (var i=0; i<app.numStatues; i++) {
            var statue = app.store.statues[i];
            html += '<li>';
            html += '<img src=img/' + statue.urlstring + '_thumb3.jpg>';
            html += '<h3>' + statue.name + '</h3>';
            html += '</li>';
        }
        $('#statuelist_holder').append(html);
		//add onclick 
		$('#statuelist_holder li').each(function(i) {
			$(this).click(function(){
				//change page to statuedetails
				app.showDetails(i);
			});
		});
	},	
	createMarkerList: function(markerArray) {
		if($('#checkbox-1').is(':checked')){
			if (markerArray.length==1){
				app.routeTo(markerArray[0]);
			}
			return;
		}
		var html = '';
		html += '<ul id="markerList" data-role="listview" data-inset="true" data-theme="b">'
		for (var i=0; i<markerArray.length; i++) {
			//alert("in loop creating markers: " + app.store.statues[markerArray[i]].name);
			var statue = app.store.statues[markerArray[i]];
			html += '<li>';
			html += '<img src=img/' + statue.urlstring + '_thumb3.jpg>';
			html += '<h3>' + statue.name + '</h3>';
			html += '</li>';
		}
		html +="</ul>";
		$('#popupMarkers').append(html);
		//add onclick to each element
		$('#popupMarkers li').each(function(i) {
			$(this).click(function(){
				app.routeTo(markerArray[i]);
			});
		});
		$('#markerList').listview();
		$('#popupMarkers').popup('open');
		/*list generated dynamicaly; need to make sure jqm styling is applied*/
		/*try {
			$('#markerList').listview('refresh');
		} catch(e) {
			$('#markerList').listview();
		}*/
		//$('#markerList').listview('refresh');
	},	
	startTracking: function() {
        //alert("calling startTracking");
		console.log("calling startTracking with maxage: " + app.maxage);
		var options = {
			maximumAge : app.maxage,
			enableHighAccuracy : true,
			timeout: 10000
		};
		return navigator.geolocation.watchPosition(app.onSuccess, app.onError, options);
///////////////////////////////////////////STOPPED HERE ON 140609		
	},
	onSuccess: function (position) {
        //update global variables
		app.maxage = 250;
		console.log('maxage is now: ' + app.maxage);
        globalLat = position.coords.latitude;
        globalLon = position.coords.longitude;
		console.log('position obj and coords: ' + position + ": " + position.coords.latitude + ", " + position.coords.longitude);
		//update our map marker and radius
		if (mapLoaded && typeof google === 'object' && typeof google.maps === 'object'){
            console.log('calling google maps latlng and referencing mapper ' + globalLat + " " + globalLon);
			var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			mapper.marker.setPosition(latlng);
			//mapper.circle.setCenter(latlng);
			//mapper.circle.setRadius(position.coords.accuracy);
		}	
	},
	checkNearbyStatues: function(){
		console.log("in checkNearbyStatues");
        if (cur_page == 1){
			var markerArray = [];
			console.log("calling on success");			
			for (var i=0; i<app.numStatues; i++) {
				var statue = app.store.statues[i];
				var distance = app.getDistanceFromLatLonInFeet(globalLat,globalLon,statue.lat,statue.lon);
				var htmlString = 'id_' + statue.id + ' is ' + Math.floor(distance) + ' feet away<br/>';
				if(distance <= statue.distance && cur_statue != statue.id){
					//if checked use old method	
					/*
					if($('#checkbox-1').is(':checked')){
						//alert('statue nearby! now switching to statue: ' + statue.name);
						app.routeTo(statue.id);
						return;
					}
					*/
					//use popups instead of auto change page
					markerArray.push(i);
				}
			}
			console.log("creating marker list with array: " + markerArray.toString());
			app.createMarkerList(markerArray);
		}
	},
	onError: function (error) {
		//alert('code: '    + error.code    + '\n' +
		//	  'message: ' + error.message + '\n');
		console.log('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
		//will this fix the issue?? 140415
		if (error.code===2){
			navigator.geolocation.clearWatch(watchID);
			//alert('geolocation tracking restarted');
			console.log('geolocation tracking restarted');
			watchID = app.startTracking();
		}
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
		//alert("all scripts and documents loaded, in app.initialize");
		console.log("all scripts and documents loaded, in app.initialize");
		//test140707
		if (parseFloat(window.device.version) === 7.0) {
          document.body.style.marginTop = "20px";
		}
		app.maxage = 0;
		app.numStatues = 12;
        //app.pageLock = 0;
        //this.detailsURL = /^#statues\/(\d{1,})/;
        app.registerEvents();
		//initialize and create map
        app.store = new MemoryStore(function() {
           //map initialize commented for testing purpose
           window.mapper.initialize();
           //issues with async loading, dont use
           //app.loadMapScript();           
        });
		console.log('start tracking with navigator.geolocation');
		//alert('map initialized');
		//app.initialized = true;
		watchID = app.startTracking();
		console.log('start displaying page with jquery mobile');
		$.mobile.initializePage();
		setInterval(function(){app.checkNearbyStatues();},6800);
    }
};
///////////////////////////////////////////FINISHED 140611
///////////SHOULD BE IDENTICAL TO ANDROID VERSION EXCEPT FOR MEDIA CODE