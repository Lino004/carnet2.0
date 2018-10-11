<template>
  <div class="modal-card">

    <header class="modal-card-head">
      <p class="modal-card-title has-text-centered">Mon Compte</p>
    </header>

    <section class="modal-card-body">
      <div class="tile" v-show="!view">
        <div class="tile is-child">
            <div class="columns is-mobile is-centered">
                <b-upload v-model="file" accept="image/jpeg" @input="upload(file[0])">
                  <figure class="is-centered image is-128x128">
                    <img :src="tempImage" id="id_img_profil">
                  </figure>
                </b-upload>
            </div>
            <progress class="progress is-info"
                :value="progressBar"
                max="100"
                v-show="isLoading">{{progressBar}}%
            </progress>
        </div>
        <div class="tile is-child is-vertical">
            <b-field label="Pseudo :">
              <p class="subtitle is-6"> {{user.displayName}}</p>
            </b-field>
            <b-field label="Email :">
              <p class="subtitle is-6"> {{user.email}} </p>
            </b-field>
        </div>
      </div>

      <div class="tile is-ancestor" v-show="view">
        <div class="tile is-vertical is-parent">
            <b-field label="Pseudo :">
               <b-input type="text" v-model="user.displayName" placeholder="Votre Pseudo " required></b-input>
            </b-field>
            <b-field label="Email :">
              <b-input type="email" v-model="user.email" placeholder="Votre email"  required></b-input>
            </b-field>
            <b-field label="Mot de passe">
              <b-input type="password" v-model="password" password-reveal
                  placeholder="Votre mot de passe"
                  required>
              </b-input>
            </b-field>
        </div>
      </div>
    </section>

    <footer class="modal-card-foot">
      <div v-show="!view">
        <button class="button" 
          type="button" 
          @click="$parent.close()">Fermer
        </button>
        <button class="button is-info" 
            type="button"
            @click="view = true">Modifier
        </button>
      </div>
      <div v-show="view">
        <button class="button" 
          type="button" 
          @click="$parent.close()">Annuler
        </button>
        <button class="button is-info" 
            type="button"
            @click="modifier()">Modifier
        </button>
      </div>
    </footer>

  </div>
</template>

<script>
  import { db, storage, auth } from '../firebase'

  export default {
    name: 'mon-compte',
    data() {
      return {
        view: false,
        file: [],
        password: '',
        uploadTask: null,
        isLoading: false,
        // Barre de progression
        progressBar: 0,
        tempImage: ''
      }
    },
    computed: {
      user () {
        return auth.currentUser
      },
      storageRefPhotoURLUser (){
        return storage.ref('users/' + this.user.uid + '/profil/')
      }
    },
    methods: {
      upload (file) {
        this.isLoading = true
        var idImg = this.$uuid.v1()
        var uploadTask = this.storageRefPhotoURLUser.child(idImg + '.jpg').put(file)
        uploadTask.on('state_changed', snapshot => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.progressBar = progress
        },
        (error) =>{
          alertError(error.message)
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.updateImage(downloadURL)
          })
        })
      },
      updateProfile () {
        this.user.updateProfile({
           displayName: this.user.displayName
         }).then(function() {
          console.log('success uploadProfil')
        })
      },
      updateImage (imageUrl){
        this.isLoading = false
        this.tempImage = imageUrl
        this.user.updateProfile({photoURL: imageUrl})
      },
      updateEmail () {
        this.user.updateEmail(this.user.email).then(function() {
          console.log('success uploadEmail')
        }).catch(function(error) {
          this.alertError(error.message)
        })
      },
      upadatePass () {
        if (this.password.length >= 8) {
          user.updatePassword(this.password).then(function() {
            console.log('success uploadPass')
          }).catch(function(error) {
            this.alertError(error.message)
          })
        }else{
          this.alertError("Le mot de passe doit avoir au moins 8 caractère")
        }
      },
      modifier () {
        this.updateProfile()
        this.updateEmail()
        if (this.password.length > 0) {
          this.upadatePass()
        }
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
    mounted () {
      this.tempImage = this.user.photoURL
    }
  }
</script>

<style scoped>

#id_img_profil {
  position: absolute;
  top: 15%;
  height: 80%; 
}

</style>

