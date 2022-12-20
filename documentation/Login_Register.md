# Login / Registration
Github Issue #20 \
https://github.com/LucHauser/ThunderBoost/issues/20

## Story
Als Benutzer möchte ich bei Thunderboost als existierende Kunde einloggen oder als neuer Kunde registrieren.

## Dokumentation

Auf der Navigationsleiste befindet sich eine Profilschaltfläche, welche man zur Login-Page gelangt. Auf der Login-Seite
kann man sich als existierende Benutzer einloggen oder als neuer Kunde registrieren. Beim Einloggen braucht man nur das Email und das Passwort.
Bei der Registrierung muss der Besucher Daten wie Anrede, Name, Vorname, Email, Benutzername und ein Passwort eingeben. Um die Registrierung abzuschliessen,
muss der Benutzer die Terms akzeptieren. Nach der erfolgreichen Anmeldung oder Registrierung wird eine Sitzung gestartet und auf der Localstorage wird der Token gespeichert.

## Testing

Folgende Punkten sollen getestet werden
* Einloggen mit der existierenden Benutzer-E-Mail & Passwort
* Registrierung als neuer Benutzer
* Gültigkeitsüberprüfung Eingabefelder
* Darstellung in Desktopansicht und in mobile Ansicht.
* Errormeldung bei Registrierung mit einer existierenden E-Mail und Username

---

### T-01 - Einloggen mit existierende Email-Adresse

#### Beschreibung
Es soll getestet werden, ob der Benutzer im Thunderboost einloggen kann. Damit man definitiv eingeloggt ist,
bekommt man einen Token, welche die Sitzung läuft.

#### Dokumentation
Auf der Navigationsleiste befindet sich eine Profilschaltfläche, welche man zur Login-Page gelangt. Auf der Login-Seite
kann man sich als existierende Benutzer einloggen oder als neuer Kunde registrieren.
Das Login-Formular ist einfach aufgebaut. Im Login-Formular implementierte ich zwei Eingabefelder für das E-Mail und Passwort und einen
Knopf, um das Login auszulösen. Nachdem man das E-Mail und das Passwort eingegeben hat. Macht es einen POST-Request auf den JSON-Server und
schaut, ob das E-Mail existiert und gehashte Passwort aus der Eingabe mit dem gehashten Passwort der E-Mail übereinstimmt. Stimmt es überein? , dann
startet die Applikation eine Sitzung und generiert einen Token, welche in der Localstorage zusammen mit Benutzerdaten gespeichert werden.
Das Login-Formular verfasste ich in einer Component, welche als Tag aufrufbar ist.

#### Testing & Schritt

1. Navigieren Sie zur Login-Seite von dem Profil-Icon-Button aus oder über http://localhost:3000/login
2. Das linke Eingabeformular mit den zwei Eingabefelder ist das Login-Formular.
3. Geben Sie anschliessend bei Email <b>admin@admin.ch</b> ein und das Passwort: <b>adminadmin</b>
4. Klicken Sie danach auf den Login-Button. Beim Auslösen werden Sie automatisch auf die Landingpage geleitet!
5. Öffnen Sie das DevTool von Browser und navigieren Sie zur App.
6. Auf dem Seitenmenü sehen Sie das Wort "Speicher" mit dem lokalen Speicher, Sitzungsspeicher Cookies, usw. Klappen sie den Lokaler Speicher und öffnen sie das http://localhost:3000...
7. In dieser Speicher befindet sich den Key mit der Name "session". Wert sollte so aussehen:<br><i>{"accessToken":"..."}</i>
---

### T-02 - Registrierung als neuer Kunde

#### Beschreibung
Es soll getestet, ob der neue Kunde auf Thunderboost registrieren kann. Er soll nach der Abschluss von Registration 
direkt mit der neue Account eingeloggt sein und einen Token haben

