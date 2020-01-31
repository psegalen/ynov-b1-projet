function traiterFilm(film) {
  id("titre").innerText = film.title;
}

function traiterSerie(serie) {
  id("titre").innerText = serie.name;
}

function chargerMedia() {
  // Il faut récupérer cette info de l'URL, si l'id est celui d'une série, ça ne fonctionnera pas
  var mediaType = "movie";
  var id = recupererParametre();
  if (id.length == 0) {
    alert("Il y a un souci dans l'URL !");
  } else {
    var tmdbUrl =
      "https://api.themoviedb.org/3/" +
      mediaType +
      "/" +
      id +
      "?api_key=97719463bea4bd4b5902c1a735c0556a&language=fr-FR";
    axios
      .get(tmdbUrl)
      .then(result =>
        mediaType == "movie"
          ? traiterFilm(result.data)
          : traiterSerie(result.data)
      );
  }
}

function recupererParametre() {
  // Spoiler : en modifiant légèrement cette fonction, elle pourrait aussi servir à récupérer le type de média
  var keyValues = document.location.search.replace("?", "").split("&");
  for (let i = 0; i < keyValues.length; i++) {
    const keyValue = keyValues[i].split("=");
    if (keyValue[0] == "id") {
      return keyValue[1];
    }
  }
  return "";
}

function id(id) {
  return document.getElementById(id);
}
