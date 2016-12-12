
/* global swag */

function initMap() {
    if (Modernizr.geolocation) {
        console.log("vi har stöd för geolocation");
        navigator.geolocation.getCurrentPosition(loadMap);
    }

}
var apiUtanAvgift;
var apiautomat;
var apiMedAvgift;
var apiMc;
var apiHandikapp;

//Ikoner
var medAvgiftIcon;
var utanAvgiftIcon;
var handikappIcon;
var automaticon;
var McIcon;
var init = function () {
    console.log("onload fungerar..");
};

function toggle(master, cn) {
    var cbarray = document.getElementsByClassName(cn);
    for (var i = 0; i < cbarray.length; i++) {
        var cb = document.getElementById(cbarray[i].id);
        cb.checked = master.checked;
    }
}

function validate() {
    var choice1 = document.getElementById("parkeringUtanAvgift").checked;
    var choice2 = document.getElementById("parkingsAutomat").checked;
    var choice3 = document.getElementById("parkeringMedAvgift").checked;
    var choice4 = document.getElementById("parkeringMc").checked;
    var choice5 = document.getElementById("parkeringHandikapp").checked;



    if (choice1 === true) {
        console.log("choice1 fungerar");
        utanAvgiftIcon = 'img/utanAvgift.png';
        //Returnerar kommunala gatumarksparkeringar utan avgift
        $.getJSON('http://data.goteborg.se/ParkingService/v1.0/PublicTimeParkings/8e4034b9-189e-463d-8643-0c19807bb7e8?&format=json', function (data) {
            apiUtanAvgift = data;

            for (var i = 0; i < apiUtanAvgift.length; i++) {
                asd(i, "utanAvgift");


            }
        });
    }

    if (choice2 === true) {
        console.log("choice2 fungerar");
        automaticon = "img/automat.png";
        //Returnerar kommunala parkeringsautomater
        $.getJSON('http://data.goteborg.se/ParkingService/v1.0/PublicPayMachines/8e4034b9-189e-463d-8643-0c19807bb7e8?&format=json', function (data) {
            apiautomat = data;

            for (var i = 0; i < apiautomat.length; i++) {
                asd(i, "automater");

            }
        });
    }

    if (choice3 === true) {
        console.log("choice3 fungerar");
        medAvgiftIcon = 'img/medAvgift.png';
        //Returnerar kommunala gatumarksparkeringar med avgift
        $.getJSON('http://data.goteborg.se/ParkingService/v1.0/PublicTollParkings/8e4034b9-189e-463d-8643-0c19807bb7e8?&format=json', function (data) {
            apiMedAvgift = data;

            for (var i = 0; i < apiMedAvgift.length; i++) {
                asd(i, "medAvgift");

            }
        });
    }

    if (choice4 === true) {
        console.log("choice4 fungerar");
        handikappIcon = "img/handikapp.png";
        //Returnerar kommunala handikappsparkeringar
        $.getJSON('http://data.goteborg.se/ParkingService/v1.0/HandicapParkings/8e4034b9-189e-463d-8643-0c19807bb7e8?&format=json', function (data) {
            apiHandikapp = data;

            for (var i = 0; i < apiHandikapp.length; i++) {
                asd(i, "handikapp");

            }
        });
    }

    if (choice5 === true) {
        console.log("choice5 fungerar");
        mcIcon = "img/mc.png";
        //Returnerar MC-parkeringar
        $.getJSON('http://data.goteborg.se/ParkingService/v1.0/MCParkings/8e4034b9-189e-463d-8643-0c19807bb7e8?&format=json', function (data) {
            apiMc = data;
            
            for (var i = 0; i < apiMc.length; i++) {
                asd(i, "mc");

            }
        });
    } else if ((choice1 === false) &&
            (choice2 === false) &&
            (choice3 === false) &&
            (choice4 === false) &&
            (choice5 === false))
    {
        alert("choose atleast one parkingspace");
        return false;
    }
    return true;
}

