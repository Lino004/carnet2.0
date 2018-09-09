<template>
    <div id="addModal">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h4 class="modal-title">Nouvelle Evenement</h4>
                    <button type="button" class="close" @click="closeAddModal">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div>
                        <form>

                            <div class="form-group">
                                <label>Selectioner Image</label>
                                <input type="file" class="form-control" multiple accept="image/*" @change="detectFiles($event.target.files)">
                                <div class="progress">
                                    <div class="progress-bar bg-info" role="progressbar" :style="'width: ' + progressBar + '%'" :aria-valuenow="progressBar" aria-valuemin="0" :aria-valuemax="progressBar"></div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Titre</label>
                                <input type="text" class="form-control" placeholder="Titre" v-model="newEven.titre">
                            </div>

                            <div class="form-group">
                                <label>Lieu</label>
                                <input type="text" class="form-control" placeholder="Lieu" v-model="newEven.lieu">
                            </div>

                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" class="form-control" placeholder="Date" v-model="newEven.date">
                            </div>

                            <div class="form-group">
                                <label>Commentaire</label>
                                <textarea class="form-control" rows="3" v-model="newEven.recit"></textarea>
                            </div>

                            <div class="alert alert-warning" v-show="!champsRemplis" >
                                <strong>Attention!</strong> Il est important de remplir tout les champs avant de pouvoir souvegarder l'évenement
                            </div>
                        
                            <div class="">
                                <button type="button" class="form-control btn btn-light" @click="closeAddModal">Annuler</button>
                            </div>

                            <div class="">
                                <button type="button" class="form-control btn btn-info" @click.prevent="add" v-show="champsRemplis">Ajouter</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {db, storage, auth} from '../firebase'

export default {
    name: 'new-event',
    data () {
        return  {
            userId: auth.currentUser.uid,
            newEven: { // Objet récupérent les informations de saisie
                titre: '',
                lieu: '',
                date: null,
                recit: '',
                imageUrl: null,
                imageRef: null
            },
            uploadTask: null,
            progressBar: 0
        }
    },
    computed: {
        champsRemplis () {
            if (this.newEven.titre !== '' && this.newEven.lieu !== '' && this.newEven.date !== null && this.newEven.recit !== '' && this.progressBar === 100 && this.newEven.imageUrl !== '') {
                return true
            }
            return false
        },
        eventsDbRef () {
            return db.ref('events/' + this.userId)
        }
    },
    methods: {
        add () {
            this.eventsDbRef.push().set({...this.newEven}).then( () =>{
                this.closeAddModal()
            }).catch( erreur =>{
                alert(erreur.message)
            })
            this.newEven.titre = ''
            this.newEven.lieu = ''
            this.newEven.date = ''
            this.newEven.recit = ''
            this.progressBar = 0
        },
        detectFiles (fileList) {
            Array.from(Array(fileList.length).keys()).map(x => {
                this.upload(fileList[x])
            })
        },
        upload (file) {
            this.uploadTask = storage.ref(this.userId + '/' + file.name).put(file)
            this.newEven.imageRef = this.userId + '/' + file.name
        },
        closeAddModal () {
            $("#addModal").modal('hide')
        }
    },
    watch: {
        uploadTask: function () {
            this.uploadTask.on('state_changed', snapshot => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                this.progressBar = progress
                console.log('progress is ' + progress + '% done')
                console.log('progressBar is ' + this.progressBar)
            },
            null,
            () => {
                this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                this.$emit('url', downloadURL)
                console.log(downloadURL)
                this.newEven.imageUrl = downloadURL
                })
            })
        }
    }
}
</script>

<style>

</style>
