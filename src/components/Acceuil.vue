<template>
    <div>
        <nav-bar-header></nav-bar-header>
        <background-initial v-show="!etat"></background-initial>
        <main id="main" role="main" v-show="etat">
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
import {db, auth} from '../firebase'
import ViewEvent from './ViewEvent'
import Favoris from './Favoris'
import NavBarHeader from './NavBarHeader'
import Album from './albums/Album'
import BackgroundInitial from './BackgroundInitial'

export default {
  name: 'acceuil',
  components: {
    ViewEvent,
    NavBarHeader,
    Album,
    Favoris,
    BackgroundInitial
  },
  data () {
    return {
      menuActif: 0,
      condition: true,
      etat: false,
      userId: auth.currentUser.uid
    }
  },
  computed: {
      eventsDbRef () {
          return db.ref('events/' + this.userId)
      }
  },
  methods: {
    listenerEventAdd () {
        this.eventsDbRef.on('child_added', snap => {
            if ( snap.val !== null) {
                this.etat = true
            }
        })
    },
  },
  mounted () {
    this.listenerEventAdd()
  }
}
</script>

<style src="../style/fonts/font-awesome-4.7.0/css/font-awesome.min.css"></style>
<style>
.hero.is-small.landing-bg {
    background-repeat: no-repeat;
    background: url('https://www.immunizationacademy.com/img/hero_landing.jpg') center center;
    background-size: cover;
}
</style>
