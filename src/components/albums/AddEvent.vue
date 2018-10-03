<template>
    <div class="modal-card">
        <header class="modal-card-head">

        </header>
        <section class="modal-card-body">
            <div class="columns is-multiline">
                <div class="column is-one-third-desktop is-half-tablet" 
                    v-for="event in events" :key="event.id">
                    <div class="card">
                        <div class="card-image is-flex is-horizontal-center">
                            <figure>
                                <img class="img-view1" :src="event.imageUrl" alt="">
                            </figure>
                            <div class="card-content is-overlay is-clipped">
                                <div class="level is-flex-mobile">
                                    <div class="level-left">
                                        <b-checkbox v-model="event.selectionner"
                                            type="is-info">
                                        </b-checkbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button" 
                type="button" 
                @click=" closeModal() ">Annuler
            </button>
            <button class="button is-info"
                type="button"
                @click="ajoutEvent()">Ajouter
            </button>
        </footer>
    </div>
</template>

<script>
import {db, storage, auth} from '../../firebase'

export default {
    name: 'add-event',
    components: {},
    data () {
        return {
            userId: auth.currentUser.uid,
            events: [],
            etatSelectCheckbox: false
        }
    },
    props: ['album'],
    computed: {
        eventsDbRef () {
            return db.ref('events/' + this.userId)
        },
        albumsDbRef () {
            return db.ref('albums/' + this.userId)
        }
    },
    methods: {
        closeModal () {
            this.$parent.close()
        },
        detachListenerEvent () {
            this.eventsDbRef.off()
        },
        listenerEvents () {
            this.eventsDbRef.on('child_added', snap => {
                this.events.push({...snap.val(), id: snap.key})
            })
        },
        ajoutEvent () {
            var eventSelect = this.events.filter(ev => ev.selectionner === true)
            for(var i = 0; i < eventSelect.length ; i++ ) {
                this.albumsDbRef.child(this.album.id + '/events').push({...eventSelect[i]}).then( () => {
                    this.closeModal()
                }).catch( error => {
                    this.alertError(error.message)
                })
            }
        },
        alertError(message) {
            this.$toast.open({
                message: message,
                position: 'is-bottom',
                type: 'is-danger'
            })
        }
    },
    mounted () {
        this.listenerEvents()
    },
    beforeDestroy () {
        this.detachListenerEvent()
    }
}
</script>

<style>

</style>
