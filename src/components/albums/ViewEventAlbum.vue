<template>
    <div class="container" id="main">
        
       <transition-group name="list" class="columns is-multiline" v-show="!view">
            <div class="column is-one-fifth-desktop is-half-tablet is-mobile" 
                v-for="event in events" :key="event.id">
                <div class="card">
                    <div class="card-image is-flex is-horizontal-center">
                        <figure>
                            <img class="img-view1" :src="event.imageUrl" alt="">
                        </figure>
                        <div class="is-overlay is-clipped" style="margin: 10px">
                            <div class="level is-flex-mobile">
                                <div class="level-rigth">
                                    <a @click="voirPlus(event)">
                                        <b-icon icon="eye-plus-outline" type="is-info"></b-icon>
                                    </a>
                                </div>
                                <div class="level-left" v-show="etatSelectCheckbox">
                                    <b-checkbox v-model="event.selectionner"
                                        type="is-info">
                                    </b-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <span class="card-footer-item title is-5 is-outlined">{{event.titre}}</span>
                    </footer>
                </div>

                <!-- Affichage de l'événement choisi -->
                <b-modal :active.sync="isImageModalActive" has-modal-card>
                    <apercu :event="eventActu" :eventsDbRef="eventsAlbumDbRef"></apercu>
                </b-modal>
            </div>
        </transition-group>
    </div>
</template>

<script>
import {db, storage, auth} from '../../firebase'
import Apercu from '../viewEvent/Apercu'

export default {
    name: "view-event-album",
    components: { Apercu },
    data () {
        return {
            userId: auth.currentUser.uid,
            events: [],
            view: false, // Variable d'état des diffirents mode d'affichage
            etatSelectCheckbox: false,
            fenetreModalEdition: false,
            isImageModalActive: false,
            eventActu: [],
            test: []
        }
    },
    props: ['album'],
    computed: {
        eventsAlbumDbRef () {
            return db.ref('eventsAlbums/' + this.userId + '/' + this.album.id)
        }
    },
    methods: {
        listenerEventAdd () {
            this.eventsAlbumDbRef.on('child_added', snap => {
                this.events.push({...snap.val()})
            })
        },
        listenerEventSupp () {
            this.eventsAlbumDbRef.on('child_removed', snap => {
                const deleteEvent = this.events.find(ev => ev.id === snap.key)
                const index = this.events.indexOf(deleteEvent)
                this.events.splice(index, 1)
            })
        },
        listenerEventChange () {
            this.eventsAlbumDbRef.on('child_changed', snap => {
                const detectEvent = this.events.find(ev => ev.id === snap.key)
                const index = this.events.indexOf(detectEvent)
                this.events.splice(index, 1)
                this.events.splice(index, 0, {...snap.val()})
            })
        },
        detachListenerEvent () {
            this.eventsAlbumDbRef.off()
        },
        testExiste (t) {
            let al = t.albums
            console.log('al = ' + al)
        },
        testT () {
            let existe = this.test.some(this.testExiste())
            console.log('exi = ', existe)
        },
        voirPlus (e) {
            this.isImageModalActive = true
            this.eventActu = e
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

<style scoped>
.img-view1 {
	height: 150px;
}
.is-horizontal-center {
    justify-content: center;
}
#trash{
    position: fixed;
    z-index: 1;
    left:10px;
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
</style>
