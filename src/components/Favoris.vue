<template>
    <div class="container" id="main">

        <!-- Option de suppression d'un événement -->
        <div class="level column" id='trash' v-show="etatOptionSelect">
            <div class="level-left">
                <a  v-show="etatSelectCheckbox" @click="supprimerPlusieursEvents()">
                    <b-icon icon="check-circle" type="is-info" size="is-medium"></b-icon>
                </a>
            </div>
            
            <div class="level-right" >
                <a  @click="selectionner()"
                    v-show="!etatSelectCheckbox">
                    <b-icon icon="delete" type="is-info" size="is-medium"></b-icon>
                </a>
                   
                <a  @click="annulerSelection()" 
                    v-show="etatSelectCheckbox">
                    <b-icon icon="close-circle" type="is-info" size="is-medium"></b-icon>
                </a>
            </div>
            
        </div>
        <!-- Affichage de tout les événements -->
        <transition-group name="list" class="columns is-multiline" v-show="!view">
            <div class="column is-one-fifth-desktop is-half-tablet is-mobile" 
                v-for="(event, index) in events" :key="index">
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
                                <div class="level-right is-flex-mobile">
                                    <div v-show="!event.favori && !etatSelectCheckbox">
                                        <a @click.prevent="favoris(event)">
                                            <b-icon icon="heart-outline" type="is-grey"></b-icon>
                                        </a>
                                    </div>
                                    <div v-show="event.favori && !etatSelectCheckbox">
                                        <a @click.prevent="favoris(event)">
                                            <b-icon icon="heart" type="is-danger"></b-icon>
                                        </a>
                                    </div>
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
                    <apercu :event="eventActu" :eventsDbRef="eventsDbRef"></apercu>
                </b-modal>
            </div>
        </transition-group>
    </div>
</template>

<script>
import {db, storage, auth} from '../firebase'
import Apercu from './viewEvent/Apercu'

export default {
    name: 'favoris',
    components: {
        Apercu
    },
    data () {
        return {
            userId: auth.currentUser.uid, // Récupère Id de l'utilisateur
            events: [], // Tableau receptionnant les informations sur les évenements
            tempEvents: [],
            view: false, // Variable d'état des diffirents mode d'affichage
            etatSelectCheckbox: false, // Variable d'état des checkbox
            etatOptionSelect: true, // Variable d'état de partie selection
            fenetreModalEdition: false,
            isImageModalActive: false,
            eventActu: []
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
                this.tempEvents.push({...snap.val()})
                this.events = this.tempEvents.filter(ev => ev.favori === true)
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
                console.log('valBoolFavo = ' + snap.val().favori)
                const existe = this.events.some(ev => ev.id === snap.key )
                if (existe){
                    if (snap.val().favori){
                        const detectEvent = this.events.find(ev => ev.id === snap.key)
                        const index = this.events.indexOf(detectEvent)
                        this.events.splice(index, 1)
                        this.events.splice(index, 0, {...snap.val()})
                    }else{
                        const deleteEvent = this.events.find(ev => ev.id === snap.key)
                        const index = this.events.indexOf(deleteEvent)
                        this.events.splice(index, 1)
                    }
                }else{
                    if (snap.val().favori){
                        this.events.push({...snap.val()})
                    }
                }
            })
        },
        detachListenerEvent () {
            this.eventsDbRef.off()
        },
        supprimer (e) {
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
        favoris (event)  {
            event.favori = !event.favori
            this.eventsDbRef.child(event.id).update({favori: event.favori})
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
                    this.etatSelectCheckbox = false
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
