VIEW
<template>
    <div class="container" id="main">

        <!-- Option de selection d'un événement -->
        <div class="level" v-show="etatOptionSelect">
            <div class="level-left">
                <a class="button is-info is-outlined is-rounded" 
                    @click="selectionner()"
                    v-show="!etatSelectCheckbox">Selectionner</a>
                <a class="button is-info is-outlined is-rounded" 
                    @click="annulerSelection()" 
                    v-show="etatSelectCheckbox">Annuler</a>
            </div>
            <div class="level-right">
                <a class="button is-info text-white" v-show="etatSelectCheckbox" @click="supps()">Supprimer</a>
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
                            <div class="level">
                                <div class="level-left">
                                    <span class="tag is-info">
                                        {{event.titre}} 
                                    </span>
                                </div>
                                <div class="level-right" v-show="etatSelectCheckbox" >
                                    <b-checkbox v-model="event.selectionner"
                                    type="is-info">
                                    </b-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a class="card-footer-item button is-info is-outlined" 
                            @click="voirPlus(event)">Voir +</a>
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
                                @click="voirMoins()">Voir -</a>
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
            etatOptionSelect: false // Variable d'état de partie selection
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
        supp (e) {
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
        supps () {
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
                        this.supp(ev)
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