#### Dokumentation
Auf der Navigationsleiste befindet sich eine Profilschaltfläche, welche man zur Login-Page gelangt. Auf der Login-Seite
kann man neben dem Einloggen auch als neuer Kunde registrieren.
Das Registrierungsformular ist länger aufbaut als das Login-Formular. Ich implementierte 6 Eingabefelder, sowie ein Dropdown für die Auswahl von Anrede
Im Formular muss der Neukunde seine Anrede, Vorname, Nachname, E-Mail-Adresse, Benutzername und das Passwort eingeben/auswählen.
Für die sicherstellung von Passwort muss der Benutzer das Passwort wiederholt eingeben. Damit die Registrierung ausgeführt werden kann, muss der Neukunde
die Terms akzeptieren.
Während der Registrierungsprozess wird der neue Benutzer in JSON-Server gespeichert. Bei der Benutzerdaten wird noch die Rolle-ID und das Registrierdatum eingefügt. 
Direkt nach dem Speichern loggt die Applikation automatisch mit der neuen E-Mail und dem Passwort des Benutzers, ohne nochmals eingeben müssen. Die Sitzung wird gestartet.

#### Testing & Schritt

1. Navigieren Sie zur Login-Seite von dem Profil-Icon-Button aus oder über http://localhost:3000/login
2. Das rechte Eingabeformular welche länger ist als das Login-Formular ist das Registrierung-Formular.
3. Geben Sie in alle Eingabefelder zum Beispiel ihre Personalien, E-Mail, etc ein und akzeptieren Sie die Terms
4. Klicken anschliessend auf den Knopf, um die Registrierung auszuführen. Sie werden automatisch zur Startseite geleitet.
5. Kontrollieren Sie im DevTool, ob der accessToken im App > Speicherverbrauch gespeichert ist (Siehe T-01 6. Schritt von Testing)
6. Gehen Sie anschliessend zur Profilseite von Navigation aus oder über http://localhost:3000/profile
7. Kontrollieren Sie, ob die Daten stimmen. Auch ob das Datum der Registrierung angezeigt wird.

---

### T-03 - Gültigkeitsüberprüfung Eingabefelder

#### Beschreibung

Die Eingaben im Formular müssen vor dem Ausführen validiert werden. Es soll getestet, dass die Errors bei leeren Pflichtfelder, sowie bei falsche Eingaben
überprüft werden.

#### Dokumentation

Beim Submit des Formular werden die Werte aus der Eingaben überprüft und nach Bedarf einen Errortext gesetzt, wenn sie nicht stimmen oder falsch sind. Der Errortext wird unten von
Eingabefeld angezeigt. Bis keine Errortexte angezeigt wird, dann sind alle Eingaben gültig. Beim Login, wenn das Passwort nicht stimmt, dann erscheint eine Errormitteilung unterhalb des Titels.
Bei der Registrierung erfolgt das gleiche wie bei Login. Dadurch wird der Errormitteilung erst angezeigt, wenn man die Terms nicht akzeptiert.

#### Testing & Schritte

1. Geben beim Login das E-Mail ohne @-Charakter ein - Error: Invalid E-Mail
2. Geben Sie nun folgendes bei der E-Mail ein: <b>admin@admin.ch</b>
3. Führen Sie das Login durch. Eine Errormeldung vom Passwort sagt, dass das Passwort erforderlich ist.
4. Geben Sie ein falsches Passwort gegenüber <b>adminadmin</b> ein - Errormessage wird angezeigt.
5. Lassen Sie mal das Einloggen aus und führen Sie die Registrierung durch. Es sind alle Errormeldungen zu sehen.
6. Füllen Sie das Registrierungsformular ausser das Passwort wiederholen aus.
7. Geben Sie beim Passwort wiederholen ein falsches Passwort ein. Das falsche wiederholte Passwort soll überprüfen, ob das oberstehende Passwortfeld gleich sind. Error - <i>The repeated password does not match</i>
8. Geben nun das wiederholte Passwort korrekt und führen Sie die Registration aus ohne Terms zu akzeptieren. Es sollte einen Errormessage zu oberst der Registrierung angezeigt werden.

---

### T-04 - Darstellung in der Desktopansicht und in der Mobile Ansicht

Die Login Page soll auf der Deskop- sowie in der Mobile-Ansicht bedienungsfreundlich sein. Es soll getestet werden, ob die Responsive Seite gut ersichtlich
ist und nach Vorgaben entsprechen

#### Beschreibung



#### Dokumentation

#### Testing & Schritte

## Testprotokoll

| Tasks | Funktioniert | Bemerkung | Testperson | Erledigt                 |
|-------|--------------|-----------|------------|--------------------------|
| T-01  |              |           |            | <input type="checkbox"/> |

Cross for done: &cross;