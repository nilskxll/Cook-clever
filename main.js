
function daten_aus_db() {
    fetch('cgi-bin/db_connection.php')
        .then(response => response.json())
        .then(daten => {
            console.log("Nährwerte:", daten.naehrwerte);
            console.log("Rezepte:", daten.rezepte);
            console.log("Einheiten:", daten.einheiten);
            console.log("Zutaten:", daten.zutaten);
            //ausführen();
        })

        .catch(error => {
            console.error("Fehler beim Abrufen der Daten:", error);
        });
}

daten_aus_db()