//Returnerar kommunala gatumarksparkeringar utan avgift
function asd(i, parkeringsNamn) {
    if (parkeringsNamn === "medAvgift") {
        var medAvgiftMaker = new google.maps.Marker({
            position: {lat: apiMedAvgift[i].Lat, lng: apiMedAvgift[i].Long},
            map: map,
            icon: medAvgiftIcon
        });
        var parkeringsPlatserMedAvgift;
        if (apiMedAvgift[i].ParkingSpaces === undefined) {
            parkeringsPlatserMedAvgift = '';
        } else {
            parkeringsPlatserMedAvgift = '<p class="subTitel">Parkerings platser: </p>' + apiMedAvgift[i].ParkingSpaces;
        }

        var extraInfoMedAvgift;
        if (apiMedAvgift[i].ExtraInfo === undefined) {
            extraInfoMedAvgift = '</div>';
        } else {
            extraInfoMedAvgift = '<p class="subTitel">Extra info: </p>' + apiMedAvgift[i].ExtraInfo + '</div>';
        }
        // informations fönster om parkeringar med avgift
        var infoMed = document.createElement("DIV");
        infoMed.innerHTML = '<div class="infoFonsterMed"><p class="titel">Parkering med avgift</p></div>';
        var border = document.createElement("DIV");
        border.className = "border";
        border.innerHTML = '<p class="subTitel">Plats: </p>' +
                apiMedAvgift[i].Name +
                '<p class="subTitel">Max parkeringstid: </p>' +
                apiMedAvgift[i].MaxParkingTime +
                parkeringsPlatserMedAvgift
                + extraInfoMedAvgift;
                infoMed.appendChild(border);
                
                var streetview = document.createElement("DIV");
        streetview.style.width = "250px";
        streetview.style.height = "120px";
        border.appendChild(streetview);
        var windowMed = new google.maps.InfoWindow({
            content: infoMed

        });
        medAvgiftMaker.addListener('click', function () {          
            windowMed.open(map, medAvgiftMaker);
            // tar bort google maps infowindow vita backgrund 
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();
            iwBackground.children(':nth-child(2)').css({'display': 'none'});
            iwBackground.children(':nth-child(4)').css({'display': 'none'});
            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.css({
                opacity: '1',
                right: '37px', top: '15px',
                'box-shadow': '0 0 5px #3990B9'
            });
            var panorama = new google.maps.StreetViewPanorama(streetview, {
            navigationControl: false,
            enableCloseButton: false,
            addressControl: false,
            linksControl: false,
            clickToGo: false,
            panControl: false,
            visible: true,
            position: medAvgiftMaker.getPosition()
        });
        });
    }

    if (parkeringsNamn === "utanAvgift") {
        var utanAvgiftMarker = new google.maps.Marker({
            position: {lat: apiUtanAvgift[i].Lat, lng: apiUtanAvgift[i].Long},
            map: map,
            icon: utanAvgiftIcon,
            title: "test"

        });
        //ifall parkeringsplatser eller extra info inte finns på parkeringar utan avgift
        var parkeringsPlatserUtanAvgift;
        if (apiUtanAvgift[i].ParkingSpaces === undefined) {
            parkeringsPlatserUtanAvgift = '';
        } else {
            parkeringsPlatserUtanAvgift = '<p class="subTitel">Parkerings platser: </p>' + apiUtanAvgift[i].ParkingSpaces;
        }

        var extraInfoUtanAvgift;
        if (apiUtanAvgift[i].ExtraInfo === undefined) {
            extraInfoUtanAvgift = '</div>';
        } else {
            extraInfoUtanAvgift = '<p class="subTitel">Extra info: </p>' + apiUtanAvgift[i].ExtraInfo + '</div>';
        }


        //iformations fönster om parkeringar utan avgift
        var infoUtan = document.createElement("DIV");
            infoUtan.innerHTML = '<div class="infoFonsterUtan"><p class="titel">Parkering utan avgift</p></div>';
        var border = document.createElement("DIV");
        border.className = "border";
        border.innerHTML = '<p class="subTitel">Plats: </p>' +
                apiUtanAvgift[i].Name +
                '<p class="subTitel">Max parkeringstid: </p>' +
                apiUtanAvgift[i].MaxParkingTime +
                parkeringsPlatserUtanAvgift +
                extraInfoUtanAvgift;
                infoUtan.appendChild(border);
                
                var streetview = document.createElement("DIV");
        streetview.style.width = "250px";
        streetview.style.height = "120px";
        border.appendChild(streetview);
        var windowUtan = new google.maps.InfoWindow({
            content: infoUtan
        });
        utanAvgiftMarker.addListener('click', function () {
            windowUtan.open(map, utanAvgiftMarker);
            // tar bort google maps infowindow vita backgrund 
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();
            iwBackground.children(':nth-child(2)').css({'display': 'none'});
            iwBackground.children(':nth-child(4)').css({'display': 'none'});
            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.css({
                opacity: '1',
                right: '37px', top: '15px',
                'box-shadow': '0 0 5px #3990B9'
            });
            var panorama = new google.maps.StreetViewPanorama(streetview, {
            navigationControl: false,
            enableCloseButton: false,
            addressControl: false,
            linksControl: false,
            clickToGo: false,
            panControl: false,
            visible: true,
            position: utanAvgiftMarker.getPosition()
        });
        });
    }

    if (parkeringsNamn === "automater") {
        var automat = new google.maps.Marker({
            position: {lat: apiautomat[i].Lat, lng: apiautomat[i].Long},
            map: map,
            icon: automaticon
        });
        //iformations fönster om automater 
        
        var infoauto = document.createElement("DIV");
          infoauto.innerHTML = '<div class="infoFonsterAutomat"><p class="titel">Automat</p></div>';
        var border = document.createElement("DIV");
        border.className = "border";
        border.innerHTML =  '<p class="subTitel">Plats: </p>' +
                apiautomat[i].Name +
                '<p class="subTitel">Max parkeringstid: </p>' +
                apiautomat[i].MaxParkingTime +
                '<p class="subTitel">Kostnad: </p>' +
                apiautomat[i].ParkingCost;
        infoauto.appendChild(border);
        
        
        var streetview = document.createElement("DIV");
        streetview.style.width = "250px";
        streetview.style.height = "120px";
       border.appendChild(streetview);
        var autowindow = new google.maps.InfoWindow({
            content: infoauto
        });
        
        automat.addListener('click', function () {
            autowindow.open(map, automat);
            // tar bort google maps infowindow vita backgrund 
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();
            iwBackground.children(':nth-child(2)').css({'display': 'none'});
            iwBackground.children(':nth-child(4)').css({'display': 'none'});
            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.css({
                opacity: '1',
                right: '37px', top: '15px',
                'box-shadow': '0 0 5px #3990B9'
            });
            
            var panorama = new google.maps.StreetViewPanorama(streetview, {
            navigationControl: false,
            enableCloseButton: false,
            addressControl: false,
            linksControl: false,
            clickToGo: false,
            panControl: false,
            visible: true,
            position: automat.getPosition()
        });
        });
    }

    if (parkeringsNamn === "handikapp") {
        var handikappMarker = new google.maps.Marker({
            position: {lat: apiHandikapp[i].Lat, lng: apiHandikapp[i].Long},
            map: map,
            icon: handikappIcon
        });
        var parkeringsPlatserHandi;
        if (apiHandikapp[i].ParkingSpaces === undefined) {
            parkeringsPlatserHandi = '<div>';
        } else {
            parkeringsPlatserHandi = '<p class="subTitel">Parkerings platser: </p>' + apiHandikapp[i].ParkingSpaces + '</div>';
        }
        var infoHandi = document.createElement("DIV");
        infoHandi.innerHTML = '<div class="infoFonsterHandi"><p class="titel">Handikapparkering</p></div>';
        var border = document.createElement("DIV");
        border.className = "border";
        border.innerHTML ='<p class="subTitel">Plats: </p>' +
                apiHandikapp[i].Name +
                '<p class="subTitel">Max parkeringstid: </p>' +
                apiHandikapp[i].MaxParkingTime +
                parkeringsPlatserHandi; 
        infoHandi.appendChild(border);
        
        
        var streetview = document.createElement("DIV");
        streetview.style.width = "250px";
        streetview.style.height = "120px";
       border.appendChild(streetview);
        var windowHandi = new google.maps.InfoWindow({
            content: infoHandi
        });
        handikappMarker.addListener('click', function () {
            windowHandi.open(map, handikappMarker);
            // tar bort google maps infowindow vita backgrund 
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();
            iwBackground.children(':nth-child(2)').css({'display': 'none'});
            iwBackground.children(':nth-child(4)').css({'display': 'none'});
            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.css({
                opacity: '1',
                right: '37px', top: '15px',
                'box-shadow': '0 0 5px #3990B9'
            });
            var panorama = new google.maps.StreetViewPanorama(streetview, {
            navigationControl: false,
            enableCloseButton: false,
            addressControl: false,
            linksControl: false,
            clickToGo: false,
            panControl: false,
            visible: true,
            position: handikappMarker.getPosition()
        });
        });
    }

    if (parkeringsNamn === "mc") {
        var McMarker = new google.maps.Marker({
            position: {lat: apiMc[i].Lat, lng: apiMc[i].Long},
            map: map,
            icon: mcIcon
        });
        var maxParkeringMc;
        if (apiMc[i].MaxParkingTime === undefined) {
            maxParkeringMc = "</div>";
        } else {
            maxParkeringMc = '<p class="subTitel">Max parkeringstid: </p>' + apiMc[i].MaxParkingTime + '</div>';
        }

        var infoMc = document.createElement("DIV");
            infoMc.innerHTML = '<div class="infoFonsterMc"><p class="titel">Mc parkeringar</p></div>';
            var border = document.createElement("DIV");
            border.className = "border";
            border.innerHTML = '<p class="subTitel">Plats: </p>' +
                apiMc[i].Name +
                maxParkeringMc;
        infoMc.appendChild(border);
        
        
        var streetview = document.createElement("DIV");
        streetview.style.width = "250px";
        streetview.style.height = "120px";
       border.appendChild(streetview);
        var windowMc = new google.maps.InfoWindow({
            content: infoMc
        });
        McMarker.addListener('click', function () {
            windowMc.open(map, McMarker);
            // tar bort google maps infowindow vita backgrund 
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();
            iwBackground.children(':nth-child(2)').css({'display': 'none'});
            iwBackground.children(':nth-child(4)').css({'display': 'none'});
            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.css({
                opacity: '1',
                right: '37px', top: '15px',
                'box-shadow': '0 0 5px #3990B9'
            });
            var panorama = new google.maps.StreetViewPanorama(streetview, {
            navigationControl: false,
            enableCloseButton: false,
            addressControl: false,
            linksControl: false,
            clickToGo: false,
            panControl: false,
            visible: true,
            position: McMarker.getPosition()
        });
        });
    }

    
}




function loadMap(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude + ";" + longitude);
    //AIzaSyD87KDtA4OkpIs5IEVT4d_gEdAwlE-aYTw
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: latitude, lng: longitude},
        zoom: 10
    });
    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        map: map

    });
}




