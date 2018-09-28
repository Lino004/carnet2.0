<template>
    <div>
        <nav-bar-header></nav-bar-header>
        <main id="main" role="main">
          <view-event v-if="condition"></view-event>
          <album v-else></album>
        </main>
    </div>
</template>

<script>
import ViewEvent from './ViewEvent'
import NavBarHeader from './NavBarHeader'
import Album from './Album'

export default {
  name: 'acceuil',
  components: {
    ViewEvent,
    NavBarHeader,
    Album
  },
  data () {
    return {
      condition: true
    }
  }
}
</script>

<style src="../style/fonts/font-awesome-4.7.0/css/font-awesome.min.css"></style>
