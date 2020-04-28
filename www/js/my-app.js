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
      },
      {
        path: '/camara/',
        url: 'camara.html',
      },
      {
        path: '/servicios/',
        url: 'servicios.html',
      },
    ]
    // ... other parameters
  });

  var mainView = app.views.create('.view-main');
  var db = firebase.firestore();
  var usuariosRef = db.collection("usuarios");

  var lat = 0,
    lon = 0;

  // Option 1. Using one 'page:init' handler for all pages
  $$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
    app.dialog.preloader('My text...');
    setTimeout(function () {
      app.dialog.close();
    }, 200);



  });

  // Handle Cordova Device Ready Event
  $$(document).on('deviceready', function () {
    console.log("Device is ready!");

    $$('.tocaBoton').on('click', fnTocaBoton);

    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);

    $$('.bar').on('click', geoAR);
    $$('.verduleria').on('click', geoAR);
    $$('.casino').on('click', geoAR);
    $$('.ypf').on('click', geoAR);
    $$('.super').on('click', geoAR);
    $$('.banco').on('click', geoAR);

  });

  $$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);

    $$('.bar').on('click', geoAR);
    $$('.verduleria').on('click', geoAR);
    $$('.casino').on('click', geoAR);
    $$('.ypf').on('click', geoAR);
    $$('.super').on('click', geoAR);
    $$('.banco').on('click', geoAR);

  })


  $$(document).on('page:init', '.page[data-name="camara"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);

    $$('#btnMap').on('click', fnPintaMap);
    $$('#btnCam').on('click', fnPintaCam);


    $$('#prueba').on('click', function () {
      mainView.router.navigate("/servicios/");
    })

  });

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

  function fnRegistro() {
    var huboError = 0;
    var email = $$('#regEmail').val();
    var clave = $$('#regClave').val();
    var nombre = $$('#regNombre').val();
    if (nombre != '' || clave != '' || email != '') {
      firebase.auth().createUserWithEmailAndPassword(email, clave)
        .catch(function (error) {
          huboError = 1;
          console.log(error.code);
          console.log(error.message);
          switch (error.code) {
            case 'auth/weak-password':
              alert('Contraseña poco segura (minimo 6 caracteres)');
              break
            case 'auth/invalid-email':
              alert('Correo ingresado invalido');
              break
            case 'auth/email-already-in-use':
              alert('Correo ya registrado');
              break
          }
        })
        .then(function () {
          if (huboError == 0) {
            alert('OK');
            $$('#setNombre').html(nombre);
            guardaUsuario(nombre, email, clave);

          }
        });
    } else {
      alert('Complete todos los datos')
    }
  }

  function fnLogin() {

    var huboError = 0;
    var email = $$('#email').val();
    var clave = $$('#clave').val();
    if (clave != '' || email != '') {
      firebase.auth().signInWithEmailAndPassword(email, clave)
        .catch(function (error) {
          huboError = 1;
          console.log(error.code);
          console.log(error.message);
          alert('Error')
        })
        .then(function () {
          if (huboError == 0) {
            alert('OK');
            $$('#ingresaPanel').addClass('oculta');
            recuperaNombre(email);
            mainView.router.navigate("/index/");
          }
        });
    } else {
      alert('Complete todos los datos')
    }

  }

  function fnOcultaPanel() {
    app.panel.close();
  }

  function fnVisor() {
    mainView.router.navigate("/camara/");
  }

  function fnPintaCam() {
    $$('#btnMap').removeClass("button-fill").addClass("button-outline");
    $$('#btnCam').addClass("button-fill");
    $$('#videoCam').removeClass('oculta').addClass('visible');
    $$('#mapContainer').removeClass('visible').addClass('oculta');

  }

  function fnPintaMap() {
    $$('#btnCam').removeClass("button-fill").addClass("button-outline");
    $$('#btnMap').addClass("button-fill");
    $$('#videoCam').removeClass('visible').addClass('oculta');
    $$('#mapContainer').removeClass('oculta').addClass('visible');
    muestramapa();

  }

  function muestramapa() { //no me funcionaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    // Initialize the platform object:
    var platform = new H.service.Platform({
      'apikey': 'RxYhFAVe1CH0WXf96OiV9oksIeijen1Jk4n_nOfPfoI'
    });

    // Obtain the default map types from the platform object
    var maptypes = platform.createDefaultLayers();
    //var layers =  platform.createDefaultLayers();
    // Instantiate (and display) a map object:
    var map = new H.Map(
      document.getElementById('mapContainer'),
      maptypes.vector.normal.map,
      //layers.raster.terrain.transit
      {
        zoom: 15,
        center: {
          lng: -61.3333,
          lat: -33.1167
        }
      });

    // Create the default UI:
    var ui = H.ui.UI.createDefault(map, maptypes, 'es-ES');
  }

  function guardaUsuario(nombre, email, clave) {
    db.collection("usuarios").add({
        nombre: nombre,
        email: email,
        password: clave
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        alert('entro y gurda en db');
        $$('#ingresaPanel').addClass('oculta');
        mainView.router.navigate("/index/");
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  function recuperaNombre(mail) {
    usuariosRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().email == mail) {
          alert('encontrado');
          $$('#setNombre').html(doc.data().nombre);
        }
      });
    });
  }

  function geoAR(){
    app.loadARchitectWorld(getSamplePath(0, 0))
  }
