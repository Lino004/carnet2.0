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
                <section class="hero is-medium is-bold landing-bg">
                  <div class="hero-body overlay">
                    <div class="container has-text-centered">
                      <h1 class="title">
                        Fast & Effective Video Training for Immunization Professionals      </h1>
                      <h2 class="subtitle">
                        Assess and track the performance of health workers, provide video training on essential immunization skills, or watch short video lessons. Anytime, anywhere and on any device.      </h2>
                      <a href="/learn" class="button is-rounded is-large">Start Learning        <i class="triangle-2"></i>
                      </a>
                    </div>
                  </div>
                </section>
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

export default {
  name: 'acceuil',
  components: {
    ViewEvent,
    NavBarHeader,
    Album
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
