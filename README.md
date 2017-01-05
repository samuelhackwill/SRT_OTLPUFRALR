# On traversera le code une fois rendus au fichier json

trousse à outils pour transformer des textes (/libs/input.txt) 
en tableaux JSON (/libs/output.json)
en utilisant un parseur un peu modifié (/libs/index.js)
qui d'ailleurs vient [de là](https://www.npmjs.com/package/simple-text-parser2)

à lancer en faisant ça dans le terminal
(il faut avoir [node](https://nodejs.org/en/download/) installé sur sa machine)
(il faut lancer la commande depuis le répertoire /libs)

```
node index.js
```

il va lire input.txt et le zoupper dans un joli tableau un peu chelou.

puis y'a des fonctions javascript qui vont afficher le texte
et faire des trucs intéressants genre faire apparaître des boutons à un moment
x ou alors faire apparaître des items d'une checklist, etc.

##Syntaxe

dans le fichier input.txt, on se sert des retours à la ligne pour séparer les blocs de texte.

```
yo
ça va bien?
```

"yo" sera affiché d'abord, puis on passera à "ça va bien" en appuyant sur la barre espace.

donc ça c'est le texte de base. On peut aussi utiliser des balises : ce sont des lignes d'instructions qui commencent par un dièse #

```
#img orage.jpg
```

les trois premières lettres suivant la balise (ici "img") désignent le type d'action à effectuer : ici, changer l'image de fond du navigateur web. Il existe un certain nombre d'autres types de balises, comme les balises #goto, #addclass, etc.

les autres choses écrites à la suite sont les instructions associées à l'action, ici "orage.jpg", qui est tout simplement le chemin de l'image à charger.

## Toutes les balises
[IMG : Changer l'image de background](#IMG)
[BTN : Ajouter un bouton](#BTN)
[GOTO : Sauter à un endroit du texte](#GOTO)
[BOOKMARK : Un endroit vers lesquel GOTO renvoie](#BOOKMARK)
[FULLSCREEN : Passer en mode plein écran](#FULLSCREEN)
[ADDCLASS : Changer l'aspect d'un truc](#ADDCLASS)

<a name="IMG"/>
## IMG

```
#img orage.jpg
```

<a name="BTN"/>
## BTN

```
#btn assisnon Non,_youpi_tralalou gotobookmark('1pasbienassis') destroy(id)
```
<a name="BOOKMARK"/>
## BOOKMARK

```
#bookmark fin1pasbienassis
```

<a name="GOTO"/>
## GOTO

```
#goto fin1pasbienassis
```
<a name="FULLSCREEN"/>
## FULLSCREEN

```
#fullscreen
```
<a name="ADDCLASS"/>
## ADDCLASS

```
#addclass srtcontainer posbot
```
