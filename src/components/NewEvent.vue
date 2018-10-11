<template>
    <div class="modal-card" style="width: auto">

        <header class="modal-card-head">
            <p class="modal-card-title">Nouvel Événement </p>
        </header>

        <section class="modal-card-body">

            <b-field class="file">
                <b-upload v-model="files" accept="image/jpeg">
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
                <b-input v-model="newEven.titre"></b-input>
            </b-field>

            <b-field label="Lieu">
                <b-input v-model="newEven.lieu"></b-input>
            </b-field>

            <b-field label="Message">
                <b-input type="textarea" 
                    v-model="newEven.recit"></b-input>
            </b-field>

            <b-message :title="titreMessageAlert" 
                :type="typeMessageAlert" 
                :closable="false"
                has-icon>
                {{messageAlert}}
            </b-message>

        </section>

        <footer class="modal-card-foot">
            <button class="button" 
                type="button" 
                @click="closeAddModal">Annuler
            </button>
            <button class="button is-info" 
                type="button" 
                disabled 
                v-show="!champsRemplis">Ajouter
            </button>
            <button class="button is-info"
                :class="{'is-loading': isLoading}"
                type="button" 
                @click.prevent="upload(files[0])" 
                v-show="champsRemplis">Ajouter
            </button>
            <progress class="progress is-info"
                :value="progressBar"
                max="100"
                v-show="isLoading">{{progressBar}}%
            </progress>
        </footer>
    </div>
</template>

<script>
import {db, storage, auth} from '../firebase'

const date = new Date()

export default {
    name: 'new-event',
    data () {
        return  {
            userId: auth.currentUser.uid,
            files: [],

            // Objet récupérent les informations saisies
            newEven: {
                titre: '',
                lieu: '',
                date: date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear(),
                moment: date.getHours() + 'h ' + date.getMinutes() + 'min',
                recit: '',
                imageUrl: null,
                imageRef: null,
                selectionner: false,
                favori: false
            },
            
            uploadTask: null,
            isLoading: false,

            // Barre de progression
            progressBar: 0,
            
            // Variable alert
            titreMessageAlert: 'Attention',
            typeMessageAlert: 'is-warning',
            messageAlert: 'Il est important de remplir tout les champs avant de pouvoir souvegarder l\'évenement'
        }
    },
    computed: {
        champsRemplis () {
            if (this.newEven.titre !== '' && this.newEven.lieu !== '' && this.newEven.date !== null && this.newEven.recit !== '' && this.files[0].name !== '') {
                this.titreMessageAlert = 'Succès'
                this.typeMessageAlert = 'is-success'
                this.messageAlert = 'Tout les champs sont remplis. Vous pouvez ajouter l\'événement'
                return true
            }
            return false
        },
        eventsDbRef () {
            return db.ref('events/' + this.userId)
        },
        isUpload () {
            if (this.name.imageUrl !== '') {
                return true
            }
            return false
        },
        storageRefImgEvents () {
            return storage.ref('users/' + this.userId + '/events/')
        }
    },
    methods: {
        add () {
            let key = this.eventsDbRef.push().key
            this.eventsDbRef.child(key).update({...this.newEven, id: key}).then( () =>{
                this.files = []
                this.newEven.titre = ''
                this.newEven.lieu = ''
                this.newEven.date = ''
                this.newEven.recit = ''
                this.isLoading = false
                this.closeAddModal()
            }).catch( erreur =>{
                this.isLoading = false
                this.alertError(erreur.message)
            })
        },
        upload (file) {
            this.isLoading = true
            var imgId = this.$uuid.v1()
            this.uploadTask = this.storageRefImgEvents.child(imgId + '.jpg').put(file)
            this.newEven.imageRef = imgId + '.jpg'
        },
        closeAddModal () {
            this.$parent.close()
        },
        alertError(message) {
            this.$toast.open({
                message: message,
                position: 'is-bottom',
                type: 'is-danger'
            })
        }
    },
    watch: {
        uploadTask: function () {
            this.uploadTask.on('state_changed', snapshot => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('progress is ' + progress + '% done')
                this.progressBar = progress
            },
            null,
            () => {
                this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    this.$emit('url', downloadURL)
                    console.log(downloadURL)
                    this.newEven.imageUrl = downloadURL
                    if (this.newEven.imageUrl === downloadURL) {
                        this.add()
                    }
                })
            })
        }
    }
}
</script>

<style>

</style>

