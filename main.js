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
            ausführen()
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Daten:", error);
        });
}

function ausführen() {
    document.getElementById("Nährwerte").innerText = JSON.stringify(Nährwerte)
    document.getElementById("Rezepte").innerText = JSON.stringify(Rezepte)
    document.getElementById("Einheiten").innerText = JSON.stringify(Einheiten)
    document.getElementById("Zutaten").innerText = JSON.stringify(Zutaten)
}

daten_aus_db()
