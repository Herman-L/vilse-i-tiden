# Vilse i Tiden

Vilse i Tiden är en speedruntimer till Vilse i Vintergatan som känner av olika
händelser i spelet för att automatiskt starta och stoppa timern.

## Installation

Ladda ner den senaste versionen av vilse i tiden: [vilse-i-tiden.zip]. Extrahera
alla filer till en mapp och kör programmet vilse-i-tiden-windows-x64.exe (eller
någon annan beroende på operativsystem). Om Windows Defender dyker upp behöver
du klicka på "Mer information" och sedan "Kör ändå" i Windows för att starta
programmet, då det inte är utgivet av Microsoft. Öppna sedan
[http://localhost:8000/layout.html]() i din webbläsare för att börja spela.

[vilse-i-tiden.zip]: https://github.com/Herman-L/vilse-i-tiden/releases/download/v0.1.0/vilse-i-tiden.zip

## Instruktioner

Öppna [http://localhost:8000/layout.html]() i din webbläsare efter att ha
startat programmet för att ta fram timern. Starta om timern genom att ladda om
sidan. Dina tider sparas automatiskt när timern startar om.

För att ändra kategori till 100% är det bara att byta ut raden
`"segments": "segments_any%.json"` mot `"segments": "segments_100%.json"` i
filen config.json. (Högerklicka på filen och välj Öppna med &rarr; Anteckningar
för att ändra filen i Windows.)
