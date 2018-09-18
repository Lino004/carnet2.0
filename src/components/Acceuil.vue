<template>
    <div>
          <nav-bar-header></nav-bar-header>
          <main role="main">

              <new-event class="modal fade" id="addModal"></new-event>
              <view-event></view-event>
              <mon-compte></mon-compte>

          </main>
    </div>
</template>

<script>
import NewEvent from './NewEvent'
import ViewEvent from './ViewEvent'
import NavBarHeader from './NavBarHeader'
import MonCompte from './MonCompte'
export default {
  name: 'acceuil',
  components: {
    NewEvent,
    ViewEvent,
    NavBarHeader,
    MonCompte
  }
}
</script>

<style src="../style/fonts/font-awesome-4.7.0/css/font-awesome.min.css"></style>
