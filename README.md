# Vilse i Tiden

Vilse i Tiden is a speedrun timer for Vilse i Vintergatan. It detects certain
events during the game to automatically start and stop the timer.

## Installation

Download the latest version of Vilse i Tiden: [vilse-i-tiden.zip]. Extract all
the files to a folder and run the program vilse-i-tiden-windows-x64.exe (or a
different one depending on operating system). If Windows Defender appears you
might have to press "More information" and then "Run anyways" to start the
program, as it is not published by Microsoft. After starting the program, open
[http://localhost:8000/layout.html]() in a web browser to start playing.

[vilse-i-tiden.zip]: https://github.com/Herman-L/vilse-i-tiden/releases/download/v0.1.1/vilse-i-tiden.zip

## Usage

Open [http://localhost:8000/layout.html]() in a web browser after starting the
program. The timer starts automatically when "OK" is pressed and ends when the
run is completed. Reload the page to save your times and restart the timer.

To change the category to 100% you need to replace the line
`"segments": "segments_any%.json"` with `"segments": "segments_100%.json"` in
the config.json file. (Right click the file and choose Open with &rarr; Notepad
to edit the file in Windows.)
