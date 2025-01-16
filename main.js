let Nährwerte
let Rezepte
let Einheiten
let Zutaten
function daten_aus_db() {
    fetch('cgi-bin/db_connection.php')
        .then(response => response.json())
        .then(daten => {
            Nährwerte = daten.naehrwerte;
            Rezepte = daten.rezepte;
            Einheiten = daten.einheiten;
            Zutaten = daten.zutaten;
        })

        .catch(error => {
            console.error("Fehler beim Abrufen der Daten:", error);
        });
}

daten_aus_db()

document.getElementById("Nährwerte").innerText = Nährwerte
document.getElementById("Rezepte").innerText = Rezepte
document.getElementById("Einheiten").innerText = Einheiten
document.getElementById("Zutaten").innerText = Zutaten