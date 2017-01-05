# On traversera le code une fois rendus au fichier json
# (WIP)

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
[IMG : Changer l'image de background](#IMG)<br>
[BTN : Ajouter un bouton](#BTN)<br>
[GOTO : Sauter à un endroit du texte](#GOTO)<br>
[BOOKMARK : Un endroit vers lesquel GOTO renvoie](#BOOKMARK)<br>
[FULLSCREEN : Passer en mode plein écran](#FULLSCREEN)<br>
[ADDCLASS : Changer l'aspect d'un truc](#ADDCLASS)<br>

<a name="IMG"/>
#### IMG

```
#img orage.jpg
```
IMG reçoit **un seul argument** : le chemin de l'image à aller chercher. 
/!\ à l'heure actuelle, il faut placer toutes les images dans le dossier /img (c'est là où le script va les chercher). Donc là par exemple le script va tenter de charger /img/orage.jpg. Pas de possibilité de rentrer un chemin absolu dans cette version du truc.

<a name="BTN"/>
#### BTN

```
#btn assisnon Non,_youpi_tralalou gotobookmark('1pasbienassis') destroy(id)
```

BTN reçoit **au moins 3 arguments** : le premier est le numéro d'identification (id) du boutton ("assisnon"). Trouvez un nom bien parlant et unique. 

Le second est son libellé, c'est à dire ce qui va s'afficher à l'écran ("Non,_youpi_tralalou") /!\ attention, si vous voulez écrire une phrase, comme dans le cas présent, il ne faut pas utiliser d'espaces mais des underscores (aka le tiret du bas) qui seront remplacés par des espaces par le script. Ben oui parce que en fait on se sert des espaces pour séparer les instructions tu vois alors si on met un espace au milieu d'une instruction ça pète tout

Et ensuite, tous les autres trucs écrits à la suite ce sont les fonctions lancées quant on clique sur le bouton. ici ("gotobookmark('1pasbienassis')" et "destroy(id)") On peut mettre autant de fonctions que l'on veut. 

euh alors tiens destroy(id), c'est une fonction qui fait disparaître tous les boutons quand on clique sur un d'entre eux. Pas mal utile

<a name="BOOKMARK"/>
#### BOOKMARK

```
#bookmark fin1pasbienassis
```
Bookmark c'est simple, c'est une sorte d'emplacement invisible vers lequel on peut sauter quand on veut. Il prend **un seul argument**, son nom (ici "fin1pasbienassis").

<a name="GOTO"/>
#### GOTO

```
#goto fin1pasbienassis
```
Goto renvoie vers un bookmark. Il prend **un seul argument**, la cible du bookmark vers lequel il renvoie (ici, "fin1pasbienassis").

<a name="FULLSCREEN"/>
#### FULLSCREEN

```
#fullscreen
```
Fullscreen active le mode plein écran du navigateur. Il ne prend pas d'argument.

<a name="ADDCLASS"/>
#### ADDCLASS

```
#addclass srtcontainer posbot
```
Addclass prend **deux arguments**. Le premier (ici "srtcontainer"), c'est le nom de l'élément auquel on va associer une classe CSS. Le second, (ici "posbot") c'est le nom de cette classe CSS.