function traiterResultats(resultats) {
  viderListe();
  // A faire : mettre en forme la liste de résultats
  if (resultats.total_results > 0) {
    id("nbResultats").innerText = resultats.total_results + " résultats !";
    // Attention au champ "media_type", il faut filtrer sur "movie" ou "tv" !
    // Les lignes suivantes afficheront une image cassée si le premier résultat est de type "person"
    var img = document.createElement("img");
    img.src = urlDuPoster(resultats.results[0]);
    var lien = document.createElement("a");
    lien.href =
      "media.html?id=" +
      resultats.results[0].id +
      "&type=" +
      resultats.results[0].media_type;
    lien.appendChild(img);
    id("listeResultats").appendChild(lien);
  } else {
    id("nbResultats").innerText = "Pas de résultat !";
  }
}

function rechercher() {
  var motsRecherches = id("motsRecherches").value;
  axios
    .get(
      "https://api.themoviedb.org/3/search/multi?api_key=97719463bea4bd4b5902c1a735c0556a&language=fr-FR&query=" +
        motsRecherches
    )
    .then(result => traiterResultats(result.data))
    .catch(error => alert(error.message));
}

function urlDuPoster(resultat) {
  return "https://image.tmdb.org/t/p/w780" + resultat.poster_path;
}

function viderListe() {
  var liste = id("listeResultats");
  while (liste.hasChildNodes()) {
    liste.removeChild(liste.lastChild);
  }
}

function id(id) {
  return document.getElementById(id);
}
