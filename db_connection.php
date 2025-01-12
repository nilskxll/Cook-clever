<?php
$dsn = 'mysql:host=database-5016834764.webspace-host.com;dbname=dbs13597122';
$benutzername = 'dbu813693';
$passwort = 'v!9JBj4^JAcLFTvO';

try {
$dbh = new PDO($dsn, $benutzername, $passwort);
echo "Verbindung zur Datenbank hergestellt.";
} catch (PDOException $e) {
die("Fehler bei der Verbindung zur Datenbank: " . $e->getMessage());
}
?>