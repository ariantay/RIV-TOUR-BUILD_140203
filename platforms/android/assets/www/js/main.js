//jquery mobile events handling
//HOMEPAGE
/*
$(document).on("pagecreate", "#homepage", function () {
	console.log("in pagecreate");
	alert("in pagecreate");
});*/
/*
$(document).on('popupafteropen', '.ui-popup', function() {
	alert("event triggered");
	setTimeout(function () {
		$(this).popup('close');
	}, 5000);
});
*/
$(document).on('popupafterclose', '#popupMarkers', function() {
	//console.log('popupTimer!! ' + popupTimer);
	$('#popupMarkers ul').remove();
	window.clearTimeout(popupTimer);
});
$(document).on('popupafteropen', '#popupMarkers', function() {
	//alert("event triggered");
	popupTimer = setTimeout(function () {
		$('#popupMarkers').popup('close');
	}, 3200);
});
$(document).on("pagebeforeshow", "#homepage", function () {
	app.audioSliderTrackMedia("audio-seek1");
	app.audioSliderUpdateMedia("audio-seek1");
    cur_statue = -1;
    cur_page = 0;
    var language = $('input[name="radio-choice-2"]:checked').val();
    if (language == 'english'){
    $('#header h3').html("City of Riverside Tour Guide");
    $('#map_link span.ui-btn-text').html("Begin Tour");
    $('#list_link span.ui-btn-text').html("Statue List");
    $('#settings_link span.ui-btn-text').html("Settings");
    $('.home_audioFile').attr('src','audio/spirit_eng.mp3');
    $('#home_title').html("International Spirit of Riverside</br>");
    $('#home_text').html("Riverside has long maintained a spirit of Internationalism and recognition of its multicultural history.  Going back to Frank Miller, the founder of the Mission Inn, Riverside has hosted dignitaries from countries all over the world and provided leadership on an International scale.  Riverside’s multiculturism has existed for nearly 150 years with large segments of various cultures within its population going back to the 1870s.  For example the Mission Inn hosted Japanese, Russian and European dignitaries, national and important state politicians and celebrities, such as several US presidents, Prince Kaya of Japan, Prince Gustav of Sweden, Booker T. Washington, John Muir, and Amelia Earhart.  The World Affairs Council was started in Riverside at the Mission Inn (and was once attended by John F. Kennedy here) and other international peace and social conferences have been hosted here.</br></br>" +
                        "Riverside was the first American city to take part in the International Sister City program initiated after World War II. That tradition continues today with a robust and global Sister City program including cities in the countries of Japan, Mexico, Korea, China, India, Ghana and Germany.  The Statues of Main Street Riverside embody this spirit of internationalism with recognition of various significant civil rights and historical leaders, some with international or national significance, and others of prominent local importance.");
		audioFile = new Media('/android_asset/www/audio/spirit_eng.mp3');
    }else{
    $('#header h3').html("Guía de Turismo de la Ciudad de Riverside");
    $('#map_link span.ui-btn-text').html("Comenzar");
    $('#list_link span.ui-btn-text').html("Lista");
    $('#settings_link span.ui-btn-text').html("Ajustes");
    $('.home_audioFile').attr('src','audio/spirit_esp.mp3');
    $('#home_title').html("El Orgullo International de Riverside</br>");
    $('#home_text').html("Riverside es una ciudad que reconoce su historia multicultural y esta orgullosa de sus relaciones internacionales que mantiene hasta ahora. Todo empezó con el dueño del Mission Inn el señor Frank Miller que invitaba a dignatarios del rededor del mundo a que se hospedaran en este lugar. La riqueza de tantas culturas ha existido por más de 150 años comenzando desde 1870.</br></br>" +
                        "El Mission Inn ha tenido invitados dignitarios  japoneses, rusos,  y europeos. Otros invitados incluyen políticos nacionales y locales, gente famosa, presidentes de los Estados Unidos, el príncipe Kaya de Japón, el príncipe Gustavo de Suecia, el activista Booker T. Washington, el escritor John Muir, y la primera mujer de aviación Amelia Earhart. La Consejería de los Asuntos Mundiales empezó en Riverside en el Mission Inn y fue asistida por John F. Kennedy una vez. Otras conferencias para paz internacional y otros eventos sociales también tomaron lugar en este sitio.</br></br>" +
                        "Riverside fue la primera ciudad Americana en participar en el programa de Ciudades Hermanas Internacionales que empezó después de la segunda guerra mundial. Esa tradición continúa hasta este día y más ciudades como Japón, México, Corea, China, India, Ghana, y Alemania son ya miembros de este gran programa. Las estatuas en la calle Main son un símbolo de orgullo internacional que reconocen a varios e importantes líderes de los derechos humanos y de la historia.");
		audioFile = new Media('/android_asset/www/audio/spirit_esp.mp3');
    }
    $('.home_audioControl').trigger('load');	
});
$(document).on("pageshow", "#homepage", function () {
    navigator.splashscreen.hide();
});
$(document).on("pagebeforehide", "#homepage", function () {
	$('.home_audioControl').trigger('pause');
	$('.home_audioControl').prop('currentTime',0);
	app.audioFileStopRelease();
	navigator.splashscreen.show();
});
$(document).on("pagehide", "#homepage", function () {
	app.audioButtonStop('audio-button1');
});
///////////////////////
//TOURPAGE_HOME EVENTS
///////////////////////
$(document).on("pagecreate", "#tourpage_home", function () {
     //might wanna trigger async loading here, or the map initialization
});
$(document).on("pagebeforeshow", "#tourpage_home", function () {
    if (!mapLoaded){
        window.clearTimeout(mapTimer);
        mapTimer = window.setTimeout(mapper.mapLoadFail, mapTimeout * 1000);
    }
    var language = $('input[name="radio-choice-2"]:checked').val();
    if (language == 'english'){
    $('#header h1').html("Tour");
    //$('#popupBasic p').html("Your position is indicated on the map by the blue dot.  Please make your way to the nearest statue represented by the red markers.  Once you arrive at that statue's location, information regarding that statue will automatically be displayed.");
    $('#popupBasic p').html("Your position is indicated by the blue dot.  Please make your way to the nearest statue (the red markers).  When you are nearby, the tour will automatically begin.");
    }else{
    $('#header h1').html("Gira");
    $('#popupBasic p').html("Su posición está indicada en el mapa vía el punto azul. Por favor camine hacia la estatua más cercana representada por el marcador rojo.  Al llegar a la ubicación de esa estatua, información con respecto a esa estatua será desplegada automáticamente.");
    }
    if (first_run){
        $('#popupBasic').popup('open');
    }
   first_run=false;
   cur_page = 1;
   cur_statue = -1;
   //app.lock = 0;
});
$(document).on("pageshow", "#tourpage_home", function () {
    navigator.splashscreen.hide();
    if (mapLoaded){
       mapper.resize();
    }
});
$(document).on("pagebeforehide", "#tourpage_home", function () {
    navigator.splashscreen.show();
});

