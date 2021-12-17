# AMITRAD (0.0.1 ALPHA)

## INSTALLATION

clone this repo locally

`git clone -b surtitrage https://github.com/samuelhackwill/SRT_OTLPUFRALR/`

to launch the app, navigate to folder

`cd SRT_OTLPUFRALR`

and launch meteor locally

`NODE_TLS_REJECT_UNAUTHORIZED=0 meteor`

## INITIALIZATION

open a data view by navigating to localhost:3000/data

then paste your text, or the initialization text, in the window.

```
***
%%% THIS IS A COMMENT
%%% BEWARE : ABSOLUTELY RESPECT THIS STYLE OR EVERYTHING WILL BREAK
#FR_SALM TEST OK (will not be displayed)
#NL_SALM TEST OK (will not be displayed)
#EN_SALM TEST OK (will not be displayed)
#DE_SALM TEST OK (will not be displayed)
***
#FR_SALM c'est la première ligne
#NL_SALM dat 1 linie
#EN_SALM this is the first line
#DE_SALM das ist die erste linie.
***
#FR_SALM deuxième ligne de texte
#NL_SALM dat 2 linie
#EN_SALM second line
#DE_SALM das ist die zweite linie.
***
#FR_SALM dernière ligne de texte.
#NL_SALM dat 3 linie
#EN_SALM last line
#DE_SALM das ist die jedes linie.
***
```

then press "Mouline !"
and "Enregistre ça".

if there's a lot of text, it can take some time (a few seconds). If everything went fine, you should see data appearing in the lower part of the page (scroll if necessary).

## USAGE

open an admin view by navigating to localhost:3000/admin
open a subtitling view by navigating to localhost:3000

chose your language in the subtitling view 