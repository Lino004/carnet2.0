<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Nouvel Album</p>
        </header>
        <section class="modal-card-body">
            <b-field label="Nom de l'album">
                <b-input v-model="nomAlbum"></b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <button class="button" 
                type="button" 
                @click="closeAddModal">Annuler
            </button>
            <button class="button is-info"
                type="button"
                @click="ajoutAlbum()">Ajouter
            </button>
        </footer>
    </div>
</template>

<script>
import {db, storage, auth} from '../../firebase'

export default {
    name: 'new-album',
    data () {
        return {
            userId: auth.currentUser.uid,
            nomAlbum: ''
        }
    },
    computed: {
        albumsDbRef () {
            return db.ref('albums/' + this.userId)
        }
    },
    methods: {
        closeAddModal () {
            this.$parent.close()
        },
        ajoutAlbum () {
            let key = this.albumsDbRef.push().key
            let newAlbum = {id: key, name: this.nomAlbum, actif: false, selectionner: false}

            this.albumsDbRef.child(key).update(newAlbum).then( () => {
                this.nomAlbum = ''
                this.closeAddModal()
            }).catch( error => {
                this.alertError(error.message)
            })
        },
        alertError(message) {
            this.$toast.open({
                message: message,
                position: 'is-bottom',
                type: 'is-danger'
            })
        }
    }
}
</script>

<style>

</style>
