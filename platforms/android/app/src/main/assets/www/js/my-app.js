  // If we need to use custom DOM library, let's save it to $$ variable:
  var $$ = Dom7;

  var appF7 = new Framework7({
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
      },
      {
        path: '/index/',
        url: 'index.html',
      },
      {
        path: '/registro/',
        url: 'registro.html',
      },
      {
        path: '/servicios/',
        url: 'servicios.html',
      },
      {
        path: '/regServicios/',
        url: 'regServicios.html',
      },
    ]
  });

  var mainView = appF7.views.create('.view-main');
  var db = firebase.firestore();
  var usuariosRef = db.collection("usuarios");
  var serviciosRef = db.collection("servicios");
  var tipo;
  var storage = window.localStorage;

  // Option 1. Using one 'page:init' handler for all pages
  $$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized

  });
 
  // Handle Cordova Device Ready Event
  $$(document).on('deviceready', function () {
    console.log("Device is ready!");

    storage.clear();

    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);
    $$('#addServicio').on('click', fnOcultaPanel);

    $$('.bar').on('click', function(){
      tipo = 'bar'
      fnCreaJson()
      geoAR();
    });
    $$('.verduleria').on('click', function(){
      tipo = 'verdu'
      fnCreaJson()
      geoAR();
    });
    $$('.casino').on('click', function(){
      tipo = 'casino'
      fnCreaJson()
      geoAR();
    });
    $$('.ypf').on('click', function(){
      tipo = 'combustible'
      fnCreaJson()
      geoAR();
    });
    $$('.super').on('click', function(){
      tipo = 'market'
      fnCreaJson()
      geoAR();
    });
    $$('.banco').on('click', function(){
      tipo = 'banco'
      fnCreaJson()
      geoAR();
    });

  });


  $$(document).on('page:init', '.page[data-name="index"]', function () {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);
    $$('#addServicio').on('click', fnOcultaPanel);

    $$('.bar').on('click', function(){
      tipo = 'bar'
      fnCreaJson()
      geoAR();
    });
    $$('.verduleria').on('click', function(){
      tipo = 'verdu'
      fnCreaJson()
      geoAR();
    });
    $$('.casino').on('click', function(){
      tipo = 'casino'
      fnCreaJson()
      geoAR();
    });
    $$('.ypf').on('click', function(){
      tipo = 'combustible'
      fnCreaJson()
      geoAR();
    });
    $$('.super').on('click', function(){
      tipo = 'market'
      fnCreaJson()
      geoAR();
    });
    $$('.banco').on('click', function(){
      tipo = 'banco'
      fnCreaJson()
      geoAR();
    });

  })


  // Option 2. Using live 'page:init' event handlers for each page
  $$(document).on('page:init', '.page[data-name="registro"]', function () {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$('#guardar').on('click', fnRegistro);
    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);

  })

  $$(document).on('page:init', '.page[data-name="login"]', function () {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$('#login').on('click', fnLogin);
    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel);

  });
  $$(document).on('page:init', '.page[data-name="regServicios"]', function () {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$('#ingresar').on('click', fnOcultaPanel);
    $$('#home').on('click', fnOcultaPanel)

    $$('#guardaServi').on('click', fnGuardaServicio);

  })


  /** FUNCIONES PROPIAS **/

  function fnRegistro() {
    var huboError = 0;
    var email = $$('#regEmail').val();
    var clave = $$('#regClave').val();
    var nombre = $$('#regNombre').val();
    if (nombre != '' && clave != '' && email != '') {
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
    if (clave != '' && email != '') {
      firebase.auth().signInWithEmailAndPassword(email, clave)
        .catch(function (error) {
          huboError = 1;
          console.log(error.code);
          console.log(error.message);
          alert('Error')
        })
        .then(function () {
          if (huboError == 0) {
            recuperaNombre(email);
          }
        });
    } else {
      alert('Complete todos los datos')
    }

  }

  function fnOcultaPanel() {
    appF7.panel.close();
  }

  function guardaUsuario(nombre, email, clave) {
    db.collection("usuarios").add({
        nombre: nombre,
        email: email,
        password: clave
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        alert('entro y gurda en db'); ///////////////////////sacar
        $$('#ingresaPanel').addClass('oculta');
        storage.removeItem('usuario');
        storage.setItem('usuario', docRef.id);
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
          storage.removeItem('usuario');
          storage.setItem('usuario', doc.id);
          $$('#setNombre').html(doc.data().nombre);
          $$('#setEmail').html(doc.data().email);
          $$('#ingresaPanel').addClass('oculta');
          mainView.router.navigate("/index/");
        }
      });
    });
    $$('#ingresaPanel').addClass('oculta');
    mainView.router.navigate("/index/");
  }

  function geoAR() {
    app.loadARchitectWorld(getSamplePath(0, 0))
  }

  function fnGuardaServicio() {
    var nombreserv = $$('#nombreServi').val();
    var provserv = $$('#provServi').val();
    var cityserv = $$('#cityServi').val();
    var calleserv = $$('#calleServi').val();
    var numserv = $$('#numServi').val();
    var descripserv = $$('#descripServi').val();
    var tiposerv = $$('#tipoServi').val();
    if (nombreserv != '' && provserv != '' && cityserv != '' && calleserv != '' && numserv != '' && descripserv != '' && tiposerv != '') {
      // GEOCODER ES UN SERVICIO DE REST
      url = 'https://geocoder.ls.hereapi.com/6.2/geocode.json';
      appF7.request.json(url, {
        searchtext: calleserv + ' ' + numserv + ' ' + cityserv + ' ' + provserv,
        apiKey: '5fk1FNfRfJF3fUqf5McksZ1b2BsNOamyoHdLNMhhEsY',
        gen: '9'
      }, function (data) {
        // POSICION GEOCODIFICADA de la direccion
        var latitud = data.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
        var longitud = data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
        // alert(latitud + " / " + longitud);
        serviciosRef.add({
            nombre: nombreserv,
            provincia: provserv,
            ciudad: cityserv,
            calle: calleserv,
            numero: numserv,
            descripcion: descripserv,
            tipo: tiposerv,
            lat: latitud,
            long: longitud
          })
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            alert('Servicio cargado correctamente');
            mainView.router.navigate("/index/");
          })
          .catch(function (error) {
            console.error("Error: ", error);
          });
      }, function (status) {
        console.log("Error geocode: " + status);
        alert('Error de geocodificacion')
      });
    } else {
      alert('Complete todos los datos')
    }
  };

  function fnCreaJson(){
    var jsonArr = [];
      serviciosRef.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (doc.data().tipo === tipo) { 
              var id = doc.id;
              var nombre = doc.data().nombre;
              var lat = doc.data().lat;
              var lon = doc.data().long;
              var descripcion = doc.data().descripcion;
              jsonArr.push({
                "id": id,
                "longitude": lon,
                "latitude": lat,
                "altitude": "100.0",
                "description": descripcion,
                "name": nombre
              });
            }
          });
          storage.removeItem('json');
          storage.setItem('json', JSON.stringify(jsonArr));
        })
        .catch(function (error) {
          console.log("Error: ", error);
        });
  }