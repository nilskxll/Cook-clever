let Rezept1
let Rezept2
let Rezept3

fetch('cgi-bin/db_connection.php')
    .then(response => {
        if (!response.ok) {
            throw new Error("Netzwerk-Antwort war nicht OK");
        }
        return response.json();
    })
    .then(daten => {
        Rezept1 = daten[0].Kohlenhydrate
        Rezept2 = daten[1].Kohlenhydrate
        Rezept3 = daten[2].Kohlenhydrate
        ausführen();
    })

    .catch(error => {
        console.error("Fehler beim Abrufen der Daten:", error);
    });
function ausführen(){
    document.getElementById("Kohlenhydrate").innerText = Rezept2
}
