VIEW
<template>
    <div class="container" id="main">

        <!-- Option de selection d'un événement -->
        <div class="level" id='trash' v-show="etatOptionSelect">
            <div class="level-left">
                <a  v-show="etatSelectCheckbox" @click="supprimerPlusieursEvents()"><b-icon icon="check-circle" type="is-info" size="is-medium"></b-icon></a>
            </div>
            
            <div class="level-right" >
                <a  @click="selectionner()"
                    v-show="!etatSelectCheckbox"><b-icon icon="delete" type="is-info" size="is-medium"></b-icon></a>
                   
                <a  @click="annulerSelection()" 
                    v-show="etatSelectCheckbox"><b-icon icon="close-circle" type="is-info" size="is-medium"></b-icon></a>
            </div>
            
        </div>
        <!-- Affichage de tout les événements -->
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
                                <div class="level-left" v-show="!etatSelectCheckbox">
                                    <b-dropdown>
                                       
                                        <b-icon class="has-text-info" 
                                            icon="dots-vertical"
                                            slot="trigger">
                                        </b-icon>
                                        
                                        <b-dropdown-item class="has-text-info"
                                            @click="supprimerUnEvent(event)">
                                            <b-icon icon="delete" size="is-small"></b-icon> 
                                            Supprimer
                                        </b-dropdown-item>
                                        <b-dropdown-item class="has-text-info"
                                            @click="selectionner()">
                                            <b-icon icon="select-inverse" size="is-small"></b-icon> 
                                            Selectionner
                                        </b-dropdown-item>
                                        <b-dropdown-item class="has-text-info">
                                            <b-icon icon="heart" size="is-small"></b-icon> Favori
                                        </b-dropdown-item>
                                    </b-dropdown>
                                </div>
                                <div class="level-left" v-show="etatSelectCheckbox" >
                                    <b-checkbox v-model="event.selectionner"
                                        type="is-info">
                                    </b-checkbox>
                                </div>
                                <div class="level-rigth">
                                    <span class="tag is-info">
                                        {{event.titre}} 
                                    </span>
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
                    <modif-event></modif-event>
                </b-modal>
            </div>
        </transition>
    </div>
</template>

<script>
import {db, storage, auth} from '../firebase'
import ModifEvent from './ModifEvent'

export default {
    name: 'view-event',
    components: {
        ModifEvent
    },
    data () {
        return {
            userId: auth.currentUser.uid, // Récupère Id de l'utilisateur
            events: [], // Tableau receptionnant les informations sur les évenements
            view: false, // Variable d'état des diffirents mode d'affichage
            tempEvents: [], // Variable temporaire
            etatSelectCheckbox: false, // Variable d'état des checkbox
            etatOptionSelect: true, // Variable d'état de partie selection
            fenetreModalEdition: false
        }
    },
    computed: {
        eventsDbRef () {
            return db.ref('events/' + this.userId)
        }
    },
    methods: {
        selectionner () {
            this.etatSelectCheckbox = true
        },
        annulerSelection () {
            this.etatSelectCheckbox = false
            this.events.forEach((ev) => {
                ev.selectionner = false
            })
        },
        listenerEventAdd () {
            this.eventsDbRef.on('child_added', snap => {
                if ( snap.val !== null) {
                    this.etatOptionSelect = true
                }
                this.events.push({...snap.val(), id: snap.key})
            })
        },
        detachListenerEvent () {
            this.eventsDbRef.off()
        },
        supprimer (e) {
            storage.ref().child(e.imageRef).delete().then(() => {
                console.log('supp image success')
            }).catch( (error) => {
                console.log('erreur image :' + error.message)
            })
            this.eventsDbRef.child(e.id).remove().then(() => {
                console.log('supp data success')
            }).catch( (error) => {
                console.log('erreur data :' + error.message)
            })
        },
        miseAJourEvent () {
            this.events.forEach((ev) => {
                this.eventsDbRef.child(ev.id).update({...ev})
            })
        },
        supprimerPlusieursEvents () {
            this.$dialog.confirm({
                title: 'Confirmation',
                message: 'Êtes-vous sûr de vouloir continuer ?',
                cancelText: 'Non',
                confimText: 'Oui',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {
                    this.miseAJourEvent()
                    let e = this.events.filter(ev => ev.selectionner === true)
                    e.forEach((ev) => {
                        this.supprimer(ev)
                    })
                    location.reload()
                }, 
                onCancel: () => {
                    this.events.forEach((ev) => {
                        ev.selectionner = false
                    })
                    this.$toast.open({
                        message: 'Suppression annulée'
                    })
                }
            })
        },
        supprimerUnEvent (event) {
            this.$dialog.confirm({
                title: 'Confirmation',
                message: 'Êtes-vous sûr de vouloir continuer ?',
                cancelText: 'Non',
                confimText: 'Oui',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {
                    event.selectionner = true
                    this.miseAJourEvent()
                    let e = this.events.filter(ev => ev.selectionner === true)
                    e.forEach((ev) => {
                        this.supprimer(ev)
                    })
                    location.reload()
                }, 
                onCancel: () => {
                    this.events.forEach((ev) => {
                        ev.selectionner = false
                    })
                    this.$toast.open({
                        message: 'Suppression annulée'
                    })
                }
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
        this.listenerEventAdd()
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
#main {
    margin-top: 20px;
    
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
