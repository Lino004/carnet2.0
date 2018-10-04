<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Modification de l'Événement</p>
        </header>
        <section class="modal-card-body">
            
            <b-field class="file">
                <b-upload v-model="files">
                    <a class="button is-info">
                        <b-icon icon="upload"></b-icon>
                        <span>Selectioner Image</span>
                    </a>
                </b-upload>
                <span class="file-name"
                    v-if="files && files.length">
                    {{ files[0].name }}
                </span>
            </b-field>

            <b-field label="Titre">
                <b-input v-model="event.titre"></b-input>
            </b-field>

            <b-field label="Lieu">
                <b-input v-model="event.lieu"></b-input>
            </b-field>

            <b-field label="Message">
                <b-input type="textarea" 
                    v-model="event.recit"></b-input>
            </b-field>

        </section>
        <footer class="modal-card-foot">
            
            <button class="button" 
                type="button" 
                @click="closeAddModal">Annuler
            </button>
            <button class="button is-info"
                type="button" @click="modifier()" 
                :class="{'is-loading': isLoading}">Modifier
            </button>

        </footer>
    </div>
</template>

<script>
import {db, storage, auth} from '../firebase'

export default {
    name: 'modif-event',
    data () {
        return {
            files: [],
            userId: auth.currentUser.uid,
            isLoading: false,
            uploadTask: null
        }
    },
    props: ['event'],
    computed: {
        eventsDbRef () {
            return db.ref('events/' + this.userId)
        }
    },
    methods: {
        closeAddModal () {
            this.$parent.close()
        },
        modifier () {
            if ( this.files.length ) {
                this.supprimerImg(this.event)
                this.upload(this.files[0])
            }
            else {
                this.miseAJourEvent(this.event)
            }
        },
        miseAJourEvent (ev) {
            this.isLoading = true
            this.eventsDbRef.child(ev.id).update({...ev}).then(() => {
                this.isLoading = false
                this.closeAddModal()
                console.log('mise à jour success')
            }).catch( (error) => {
                this.isLoading = false
                console.log('mise à jour erreur :' + error.message)
            })
        },
        supprimerImg (e) {
            storage.ref().child(e.imageRef).delete().then(() => {
                console.log('supp image success')
            }).catch( (error) => {
                console.log('erreur image :' + error.message)
            })
        },
        upload (file) {
            this.isLoading = true
            this.uploadTask = storage.ref(this.userId + '/' + file.name).put(file)
            this.event.imageRef = this.userId + '/' + file.name
        }
    },
    watch: {
        uploadTask: function () {
            this.uploadTask.on('state_changed', snapshot => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('progress is ' + progress + '% done')
            },
            function(error) {
                console.log('erreur image :' + error.message)
            },
            () => {
                this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    this.$emit('url', downloadURL)
                    console.log(downloadURL)
                    this.event.imageUrl = downloadURL
                    if (this.event.imageUrl === downloadURL) {
                        this.miseAJourEvent(this.event)
                    }
                })
            })
        }
    }
}
</script>

<style>

</style>
