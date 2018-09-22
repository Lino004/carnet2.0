<template>
    <div class="container" id="main">
        
        <!-- Option de selection d'un événement -->
        <div class="level" v-show="etatOptionSelect">
            <div class="level-left">
                <a class="button is-info is-outlined is-rounded" 
                    @click="annulerSelection()" 
                    v-show="etatSelectCheckbox">Annuler
                </a>
            </div>
            <div class="level-right">
                <a class="button is-info text-white" 
                    v-show="etatSelectCheckbox" 
                    @click="supprimerPlusieursEvents()">Supprimer
                </a>
            </div>
        </div>

        <!-- Affichage de tout les événements -->
        <div class="columns is-multiline" v-show="!view">
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
                                        <button class="button" slot="trigger">
                                            <b-icon class="has-text-info" 
                                                icon="dots-vertical-circle">
                                            </b-icon>
                                        </button>
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
        </div>

        <!-- Affichage de l'événement choisi -->
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
                            <p> {{event.recit}} </p>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {db, storage, auth} from '../firebase'

export default {
    name: 'view-event',
    data () {
        return {
            userId: auth.currentUser.uid, // Récupère Id de l'utilisateur
            events: [], // Tableau receptionnant les informations sur les évenements
            view: false, // Variable d'état des diffirents mode d'affichage
            tempEvents: [], // Variable temporaire
            etatSelectCheckbox: false, // Variable d'état des checkbox
            etatOptionSelect: true // Variable d'état de partie selection
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
</style>
