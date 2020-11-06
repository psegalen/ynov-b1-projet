function traiterFilm(film) {
  id("titre").innerText = film.title;
  ajouterInfosCommunes(film);
  var infos = id("infos");
  var budget = document.createElement("div");
  budget.innerText = `Budget : ${
    film.budget ? formaterMontant(film.budget) : "?"
  } / Revenue : ${film.revenue ? formaterMontant(film.revenue) : "?"}`;
  infos.appendChild(budget);
  var duree = document.createElement("div");
  duree.innerText = "Durée : " + formaterDuree(film.runtime);
  infos.appendChild(duree);
}

function formaterDuree(duree) {
  if (duree) {
    var nbHeures = Math.floor(duree / 60);
    var nbMinutes = duree % 60;
    return nbHeures + " h " + nbMinutes;
  } else {
    return "inconnue";
  }
}

function formaterMontant(montant) {
  var montantEnEuros = Math.round(montant / 1.1);
  if (montantEnEuros > 1000000)
    return (montantEnEuros / 1000000).toFixed(1) + " M€";
  else if (montantEnEuros > 1000)
    return (montantEnEuros / 1000).toFixed(1) + " K€";
  else return montantEnEuros + " €";
}

function traiterSerie(serie) {
  id("titre").innerText = serie.name;
  ajouterInfosCommunes(serie);
  var infos = id("infos");
  var episodes = document.createElement("div");
  episodes.innerText = `Nombre de saisons : ${serie.seasons.length}`;
  infos.appendChild(episodes);
  for (let i = 0; i < serie.seasons.length; i++) {
    const element = serie.seasons[i];
    var saison = document.createElement("div");
    saison.innerText = `Saison ${i + 1} : ${element.episode_count} épisodes`;
    infos.appendChild(saison);
  }
  for (let i = 0; i < serie.networks.length; i++) {
    const element = serie.networks[i];
    if (element.logo_path) {
      var plateforme = document.createElement("img");
      plateforme.src = urlPlateforme(element.logo_path);
      infos.appendChild(plateforme);
    }
  }
}

function ajouterInfosCommunes(media) {
  id("backdrop").style.background = `url(${urlDuBackdrop(
    media
  )}) center center`;

  id("genre").innerText =
    media.genres && media.genres.length > 0 ? media.genres[0].name : "";
  id("votes").innerText = `${media.vote_average} (${media.vote_count})`;
}

function chargerMedia() {
  // Il faut récupérer cette info de l'URL, si l'id est celui d'une série, ça ne fonctionnera pas
  var mediaType = recupererParametre("type");
  var id = recupererParametre("id");
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

function urlPlateforme(logo) {
  return "https://image.tmdb.org/t/p/w154" + logo;
}

function urlDuBackdrop(media) {
  return media.backdrop_path
    ? "https://image.tmdb.org/t/p/w1280" + media.backdrop_path
    : "https://lh3.googleusercontent.com/proxy/dZsw-A4QmKEUGDv_rj_y7HtwTaTSM1HjhgZHogrb-HQAjF6VYY8YhLVRjZvFXvh3zvNRSiSDU0edc-HQYVzQ0LKSqfnD9eYzbHB12tow0O7IFk8w3n9YFSskLFTYhfaXmKRM";
}

function recupererParametre(nomParam) {
  // Spoiler : en modifiant légèrement cette fonction, elle pourrait aussi servir à récupérer le type de média
  var keyValues = document.location.search.replace("?", "").split("&");
  for (let i = 0; i < keyValues.length; i++) {
    const keyValue = keyValues[i].split("=");
    if (keyValue[0] == nomParam) {
      return keyValue[1];
    }
  }
  return "";
}

function id(id) {
  return document.getElementById(id);
}
