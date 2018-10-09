<template>
    <div>
        <nav-bar-header></nav-bar-header>
        <background-initial v-show="!eventsExist"></background-initial>
        <main v-show="eventsExist">
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
import ViewEvent from './viewEvent/ViewEvent'
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
      userId: auth.currentUser.uid,
      events: []
    }
  },
  computed: {
      eventsDbRef () {
          return db.ref('events/' + this.userId)
      },
      eventsExist () {
          if (this.events.length > 0) {
              return true
          }else{
              return false
          }
      }
  },
  methods: {
    listenerEventAdd () {
        this.eventsDbRef.on('child_added', snap => {
            this.events.push({...snap.val()})
        })
    },
    listenerEventSupp () {
        this.eventsDbRef.on('child_removed', snap => {
            const deleteEvent = this.events.find(ev => ev.id === snap.key)
            const index = this.events.indexOf(deleteEvent)
            this.events.splice(index, 1)
        })
    },
    listenerEventChange () {
        this.eventsDbRef.on('child_changed', snap => {
            const deleteEvent = this.events.find(ev => ev.id === snap.key)
            const index = this.events.indexOf(deleteEvent)
            this.events.splice(index, 1)
            this.events.splice(index, 0, {...snap.val()})
        })
    },
    detachListenerEvent () {
        this.eventsDbRef.off()
    }
  },
  mounted () {
    this.listenerEventAdd()
    this.listenerEventSupp()
    this.listenerEventChange()
  },
  beforeDestroy () {
    this.detachListenerEvent()
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
