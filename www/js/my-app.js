  // If we need to use custom DOM library, let's save it to $$ variable:
  var $$ = Dom7;

  var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'BuscAPP',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [{
        path: '/about/',
        url: 'about.html',
      },
      {
        path: '/login/',
        url: 'login.html',
      }, ,
      {
        path: '/index/',
        url: 'index.html',
      },
      {
        path: '/registro/',
        url: 'registro.html',
      }
    ]
    // ... other parameters
  });

  var mainView = app.views.create('.view-main');


  // Handle Cordova Device Ready Event
  $$(document).on('deviceready', function () {
    console.log("Device is ready!");

    $$('.tocaBoton').on('click', fnTocaBoton);

    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);
  });

  /* // Initialize the platform object:
 var platform = new H.service.Platform({
  'apikey': 'RxYhFAVe1CH0WXf96OiV9oksIeijen1Jk4n_nOfPfoI'
});

// Obtain the default map types from the platform object
var maptypes = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('mapContainer'),
  maptypes.vector.normal.map,
  {
    zoom: 10,
    center: { lng: -33.1167, lat: -61.3333 }
  });
});
*/


  // Option 1. Using one 'page:init' handler for all pages
  $$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);

    $$('#modoOscuro').on('click', fnModoOscuro);
  })


  $$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);

  })
  // Option 2. Using live 'page:init' event handlers for each page
  $$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$('#guardar').on('click', fnRegistro);
    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);

  })

  $$(document).on('page:init', '.page[data-name="login"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$('#login').on('click', fnLogin);
    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);

  })


  /** FUNCIONES PROPIAS **/
  function fnTocaBoton() {
    var mensaje = "";

    idDelBoton = this.id;
    mensaje = "Mi ID es: " + idDelBoton + "<br/>";

    // voy a "separar" el valor del id, usando los guiones bajos
    // el split separa un valor (en este caso una variable),
    // usando el caracter o caracteres indicandos como parámetro
    // el resultado es un array!
    var partes = idDelBoton.split("_");

    // sabiendo la forma: btn_g1_1 puedo tener:
    p0 = partes[0];
    p1 = partes[1];
    p2 = partes[2];

    mensaje += "Soy del Grupo: " + p1 + "<br/>";
    mensaje += "Y tengo el nro: " + p2 + "<br/>";

    $$('#msgBtn').html(mensaje);
  }

  function fnModoOscuro() {
    if ($$(this).prop("checked") == true) {
      $$('*').removeClass("modoComun").addClass("modoOscuro");
    } else {
      $$('*').removeClass("modoOscuro").addClass("modoComun");
    }
  }

  function fnRegistro() {
    var huboError = 0;
    var email = $$('#regEmail').val();
    var clave = $$('#regClave').val();
    // alert('mail: ' + email);
    // alert('pass: ' + clave);
    firebase.auth().createUserWithEmailAndPassword(email, clave)
      .catch(function (error) {
        huboError = 1;
        console.log(error.code);
        console.log(error.message);
        alert('error')
      })
      .then(function () {
        if (huboError == 0) {
          alert('OK');
          mainView.router.navigate("/index/");
        }
      });
  }

  function fnLogin() {

    var huboError = 0;
    var email = $$('#email').val();
    var clave = $$('#clave').val();
    // alert('mail: ' + email);
    // alert('pass: ' + clave);
    firebase.auth().signInWithEmailAndPassword(email, clave)
      .catch(function (error) {
        huboError = 1;
        console.log(error.code);
        console.log(error.message);
        alert('error')
      })
      .then(function () {
        if (huboError == 0) {
          alert('OK');
          mainView.router.navigate("/index/");
        }
      });
  }

  function fnOcultaPanel(){
    app.panel.close();
  }