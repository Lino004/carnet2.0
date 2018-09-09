<template>
    <div class="album py-5 bg-light">
        <div class="container">
            <div class="row">
                <div class="row">

                    <div :class="clas.container" v-for="event in events" :key="event.id">

                        <div :class="clas.container2">

                            <div :class="clas.containerImg">

                                <img :class="clas.Img" :style="clas.styleImg" :src="event.imageUrl" alt="Card image cap">
                                <div class="card-img-overlay d-flex align-items-start">
                                    <h5 class="w-100 display-10 font-weight-bold p-3 bg-dark text-white">{{ event.titre }}</h5>
                                </div>

                            </div>

                            <div :class="clas.containerInfo">

                                <div v-show="view">
                                    <h2 class="text-info">Commentaire</h2>
                                    <p class="card-text"> {{event.recit}} </p>
                                </div>

                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-sm btn-outline-info" @click.prevent="voir(event)"> {{textBntVoir}} </button>
                                        <button type="button" class="btn btn-sm btn-outline-info">Editter</button>
                                        <button type="button" class="btn btn-sm btn-outline-info" @click.prevent="supp(event)">Suprimer</button>
                                    </div>
                                    <small class="text-muted">Le {{event.date}}</small>
                                </div>

                            </div>

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
            view: false,
            tempEvents: [],
            clas: {
                container: 'col-md-4',
                container2: 'card mb-4 box-shadow shadow-lg border-info',
                containerImg: '',
                Img: 'card-img-top',
                styleImg: 'width: 100%; height: 100%;',
                containerInfo: 'card-body bg-light'
            },
            textBntVoir: 'Voir +'
        }
    },
    computed: {
        eventsDbRef () {
            return db.ref('events/' + this.userId)
        }
    },
    methods: {
        listenerEventAdd () {
            this.eventsDbRef.on('child_added', snap => {
                this.events.push({...snap.val(), id: snap.key})
            })
        },
        listenerEventSupp () {
            this.eventsDbRef.on('child_removed', snapshot => {
                const eventSupp = this.events.find(even => even.id === snapshot.key)
                const index = this.events.indexOf(eventSupp)
                this.events.slice(index, 1)
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
            location.reload()
        },
        voir (e) {
            this.view = !this.view
            if (this.view) {
                this.textBntVoir = 'Voir -'
                this.events = this.events.filter(ev => ev.recit === e.recit)
                this.clas.container = 'row shadow-lg'
                this.clas.container2 = 'row col-md-12'
                this.clas.containerImg = 'col-md-6'
                this.clas.Img = 'mb-4 mt-4'
                this.clas.styleImg = 'width: 100%'
                this.clas.containerInfo = 'col-md-6 pt-3'
            } else {
                this.textBntVoir = 'Voir +'
                this.events = this.tempEvents
                this.clas.container = 'col-md-4'
                this.clas.container2 = 'card mb-4 box-shadow shadow-lg border-info'
                this.clas.containerImg = ''
                this.clas.Img = 'card-img-top'
                this.clas.styleImg = 'width: 100%; height: 100%;'
                this.clas.containerInfo = 'card-body bg-light'
            }
        }
    },
    mounted () {
        this.listenerEventAdd()
        this.listenerEventSupp()
        this.tempEvents = this.events
    },
    beforeDestroy () {
        this.detachListenerEvent()
    }
}
</script>

<style>

</style>