///////////////////////
//TOURPAGE EVENTS
///////////////////////
$(document).on("pageshow", "#tourpage", function () {
    cur_page = 1;
    //app.lock = 0;
	$('.flexslider').flexslider({
		animation: "slide",
		slideshowSpeed: 6000,
		controlNav: false,
		after: function(slider) {
		/* auto-restart player if paused after action */
			if (!slider.playing) {
				slider.play();
				console.log(slider);
			}
		}
   });
   	app.audioSliderUpdateMedia("audio-seek3");
	app.audioSliderTrackMedia("audio-seek3");
	if(!$('#checkbox-2').is(':checked')){
       //referring to the container also causes issues...
       //$('#audioContainer audio').trigger('play');
       //$('.audioControl').trigger('play');
	   audioFile.play();
	   audioPlaying = true;
	   app.audioButtonPlay("audio-button3");
    }
	//reset position of text
	$("#textContainer").scrollTop(0);
	//slider won't show until resize...
	$(window).resize();
    navigator.splashscreen.hide();
});
$(document).on("pagebeforehide", "#tourpage", function () {
   $('.audioControl').trigger('pause');
   $('.audioControl').prop('currentTime',0);
   //$('.flexslider').flexslider(0);
   navigator.splashscreen.show();
   app.audioFileStopRelease();
});
$(document).on("pagehide", "#tourpage", function () {
	app.audioButtonStop("audio-button3");
});

