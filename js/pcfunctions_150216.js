// JavaScript Document
//var formValid = false;	//Esta variable define si el formulario de booking es válido
$(document).ready(function() {

	var desde = $("#DESDE"),
		hacia = $("#HACIA"),
		fecha_salida = $("#from"),
		fecha_regreso = $("#to"),
		storeFront = '',
		error = $("div.error_msj"),
		form = $("#bookinForm");

	$.each(sysCities.fromcities, function (index, value) {
		desde.append('<option value="'+value.id+'">'+value.name+'</option>');
	});

	$.each(sysCities.tocities, function (index, value) {
		hacia.append('<option value="'+value.id+'">'+value.name+'</option>');
	});

	desde.on("change", function(){

		
		//var selected = $(this).val(),
		// 	hacia_val = hacia.val(),
		// 	thisHasError = $(this).attr('class').search('error'),
		// 	haciaHasError = hacia.attr('class').search('error');

		//Selección de Storefront
		$.each( sysCities.fromcities, function(index, value){
			if( value.id == selected ){
				selected = value.name.substr( value.name.length - 2, 2 );
			}
		});
		
		if(selected != 'CO' && selected != 'BR' && selected != 'CA' && selected && 'US'){
			storeFront = 'GS';
		} else {
			storeFront = selected;
		}

		// if( selected != 0 ){
		// 	$(this).removeClass('error');
		// 	clearError( error );
		// }

		// //Si hay error en los selectores
		// if( thisHasError != -1 && haciaHasError != -1 ){
		// 	$(this).removeClass('error');
		// 	hacia.removeClass('error');
		// 	clearError( error );
		// }

	});

	// hacia.on("change", function(){

	// 	var selected = $(this).val(),
	// 		val_desde = desde.val(),
	// 		thisHasError = $(this).attr('class').search('error'),
	// 		desdeHasError = desde.attr('class').search('error');

	// 	//Si hay error en los selectores
	// 	if( thisHasError != -1 && desdeHasError != -1 ){
	// 		$(this).removeClass('error');
	// 		desde.removeClass('error');
	// 		clearError( error );
	// 	}

	// 	if( thisHasError != -1 ){
	// 		$(this).removeClass('error');
	// 		clearError( error );
	// 	}	
	// });

	$("#btnSubmit").on('click', function(){
		buscarVuelos( desde, hacia, fecha_salida, fecha_regreso, storeFront );
	});
	
	$.datepicker.setDefaults($.datepicker.regional['es']);
	var dates = $( "#from, #to" ).datepicker({
		dateFormat: 'dd/mm/yy',
		regional: 'es',
		numberOfMonths: 2,
		minDate: departure_date,
		maxDate: return_date,
/*		showOn: "both",
		buttonImage: "images/iconcal.jpg",
		buttonImageOnly: true,
*/		
        onSelect: function( selectedDate ) {
            var option = this.id == "from" ? "minDate" : "maxDate",
                instance = $( this ).data( "datepicker" ),
                date = $.datepicker.parseDate(
                    instance.settings.dateFormat ||
                    $.datepicker._defaults.dateFormat,
                    selectedDate, instance.settings );
            dates.not( this ).datepicker( "option", option, date );
        }
    });
	
	$("input:radio[name=radIdaVuelta]").change(function(){
		valIdaVuelta = $('input:radio[name=radIdaVuelta]:checked').val(); 
		if(valIdaVuelta == "RT"){
			$("#inputRegreso").show();
		}else{
			$("#inputRegreso").hide();
		}
	});


    //Programación tabs

    var firstTab = $("ul#tarifas li a").first().attr('href');

    $.history.init(function(url) {
        loadHtml(url == "" ? firstTab : url);
    });

    $('.jqload').on('click', function(e) {

		$('.colmenu li a').each(function(){
			$(this).parent().removeClass("active");
			$(this).removeClass("active");
		});

        $(this).parent().addClass("active");
        $(this).addClass("active");

        var url = $(this).attr('href');
        url = url.replace(/^.*#/, '');
        loadHtml(url);
        e.preventDefault();
    });

    form.validate(); 	
	
});

function loadHtml(num) {
		
	$("#bt"+num).parent().addClass("active");
	$("#bt"+num).addClass("active");
	
	$("#load_content").fadeOut("fast", function(){
		$('#load_content').load("info/"+num +".html", function(){
			$("#load_content").fadeIn("slow");
		});
	});
	
}

/***
* elimina los mensajes de error almacenados en este div
***/
// function clearError( error ){
// 	$('div.error_msj > p').remove();
// 	error.css('display', 'none');
// }

function buscarVuelos( desde, hacia, fecha_salida, fecha_regreso, storeFront ) {

	/****
	* DECLARACIÓN DE VARIABLES
	****/

	var lang = $("html").attr("lang"),
		error = $("div.error_msj"),
		v_FROM = desde.val(),
		v_TO = hacia.val(),
		v_FROMDATE = fecha_salida.val(),
		v_TODATE = fecha_regreso.val(),
		v_radIdaVuelta = $('input:radio[name=radIdaVuelta]:checked').val(),
		v_codigoprom = $("#coupon").val(),
		v_radIdaVuelta = $('input:radio[name=radIdaVuelta]:checked').val(),
		arr_elm = v_FROMDATE.split("/"),
		v_diasalida = arr_elm[0],
		v_messalida = arr_elm[1],
		v_anosalida = arr_elm[2],
		arr_elm = v_TODATE.split("/"),
		v_diaregreso = arr_elm[0],
		v_mesregreso = arr_elm[1],
		v_anoregreso = arr_elm[2],
		v_fechas = true,		// Se definieron las fechas fexibles por defecto. Para cambiar a fechas exactas dejar esta variable en false
		v_cabinClass = $('input:radio[name=cabinClass]:checked').val(),
		v_pasajeros = $("#pasajeros").val(),
		v_pasajerosninos = $("#cbpasajerosninos").val(),
		v_infantesPasajeros = $("#cbinfantesPasajeros").val();	
		
	// if (v_FROM == 0 || v_FROM == undefined) {

	// 	//Agregar clase a la lista de selección
	// 	desde.addClass('error');

	// 	var msj = { 
	// 		es: "Seleccione la ciudad de origen", 
	// 		en: "Select a city of origin", 
	// 		pt:"Selecione uma cidade de origem" 
	// 	};

	// 	showError(error, lang, msj);

	// 	//return false;
	// }
	
	// if (v_TO == "" || v_TO == undefined || v_TO == 0) {
		
	// 	hacia.addClass('error');

	// 	var msj = {
	// 		es: "Seleccione la ciudad de destino",
	// 		en: "Select a destination",
	// 		pt: "Escolha um destino"
	// 	};

	// 	showError(error, lang, msj);
		
	// 	//return false;
	// }

	// if(v_FROM == v_TO){

	// 	desde.addClass('error');
	// 	hacia.addClass('error');

	// 	var msj = {
	// 		es: "El destino debe ser diferente del origen",
	// 		en: "The destination must be different from the origin",
	// 		pt: "O destino deve ser diferente da origem"
	// 	};

	// 	showError(error, lang, msj);
		
	// 	//return false;
	// }
	
	// if (v_FROMDATE == "" || v_FROMDATE == undefined) {

	// 	fecha_salida.addClass('error');

	// 	var msj = {
	// 		es: "Seleccione su fecha de salida",
	// 		en: "Select your departure date",
	// 		pt: "Escolha sua data de partida"
	// 	};

	// 	showError(error, lang, msj);

	// 	//return false;
	// }
	
	// if(v_radIdaVuelta == "RT"){
		
	// 	if (v_TODATE == "" || v_TODATE == undefined) {
	// 		alert("Seleccione su fecha de regreso");
	// 		return false;
	// 	}
	// } else {
	// 	v_TODATE = "";	
	// }
	
	goBooking(
		storeFront,
		v_codigoprom,
		v_radIdaVuelta,
		v_FROM,
		v_TO,
		v_diasalida,
		v_messalida,
		v_anosalida,
		v_diaregreso,
		v_mesregreso,
		v_anoregreso,
		v_fechas,
		v_cabinClass,
		v_pasajeros,
		v_pasajerosninos,
		v_infantesPasajeros
	);

	//return false;
}
/***
* Muestra el error en el idioma correcto
*
* @param error: 	Contenedor del error
* @param lang: 		lenguage del documento
* @param msj: 		Objeto que contiene el error en los 3 idiomas
*
****/

// function showError(error, lang, msj){
// 	error.css("display", "block");
// 	switch(lang){
// 		case 'es':
// 			$("<p>" + msj.es + "</p>").appendTo( error );
// 			break;
// 		case 'en':
// 			$("<p>" + msj.en + "</p>").appendTo( error );
// 			break;
// 		case 'pt':
// 			$("<p>" + msj.pt + "</p>").appendTo( error );
// 			break;
// 	}

// 	formValid = false;
// }


function goBooking(storeFront, v_codigoprom,v_radIdaVuelta,v_FROM,v_TO,v_diasalida,v_messalida,v_anosalida,v_diaregreso,v_mesregreso,v_anoregreso,v_fechas,v_cabinClass,v_pasajeros,v_pasajerosninos,v_infantesPasajeros){
	window.open("https://bookings.copaair.com/CMGS/AirLowFareSearchExternal.do?tripType="+v_radIdaVuelta+"&outboundOption.originLocationCode="+v_FROM+"&outboundOption.destinationLocationCode="+v_TO+"&outboundOption.departureDay="+v_diasalida+"&outboundOption.departureMonth="+v_messalida+"&outboundOption.departureYear="+v_anosalida+"&inboundOption.destinationLocationCode="+v_FROM+"&inboundOption.originLocationCode="+v_TO+"&inboundOption.departureDay="+v_diaregreso+"&inboundOption.departureMonth="+v_mesregreso+"&inboundOption.departureYear="+v_anoregreso+"&coupon="+v_codigoprom+"&flexibleSearch="+v_fechas+"&cabinClass="+v_cabinClass+"&guestTypes[0].type=ADT&guestTypes[0].amount="+v_pasajeros+"&guestTypes[1].type=CNN&guestTypes[1].amount="+v_pasajerosninos+"&guestTypes[2].type=INF&guestTypes[2].amount="+v_infantesPasajeros+"&pos=CM"+storeFront+"&lang=es")
}


		
