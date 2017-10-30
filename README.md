# [Conway's Game of Life](https://zelite.github.io/game-of-life)
_von Zelite_

## Systemanforderung

Um das Programm zu Starten brauchen Sie einen modernen Web-Browser, wie z.B. Google Chrome. Das Programm benutzt die Canvas API, das in jedem modernen Web-Browser verfügbar sein sollte. 

## Installation und Aufrufen

Das Programm braucht keine besondere Installation. Entpacken Sie einfach die Zip-Datei und öffnen Sie die `dist/index.html` Datei in Ihrem Web-Browser.

## Gebrauchsanweisung

* __Board dimensions__ - Bei Programmstart können Sie in den __Board Dimensions__ die Größe des Gameboards definieren. Beim Speichern (__Save__) dieser Einstellungen, wird ein neues Board mit der neuen Größe und randomisiertem Zellenstatus erstellt.

* __Start und Stop animation__ - Mit dem __Start__ und __Stop__ Button, können Sie die Game Of Life Animation starten und stoppen.

* __Clear the board__ - Stellen Sie alle Zellen in den tot Status.

* __Randomize__ - alle Zellen Status werden neu randomisiert.

* __Klicken__ - Bei klicken in ein Zellenfeld, können Sie den Status von jeder Zelle ändern.



## Quellcode

Das Programm ist in Typescript programmiert. Der Quellcode findet sich der `src/` ordner. Die Hauptdatei ist die `Drawing.ts` Datei. Um die Typescriptquelle in die Javascript Datei zu kompilieren brauchen Sie den Typescript Compiler: http://www.typescriptlang.org/#download-links
