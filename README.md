# carnet2.0

> Un projet fait en Vue js dont le principe est de permettre à l'utilisateur de pouvoir éditer, enregistrer, sauvegarder ou supprimer les événements importants de ses différents voyages.

## Près requis pour déployer le projet sur votre machine

``` bash
Node.js (> = 6.x, 8.x préféré), npm version 3+ et Git
```
## Configuration de la construction

``` bash
# intaller les dépendances
npm install
npm install --save vue-router
npm install --save vuefire
npm install --save firebase

# utiliser cette commande pour accéder au seveur de développement localhost:8080
npm run dev

# construire les fichirs pour la production avec minification
npm run build

# construire les fichiers pour la production et afficher le rapport de l'analyseur de lots
npm run build --report
```

Pour une explication détaillée du fonctionnement, consultez le [guide](http://vuejs-templates.github.io/webpack/) et [la documentation de vue-loader](http://vuejs.github.io/vue-loader).
