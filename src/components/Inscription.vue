<template>
    <div id="limiter">
        <div class="container-login100">
            <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">

              <!-- Formulaire -->
                <form class="login100-form validate-form">
                    <span class="login100-form-title p-b-49">S'inscrire</span>
                    <div>

                        <!-- Pseudonime -->
                        <div class="validate-input m-b-23">
                            <label :class="{ 'text-success': pseudo.length > 0 }" for="pseudo">Entrez votre Pseudo</label>
                            <input class="form-control" type="text" placeholder="Pseudo" id="pseudo" v-model="pseudo">
                        </div>
                        
                        <!-- Email -->
                        <div class="validate-input m-b-23">
                            <label :class="{ 'text-success': emailVerification }" for="email">Entrez votre Email</label>
                            <input class="form-control" type="text" placeholder="Email" id="email" v-model="email">
                        </div>
                        
                        <!-- Mot de passe -->
                        <div class="validate-input m-b-23">
                            <label :class="{ 'text-success': password.length >= 8, 'text-danger': erreurPass }" for="password">Entrez votre Mot de passe</label>
                            <input class="form-control" type="password" placeholder="Mot de passe" id="password" v-model="password">
                        </div>
                        
                        <!-- Confirmation du mot de passe -->
                        <div class="validate-input m-b-23">
                            <label :class="{ 'text-danger': erreurPass }" for="passwordConfirme">Confirmez votre Mot de passe</label>
                            <input class="form-control" type="password" placeholder="Mot de passe" id="passwordConfirme" v-model="passwordConfirme">
                        </div>
                        <div class="text-right p-t-8 p-b-31">
                            <p>Ou <router-link to="/login"><strong class="text-primary">allez à la page de connexion</strong></router-link></p>
                        </div>

                        <div class="alert alert-danger" v-show="etatErr">
                            <strong>Erreur!</strong> {{erreurs}}
                        </div>

                        <div class="container-login100-form-btn">

                            <div class="wrap-login100-form-btn">
                                <div class="login100-form-bgbtn"></div>
                                <button class="login100-form-btn" @click="inscrire()"> <i :class="{'fa fa-spinner fa-spin': isLoading}"> </i>S'inscrire</button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import {auth, db} from '../firebase'

export default {
  name: 'Inscription',
  data () {
    return {
      email: '',
      password: '',
      pseudo: '',
      passwordConfirme: '',
      erreurs: '',
      etatErr: null,
      erreurPass: null,
      usersRef: db.ref('users'),
      isLoading: false
    }
  },
  computed: {
    emailVerification () {
      var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
      return regex.test(this.email)
    },
    passwordVerification () {
      if (this.password === this.passwordConfirme) {
        return this.passwordConfirme
      }
      this.erreurs = 'Les mots de passe ne sont pas identiques'
      return ''
    }
  },
  methods: {
    inscrire () {
      this.isLoading = true

      auth.createUserWithEmailAndPassword(this.email, this.passwordVerification).then(infoUser => {

        infoUser.user.updateProfile({
          displayName: this.pseudo
        }).then( () =>{
          this.saveUserToUsersRef(infoUser.user).then( () =>{
            this.$store.dispatch('setUser', infoUser.user)
            this.$router.push('/acceuil')
          })
        })

      }).catch(err => {
        this.isLoading = false
        this.etatErr = true
        this.erreurs = err.message
      })
      
    },
    saveUserToUsersRef (user) {
      return this.usersRef.child(user.uid).set({
        pseudo: user.displayName,
        email: user.email
      })
    }
  }
}
</script>

<style scoped>
#limiter {
  background-image: url("https://firebasestorage.googleapis.com/v0/b/carnetdevoyage-2506.appspot.com/o/default%2Fbg-01.jpg?alt=media&token=0b8d4201-a03e-4135-84ec-ccaeaf5073f0");
}
</style>
<style src="../style/css/main.css"></style>
<style src="../style/css/util.css"></style>
<style src="../style/fonts/font-awesome-4.7.0/css/font-awesome.min.css"></style>
