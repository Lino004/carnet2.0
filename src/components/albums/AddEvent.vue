<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Ajouter des évenements</p>
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
        eventsAlbumDbRef () {
            return db.ref('eventsAlbums/' + this.userId + '/' + this.album.id)
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
            for(var i = 0; i < eventSelect.length; i++) {
                let key = this.eventsAlbumDbRef.push().key
                this.eventsAlbumDbRef.child(key).update({...eventSelect[i], key: key}).then(() => {
                    this.closeModal()
                }).catch(erro => {
                    this.alertError(erro.message)
                })
                this.eventsDbRef.child(eventSelect[i].id).update({refAlbum: this.album.id + '/' + key})
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
