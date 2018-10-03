<template>
    <div>
        <nav-bar-header></nav-bar-header>
        <main id="main" role="main">
          <b-tabs type="is-boxed is-centered" v-model="menuActif">

              <b-tab-item label="Accueil" icon="google-photos">
                <view-event></view-event>
              </b-tab-item>

              <b-tab-item label="Albums" icon="image-filter">
                <album ></album>
              </b-tab-item>

              <b-tab-item label="Favoris" icon="heart">
                <backoundinitial></backoundinitial>
              </b-tab-item>

              <b-tab-item label="Destination" icon="airplane">
                <album ></album>
              </b-tab-item>

          </b-tabs>
        </main>
    </div>
</template>

<script>
import ViewEvent from './ViewEvent'
import NavBarHeader from './NavBarHeader'
import Album from './albums/Album'
import BackoundInitial from './Backoundinitial'

export default {
  name: 'acceuil',
  components: {
    ViewEvent,
    NavBarHeader,
    Album,
    BackoundInitial
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
.hero.is-medium.landing-bg {
    background-repeat: no-repeat;
    background: url('https://www.immunizationacademy.com/img/hero_landing.jpg') center center;
    background-size: cover;
}
</style>
