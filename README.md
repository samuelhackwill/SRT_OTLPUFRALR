## Generateur de texte interactif ##
*On traversera le code une fois rendus au fichier json*

trousse à outils pour transformer des textes (/libs/input.txt) 
en tableaux JSON (/libs/output.json)
en utilisant un parseur un peu modifié (/libs/index.js)
qui d'ailleurs vient d'ici (https://www.npmjs.com/package/simple-text-parser2)

à lancer en faisant ça dans le terminal
(il faut avoir node installé sur sa machine https://nodejs.org/en/download/)
(il faut lancer la commande depuis le répertoire /libs)

```bash
node index.js
```

il va lire input.txt et le zoupper dans un joli tableau un peu chelou.

puis y'a des fonctions javascript qui vont afficher le texte
et faire des trucs intéressants genre faire apparaître des boutons à un moment
x ou alors faire apparaître des items d'une checklist, etc.

*Syntaxe à utiliser dans le fichier input.txt*
