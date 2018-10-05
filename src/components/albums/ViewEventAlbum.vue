<template>
    <div class="container" id="main">
        <transition-group name="list" class="columns is-multiline" v-show="!view">
            <div class="column is-one-third-desktop is-half-tablet" 
                v-for="event in events" :key="event.id">
                <div class="card">
                    <div class="card-image is-flex is-horizontal-center">
                        <figure>
                            <img class="img-view1" :src="event.imageUrl" alt="">
                        </figure>
                        <div class="card-content is-overlay is-clipped">
                            <div class="level is-flex-mobile">
                                <div class="level-rigth">
                                    <span class="tag is-info">
                                        {{event.titre}} 
                                    </span>
                                </div>
                                <div class="level-left" v-show="etatSelectCheckbox" >
                                    <b-checkbox v-model="event.selectionner"
                                        type="is-info">
                                    </b-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a class="card-footer-item button is-info is-outlined" 
                            @click="voirPlus(event)">Voir &nbsp;
                            <b-icon icon="plus"></b-icon>
                        </a>
                    </footer>
                </div>
            </div>
        </transition-group>

        <!-- Affichage de l'événement choisi -->
        <transition name="bounce">        
            <div class="box" v-for="event in events" :key="event.id" v-show="view">
                <div class="tile is-ancestor">
                    <div class="tile is-parent">
                        <div class="tile is-child">
                            <img :src="event.imageUrl" alt="">
                        </div>
                    </div>
                    <div class="tile is-4 is-vertical is-parent">
                        <div class="tile is-parent is-vertical box">
                            <div class="tile is-child">
                                <p class="title">{{event.titre}}</p>
                                <div id="over">
                                    <p> {{event.recit}} </p>
                                </div>
                            </div>
                            <div class="tile is-child">
                                <span class="tag is-white">Le {{event.date}} à {{event.lieu}}</span>
                            </div>
                        </div>
                        <div class="tile is-parent">
                            <div class="tile is-child">
                                <a class="card-footer-item button is-info is-outlined" 
                                    @click="voirMoins()">Voir &nbsp;
                                    <b-icon icon="window-minimize"></b-icon>
                                </a>
                            </div>
                            <div class="tile is-child">
                                <a class="card-footer-item button is-info is-outlined" 
                                    @click="fenetreModalEdition = true">Editer
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modification de l'Événement -->
                <b-modal :active.sync="fenetreModalEdition" has-modal-card>
                    <modif-event :event="event" ></modif-event>
                </b-modal>
            </div>
        </transition>
    </div>
</template>

<script>
import {db, storage, auth} from '../../firebase'
import ModifEvent from '../ModifEvent'

export default {
    name: "view-event-album",
    components: { ModifEvent },
    data () {
        return {
            userId: auth.currentUser.uid,
            events: [],
            view: false, // Variable d'état des diffirents mode d'affichage
            tempEvents: [], // Variable temporaire
            etatSelectCheckbox: false,
            etatOptionSelect: true, // Variable d'état de partie selection
            fenetreModalEdition: false
        }
    },
    props: ['album'],
    computed: {
        eventsAlbumDbRef () {
            return db.ref('eventsAlbums/' + this.album.id)
        }
    },
    methods: {
        detachListenerEvent () {
            this.eventsAlbumDbRef.off()
        },
        listenerEvents () {
            this.eventsAlbumDbRef.on('child_added', snap => {
                this.events.push({...snap.val(), id: snap.key})
            })
        },
        voirPlus (e) {
            this.etatOptionSelect = false
            this.view = !this.view
            this.events = this.events.filter(ev => ev.id === e.id)
        },
        voirMoins () {
            this.etatOptionSelect = true
            this.view = !this.view
            this.events = this.tempEvents
        }
    },
    mounted () {
        this.listenerEvents()
        this.tempEvents = this.events
    },
    beforeDestroy () {
        this.detachListenerEvent()
    }
}
</script>

<style scoped>
.img-view1 {
	height:300px;
}
.is-horizontal-center {
    justify-content: center;
}
#trash{
    position: fixed;
    z-index: 1;
    left:10px;
}
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
#over{
    height: 300px;
    overflow: auto;
}

</style>
