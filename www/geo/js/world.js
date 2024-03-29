/* Implementation of AR-Experience (aka "World"). */
// Initialize the platform object:

var World = {
    /*
        User's latest known location, accessible via userLocation.latitude, userLocation.longitude,
         userLocation.altitude.
     */
    userLocation: null,

    /* You may request new data from server periodically, however: in this sample data is only requested once. */
    isRequestingData: false,

    /* True once data was fetched. */
    initiallyLoadedData: false,

    /* Different POI-Marker assets. */
    markerDrawableIdle: null,
    markerDrawableSelected: null,
    markerDrawableDirectionIndicator: null,

    /* List of AR.GeoObjects that are currently shown in the scene / World. */
    markerList: [],

    /* the last selected marker. */
    currentMarker: null,

    locationUpdateCounter: 0,
    updatePlacemarkDistancesEveryXLocationUpdates: 10,

    

    /* Called to inject new POI data. */
    loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

        /* Destroys all existing AR-Objects (markers & radar). */
        AR.context.destroyAll();

        /* Show radar & set click-listener. */
        PoiRadar.show();
        $('#radarContainer').unbind('click');
        $("#radarContainer").click(PoiRadar.clickedRadar);

        /* Empty list of visible markers. */
        World.markerList = [];

        /* Start loading marker assets. */
        World.markerDrawableIdle = new AR.ImageResource("assets/marker_idle.png", {
            onError: World.onError
        });
        World.markerDrawableSelected = new AR.ImageResource("assets/marker_selected.png", {
            onError: World.onError
        });
        World.markerDrawableDirectionIndicator = new AR.ImageResource("assets/indi.png", {
            onError: World.onError
        });

        /* Loop through POI-information and create an AR.GeoObject (=Marker) per POI. */
        for (var e = 0; e < poiData.length; e++) {
            var singlePoi = {
                "id": poiData[e].id,
                "latitude": parseFloat(poiData[e].latitude),
                "longitude": parseFloat(poiData[e].longitude),
                "altitude": parseFloat(poiData[e].altitude),
                "title": poiData[e].name,
                "description": poiData[e].description,
                "web": poiData[e].web,
            };

            World.markerList.push(new Marker(singlePoi));
        }

        /* Updates distance information of all placemarks. */
        World.updateDistanceToUserValues();

        World.updateStatusMessage(e + ' Lugares cargados');

        /* Set distance slider to 100%. */
        $("#panel-distance-range").val(100);
        $("#panel-distance-range").slider("refresh");
    },

    /*
        Sets/updates distances of all makers so they are available way faster than calling (time-consuming)
        distanceToUser() method all the time.
     */
    updateDistanceToUserValues: function updateDistanceToUserValuesFn() {
        for (var i = 0; i < World.markerList.length; i++) {
            World.markerList[i].distanceToUser = World.markerList[i].markerObject.locations[0].distanceToUser();
        }
    },

    /* Updates status message shown in small "i"-button aligned bottom center. */
    updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

        var themeToUse = isWarning ? "e" : "c";
        var iconToUse = isWarning ? "alert" : "info";

        $("#status-message").html(message);
        $("#popupInfoButton").buttonMarkup({
            theme: themeToUse,
            icon: iconToUse
        });
    },

    /*
        It may make sense to display POI details in your native style.
        In this sample a very simple native screen opens when user presses the 'More' button in HTML.
        This demoes the interaction between JavaScript and native code.
    */
    /* User clicked "More" button in POI-detail panel -> fire event to open native screen. */
    onPoiDetailMoreButtonClicked: function onPoiDetailMoreButtonClickedFn() {

    },

    /* Location updates, fired every time you call architectView.setLocation() in native environment. */
    locationChanged: function locationChangedFn(lat, lon, alt, acc) {

        /* Store user's current location in World.userLocation, so you always know where user is. */
        World.userLocation = {
            'latitude': lat,
            'longitude': lon,
            'altitude': alt,
            'accuracy': acc
        };


        /* Request data if not already present. */
        if (!World.initiallyLoadedData) {
            World.requestDataFromServer();
            World.initiallyLoadedData = true;
        } else if (World.locationUpdateCounter === 0) {
            /*
                Update placemark distance information frequently, you max also update distances only every 10m with
                some more effort.
             */
            World.updateDistanceToUserValues();
        }

        /* Helper used to update placemark information every now and then (e.g. every 10 location upadtes fired). */
        World.locationUpdateCounter =
            (++World.locationUpdateCounter % World.updatePlacemarkDistancesEveryXLocationUpdates);
    },

    /*
        POIs usually have a name and sometimes a quite long description.
        Depending on your content type you may e.g. display a marker with its name and cropped description but
        allow the user to get more information after selecting it.
    */

    /* Fired when user pressed maker in cam. */
    onMarkerSelected: function onMarkerSelectedFn(marker) {
        World.currentMarker = marker;

        var lati = marker.poiData.latitude;
        var longi = marker.poiData.longitude;
        // Initialize the platform object:
        var platform = new H.service.Platform({
            'apikey': 'RxYhFAVe1CH0WXf96OiV9oksIeijen1Jk4n_nOfPfoI'
        });
        
        // Obtain the default map types from the platform object
        var defaultLayers = platform.createDefaultLayers();

        // Instantiate (and display) a map object:
        var map = new H.Map(
            document.getElementById('mapContainer'),
            defaultLayers.vector.normal.map, {
                zoom: 14.5,
                center: {
                    lat: lati,
                    lng: longi,
                }
            });
            if (lati!=0 && longi!=0) {
                coordsUsu = {lat: lati, lng: longi},
                markerUsu = new H.map.Marker(coordsUsu);
                map.addObject(markerUsu);
            }




        var resultado = 0;
        var estrellas = ['a', 'b', 'c', 'd', 'e'];
        //pregunto se ya voto en ese servicio

        var db = firebase.firestore();
        var serviciosRef = db.collection("servicios");
        var valServicios = serviciosRef.doc(marker.poiData.id).collection("valoracion");
        var usuario = localStorage.getItem('usuario');
        var bandera = 1;
        $('#linea').removeClass('visible').addClass('oculta');
        $('#check').removeClass('visible').addClass('oculta');
        $('#cantidadVotos').html('(0)');
        for (var i = 0; i < estrellas.length; i++) $("#" + estrellas[i]).attr("src", "valoracion/ev_b.png");
        if (usuario != ' ') {
            valServicios.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    if (doc.data().idUsuario == usuario) {
                        $('#check').removeClass('oculta').addClass('visible');
                        calcula();               
                        bandera = 0;
                    }
                });
            });
            if (bandera == 1) {
                $('#linea').removeClass('oculta').addClass('visible');
            }
        }

        /*
            In this sample a POI detail panel appears when pressing a cam-marker (the blue box with title &
            description), compare index.html in the sample's directory.
        */
        /* Update panel values. */
        $("#poi-detail-title").html(marker.poiData.title);
        $("#poi-detail-description").html(marker.poiData.description);


        /*
            It's ok for AR.Location subclass objects to return a distance of `undefined`. In case such a distance
            was calculated when all distances were queried in `updateDistanceToUserValues`, we recalculate this
            specific distance before we update the UI.
         */
        if (undefined === marker.distanceToUser) {
            marker.distanceToUser = marker.markerObject.locations[0].distanceToUser();
        }

        /*
            Distance and altitude are measured in meters by the SDK. You may convert them to miles / feet if
            required.
        */
        var distanceToUserValue = (marker.distanceToUser > 999) ?
            ((marker.distanceToUser / 1000).toFixed(2) + " km") :
            (Math.round(marker.distanceToUser) + " m");

        $("#poi-detail-distance").html(distanceToUserValue);

        //estrellas valoracion

        $("#a").on("click", function () {
            var n = 1;
            if (bandera == 1) {
                valServicios.add({
                        idUsuario: usuario,
                        puntos: n,
                    })
                    .then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        for (i = 0; i < estrellas.length; i++) {
                            $('#' + estrellas[i]).off('click');
                        };
                        calcula();
                    })
                    .catch(function (error) {
                        console.error("Error: ", error);
                    });
            }
        })

        $("#b").on("click", function () {
            var n = 2;
            if (bandera == 1) {
                valServicios.add({
                        idUsuario: usuario,
                        puntos: n,
                    })
                    .then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        for (i = 0; i < estrellas.length; i++) {
                            $('#' + estrellas[i]).off('click');
                        };
                        calcula();
                    })
                    .catch(function (error) {
                        console.error("Error: ", error);
                    });
            }
        })

        $("#c").on("click", function () {
            var n = 3;
            if (bandera == 1) {
                valServicios.add({
                        idUsuario: usuario,
                        puntos: n,
                    })
                    .then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        for (i = 0; i < estrellas.length; i++) {
                            $('#' + estrellas[i]).off('click');
                        };
                        calcula();
                    })
                    .catch(function (error) {
                        console.error("Error: ", error);
                    });
            }
        })

        $("#d").on("click", function () {
            var n = 4;
            if (bandera == 1) {
                valServicios.add({
                        idUsuario: usuario,
                        puntos: n,
                    })
                    .then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        for (i = 0; i < estrellas.length; i++) {
                            $('#' + estrellas[i]).off('click');
                        };
                        calcula();
                    })
                    .catch(function (error) {
                        console.error("Error: ", error);
                    });
            }
        })

        $("#e").on("click", function () {
            var n = 5;
            if (bandera == 1) {
                valServicios.add({
                        idUsuario: usuario,
                        puntos: n,
                    })
                    .then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        for (i = 0; i < estrellas.length; i++) {
                            $('#' + estrellas[i]).off('click');
                        };
                        calcula();
                    })
                    .catch(function (error) {
                        console.error("Error: ", error);
                    });
            }
        })

        function calcula() {
            $('#linea').removeClass('oculta').addClass('visible');
            var suma = 0;
            var contador = 0;
            valServicios.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    suma += doc.data().puntos;
                    contador++;
                });
                for (var i = 0; i < estrellas.length; i++) $("#" + estrellas[i]).attr("src", "valoracion/ev_b.png");
                var promedio = suma / contador;
                //calcula
                var n = parseInt(promedio) + 0.5; // n = 3,5
                var m = parseInt(promedio) + 0.75; // n = 3,75
                var l = parseInt(promedio) + 0.25; // n = 3,25
                if ((promedio > l) && (promedio < m)) resultado = n;
                if (promedio >= m) resultado = parseInt(promedio) + 1;
                if (promedio <= l) resultado = parseInt(promedio);
                //dibuja
                for (var i = 0; i < resultado; i++) $("#" + estrellas[i]).attr("src", "valoracion/ec_b.png");
                if (resultado - parseInt(resultado) == 0.5) {
                    $("#" + estrellas[parseInt(resultado)]).attr("src", "valoracion/em_b.png");
                }
                $('#cantidadVotos').html('('+contador+')');
                for (i = 0; i < estrellas.length; i++) {
                    $('#' + estrellas[i]).off('click');
                };
                $('#check').removeClass('oculta').addClass('visible');
            });
        }
        
    

        /* Show panel. */
        $("#panel-poidetail").panel("open", 123);

        $(".ui-panel-dismiss").unbind("mousedown");

        /* Deselect AR-marker when user exits detail screen div. */
        $("#panel-poidetail").on("panelbeforeclose", function (event, ui) {
            World.currentMarker.setDeselected(World.currentMarker);
        });
    },

    /* Screen was clicked but no geo-object was hit. */
    onScreenClick: function onScreenClickFn() {
        /* You may handle clicks on empty AR space too. */
    },

    /* Returns distance in meters of placemark with maxdistance * 1.1. */
    getMaxDistance: function getMaxDistanceFn() {

        /* Sort places by distance so the first entry is the one with the maximum distance. */
        World.markerList.sort(World.sortByDistanceSortingDescending);

        /* Use distanceToUser to get max-distance. */
        var maxDistanceMeters = World.markerList[0].distanceToUser;

        /*
            Return maximum distance times some factor >1.0 so ther is some room left and small movements of user
            don't cause places far away to disappear.
         */
        return maxDistanceMeters * 1.1;
    },

    /* Updates values show in "range panel". */
    updateRangeValues: function updateRangeValuesFn() {

        /* Get current slider value (0..100);. */
        var slider_value = $("#panel-distance-range").val();
        /* Max range relative to the maximum distance of all visible places. */
        var maxRangeMeters = Math.round(World.getMaxDistance() * (slider_value / 100));

        /* Range in meters including metric m/km. */
        var maxRangeValue = (maxRangeMeters > 999) ?
            ((maxRangeMeters / 1000).toFixed(2) + " km") :
            (Math.round(maxRangeMeters) + " m");

        /* Number of places within max-range. */
        var placesInRange = World.getNumberOfVisiblePlacesInRange(maxRangeMeters);

        /* Update UI labels accordingly. */
        $("#panel-distance-value").html(maxRangeValue);
        $("#panel-distance-places").html((placesInRange != 1) ?
            (placesInRange + " Servicios") : (placesInRange + " Servicios"));

        World.updateStatusMessage((placesInRange != 1) ?
            (placesInRange + " places loaded") : (placesInRange + " place loaded"));

        /* Update culling distance, so only places within given range are rendered. */
        AR.context.scene.cullingDistance = Math.max(maxRangeMeters, 1);

        /* Update radar's maxDistance so radius of radar is updated too. */
        PoiRadar.setMaxDistance(Math.max(maxRangeMeters, 1));
    },

    /* Returns number of places with same or lower distance than given range. */
    getNumberOfVisiblePlacesInRange: function getNumberOfVisiblePlacesInRangeFn(maxRangeMeters) {

        /* Sort markers by distance. */
        World.markerList.sort(World.sortByDistanceSorting);

        /* Loop through list and stop once a placemark is out of range ( -> very basic implementation ). */
        for (var i = 0; i < World.markerList.length; i++) {
            if (World.markerList[i].distanceToUser > maxRangeMeters) {
                return i;
            }
        }

        /* In case no placemark is out of range -> all are visible. */
        return World.markerList.length;
    },

    handlePanelMovements: function handlePanelMovementsFn() {

        $("#panel-distance").on("panelclose", function (event, ui) {
            $("#radarContainer").addClass("radarContainer_left");
            $("#radarContainer").removeClass("radarContainer_right");
            PoiRadar.updatePosition();
        });

        $("#panel-distance").on("panelopen", function (event, ui) {
            $("#radarContainer").removeClass("radarContainer_left");
            $("#radarContainer").addClass("radarContainer_right");
            PoiRadar.updatePosition();
        });
    },

    /* display de rango. */
    showRange: function showRangeFn() {
        if (World.markerList.length > 0) {

            /* Update labels on every range movement. */
            $('#panel-distance-range').change(function () {
                World.updateRangeValues();
            });

            World.updateRangeValues();
            World.handlePanelMovements();

            /* Open panel. */
            $("#panel-distance").trigger("updatelayout");
            $("#panel-distance").panel("open", 1234);
        } else {

            /* No places are visible, because the are not loaded yet. */
            World.updateStatusMessage('No places available yet', true);
        }
    },

    /*
        You may need to reload POI information because of user movements or manually for various reasons.
        In this example POIs are reloaded when user presses the refresh button.
        The button is defined in index.html and calls World.reloadPlaces() on click.
    */

    /* Reload places from content source. */
    reloadPlaces: function reloadPlacesFn() {
        if (!World.isRequestingData) {
            if (World.userLocation) {
                World.requestDataFromServer(World.userLocation.latitude, World.userLocation.longitude);
            } else {
                World.updateStatusMessage('Unknown user-location.', true);
            }
        } else {
            World.updateStatusMessage('Already requesing places...', true);
        }
    },


    /* Request POI data. */
    requestDataFromServer: function requestDataFromServerFn() {

        var json = JSON.parse(localStorage.getItem('json'));
        World.loadPoisFromJsonData(json);

    },

    /* Ayudante para ordenar lugares por distancia. */
    sortByDistanceSorting: function sortByDistanceSortingFn(a, b) {
        return a.distanceToUser - b.distanceToUser;
    },

    /* Ayudante para ordenar lugares por distancia, descendiendo. */
    sortByDistanceSortingDescending: function sortByDistanceSortingDescendingFn(a, b) {
        return b.distanceToUser - a.distanceToUser;
    },

    onError: function onErrorFn(error) {
        alert(error);
    },


};


/* Forward locationChanges to custom function. */
AR.context.onLocationChanged = World.locationChanged;

/* Forward clicks in empty area to World. */
AR.context.onScreenClick = World.onScreenClick;