///////////////////////
//SETTINGS EVENTS
///////////////////////
$(document).on("pagebeforeshow", "#settings", function () {
    cur_page = 0;
    cur_statue = -1;
	var language = $('input[name="radio-choice-2"]:checked').val();
	if (language == 'english'){
		$('#header h1').html("Settings");
		$('#settings_legend_1 a').html("Language");
		$('#settings_legend_2 a').html("Disable Statue Popup");
		$('#settings_legend_3 a').html("Enable Silent Mode");
	}else{
		$('#header h1').html("Ajustes");
		$('#settings_legend_1 a').html("Idioma");
		$('#settings_legend_2 a').html("Desactivar Estatua Emergente");
		$('#settings_legend_3 a').html("Activar Modo Silencioso");
	}
});
$(document).on("pageshow", "#settings", function () {
    navigator.splashscreen.hide();
});
$(document).on("pagebeforehide", "#settings", function () {
    navigator.splashscreen.show();
});

///////////////////////
//STATUELIST EVENTS
///////////////////////
$(document).on("pagecreate", "#statuelist", function () {
	app.createStatuelist();
});
$(document).on("pagebeforeshow", "#statuelist", function () {
    cur_page = 0;
    cur_statue = -1;
	var language = $('input[name="radio-choice-2"]:checked').val();
	if (language == 'english'){
		$('#header h1').html("Statue List");
	}else{
		$('#header h1').html("Lista de Estatuas");
	}
});
$(document).on("pageshow", "#statuelist", function () {
    navigator.splashscreen.hide();
});
$(document).on("pagebeforehide", "#statuelist", function () {
    navigator.splashscreen.show();
});

///////////////////////
//STATUEDETAILS EVENTS
///////////////////////
$(document).on("pagebeforeshow", "#statuedetails", function () {
    cur_page = 0;
    cur_statue = -1;
    var language = $('input[name="radio-choice-2"]:checked').val();
    if (language == 'english'){
        $('#header h1').html("Statue Details");
        $('#address_box span.ui-btn-text').html("Location");
        $('#static_map_box span.ui-btn-text').html("Map");
    }else{
        $('#header h1').html("Detalles Estatua");
        $('#detail_box span.ui-btn-text').html("Detalles");
        $('#address_box span.ui-btn-text').html("Ubicación");
        $('#static_map_box span.ui-btn-text').html("Mapa");
    }
    //colorbox intialization
    $('.statuedetails_gallery').colorbox({rel:'gal', maxWidth: '95%', maxHeight: '95%'});
    $('#audio_box').trigger('expand');
    $('#address_box').trigger('expand');
    $('#static_map_box').trigger('expand');
    $('#detail_box').trigger('expand');
	//app.audioSliderUpdateMedia("audio-seek2");
	//app.audioSliderTrackMedia("audio-seek2");
});
$(document).on("pageshow", "#statuedetails", function () {
	app.audioSliderUpdateMedia("audio-seek2");
	app.audioSliderTrackMedia("audio-seek2");
	navigator.splashscreen.hide();
});
$(document).on("pagebeforehide", "#statuedetails", function () {
    $('.statuedetails_audioControl').trigger('pause');
    $('.statuedetails_audioControl').prop('currentTime',0);
	app.audioFileStopRelease();
	navigator.splashscreen.show();
});
$(document).on("pagehide", "#statuedetails", function () {
	$('.statuedetails_audioControl').trigger('pause');
	$('.statuedetails_audioControl').prop('currentTime',0);
	$('#audio_box').trigger('expand');
	$('#address_box').trigger('expand');
	$('#static_map_box').trigger('expand');
	$('#detail_box').trigger('expand');
	//app.audioCleanUp("audio-seek2");
	$("#audio-seek2").val(0).slider("refresh");
	app.audioButtonStop("audio-button2");
});
//fix for ios 7 status bar ** doesnt work leave for later
/*
function onDeviceReady() {
    if (parseFloat(window.device.version) === 7.0) {
          document.body.style.marginTop = "20px";
    }
} 
document.addEventListener('deviceready', onDeviceReady, false);
*/