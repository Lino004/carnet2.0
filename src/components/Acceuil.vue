<template>
    <div>
        <nav-bar-header></nav-bar-header>
        <main>
          <b-tabs type="is-boxed is-centered" v-model="menuActif">

              <b-tab-item label="Accueil" icon="google-photos">
                <view-event></view-event>
              </b-tab-item>

              <b-tab-item label="Albums" icon="image-filter">
                <album ></album>
              </b-tab-item>

              <b-tab-item label="Favoris" icon="heart">
                <favoris></favoris>
              </b-tab-item>

          </b-tabs>
        </main>
    </div>
</template>

<script>
import ViewEvent from './ViewEvent'
import Favoris from './Favoris'
import NavBarHeader from './NavBarHeader'
import Album from './albums/Album'

export default {
  name: 'acceuil',
  components: {
    ViewEvent,
    NavBarHeader,
    Album,
    Favoris
  },
  data () {
    return {
      menuActif: 0,
      condition: true
    }
  }
}
</script>

<style src="../style/fonts/font-awesome-4.7.0/css/font-awesome.min.css"></style>
<style>

</style>
