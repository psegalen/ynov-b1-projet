function creerCase(media) {
  var result = document.createElement("a");
  result.href = "media.html?id=" + media.id + "&type=" + media.media_type;
  result.className = "media";
  var img = document.createElement("img");
  img.src = urlDuPoster(media);
  img.className = "poster";
  result.appendChild(img);
  var infos = document.createElement("div");
  infos.className = "infos";
  result.appendChild(infos);
  var titre = document.createElement("span");
  titre.innerText = media.media_type == "movie" ? media.title : media.name;
  titre.className = "titre";
  infos.appendChild(titre);
  var type = document.createElement("span");
  type.innerText = media.media_type == "movie" ? "Film" : "Série";
  type.className = "type";
  infos.appendChild(type);
  var annee = document.createElement("span");
  annee.innerText =
    media.media_type == "movie"
      ? media.release_date
        ? media.release_date.split("-")[0]
        : "Année inconnue"
      : media.first_air_date
      ? media.first_air_date.split("-")[0]
      : "Année inconnue";
  annee.className = "annee";
  infos.appendChild(annee);
  return result;
}

function traiterResultats(resultats) {
  viderListe();
  // A faire : mettre en forme la liste de résultats
  if (resultats.total_results > 0) {
    id("nbResultats").innerText = resultats.total_results + " résultats !";

    for (let i = 0; i < resultats.results.length; i++) {
      const element = resultats.results[i];
      if (element.media_type == "movie" || element.media_type == "tv") {
        id("listeResultats").appendChild(creerCase(element));
      }
    }
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
    .then(result => {
      localStorage.setItem("medias", JSON.stringify(result.data));
      var recherches = localStorage.getItem("recherches")
        ? JSON.parse(localStorage.getItem("recherches"))
        : [];
      recherches.push(motsRecherches);
      localStorage.setItem("recherches", JSON.stringify(recherches));
      traiterResultats(result.data);
    })
    .catch(error => alert(error.message));
}

function verifierCache() {
  var resultatsPrecedents = JSON.parse(localStorage.getItem("medias"));
  var recherches = JSON.parse(localStorage.getItem("recherches"));
  if (resultatsPrecedents) {
    traiterResultats(resultatsPrecedents);
    if (recherches && recherches.length > 0) {
      id("motsRecherches").value = recherches[recherches.length - 1];
      // On inverse le tableau et on récupère les éléments 1 à 6
      var histo = recherches.reverse().slice(1, 6);
      for (var i = 0; i < histo.length; i++) {
        var mot = histo[i];
        var btn = document.createElement("button");
        btn.innerText = mot;
        // Le truc moche ci-dessous s'appelle une closure et dans ce cas précis, on n'a pas le choix
        btn.addEventListener(
          "click",
          (function(mot) {
            return function() {
              id("motsRecherches").value = mot;
              rechercher();
            };
          })(mot)
        );
        btn.style.marginRight = "16px";
        id("historique").appendChild(btn);
      }
    }
  }
}

function urlDuPoster(resultat) {
  return resultat.poster_path
    ? "https://image.tmdb.org/t/p/w342" + resultat.poster_path
    : "https://lh3.googleusercontent.com/proxy/dZsw-A4QmKEUGDv_rj_y7HtwTaTSM1HjhgZHogrb-HQAjF6VYY8YhLVRjZvFXvh3zvNRSiSDU0edc-HQYVzQ0LKSqfnD9eYzbHB12tow0O7IFk8w3n9YFSskLFTYhfaXmKRM";
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
