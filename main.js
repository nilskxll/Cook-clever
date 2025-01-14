fetch('db_connection.php')
    .then(response => {
        if (!response.ok) {
            throw new Error("Netzwerk-Antwort war nicht OK");
        }
        return response.json();
    })
    .then(daten => {
        // Daten verarbeiten und in der Webseite anzeigen
        const ergebnisseDiv = document.getElementById('Kohlenhydrate');
        daten.forEach(zeile => {
            const p = document.createElement('p');
            p.textContent = `Rezept ID: ${zeile.Rezept_ID}, Kohlenhydrate: ${zeile.Kohlenhydrate}`;
            ergebnisseDiv.appendChild(p);
        });
    })
    .catch(error => {
        console.error("Fehler beim Abrufen der Daten:", error);
    });