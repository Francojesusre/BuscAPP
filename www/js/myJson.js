
var db = firebase.firestore().collection("servicios");
var serviciosRef = db.collection("servicios");

function creaJson(tipoElegido) {
    var strMiJSON = '[';
    firebase.firestore().collection("servicios").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                if (doc.data().tipo == tipoElegido) {
                    nombre = doc.data().nombre
                    lat = doc.data().latitud;
                    lon = doc.data().longitud;
                    descripcion = doc.data().descripcion
                    strMiJSON += '{"id":"' + doc.data() + '","longitude":"' + lon + '","latitude":"' + lat + '","description":"' + descripcion + '","name":"' + nombre + '"},'
                }
            });
            strMiJSON += ']';
            MiJson = JSON.parse(strMiJSON);
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });
    console.log(MiJson);
    return(MiJson)
}