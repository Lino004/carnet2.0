<template>
    <div class="limiter">
        <div class="container-login100" style="background-image: url('images/bg-01.jpg');">
            <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                <form class="login100-form validate-form">
                    <span class="login100-form-title p-b-49">S'inscrire</span>
                    <div>
                        <div class="validate-input m-b-23">
                            <label :class="{ 'text-success': user.nom.length > 0 }" for="">Entrez votre Nom</label>
                            <input class="form-control" type="text" placeholder="Nom" v-model="user.nom">
                        </div>
                        <div class="validate-input m-b-23">
                            <label :class="{ 'text-success': user.prenom.length > 0 }" for="">Entrez votre Prenom</label>
                            <input class="form-control" type="text" placeholder="Prenom" v-model="user.prenom">
                        </div>
                        <div class="validate-input m-b-23">
                            <label :class="{ 'text-success': emailVerification }" for="">Entrez votre Email</label>
                            <input class="form-control" type="text" placeholder="Email" v-model="user.email">
                        </div>
                        <div class="validate-input m-b-23">
                            <label :class="{ 'text-success': user.password.length >= 8, 'text-danger': erreurPass }" for="">Entrez votre Mot de passe</label>
                            <input class="form-control" type="password" placeholder="Mot de passe" v-model="user.password">
                        </div>
                        <div class="validate-input m-b-23">
                            <label :class="{ 'text-danger': erreurPass }" for="">Confirmez votre Mot de passe</label>
                            <input class="form-control" type="password" placeholder="Mot de passe" v-model="passwordConfirme">
                        </div>
                        <div class="text-right p-t-8 p-b-31">
                            <p>Ou <router-link to="/login">allez à la page de connexion</router-link></p>
                        </div>
                        <div class="alert alert-danger" v-show="etatErr" >
                            <strong>Erreur!</strong> {{erreur}}
                        </div>
                        <div class="container-login100-form-btn">
                            <div class="wrap-login100-form-btn">
                                <div class="login100-form-bgbtn"></div>
                                <button class="login100-form-btn" @click="inscrire()">S'inscrire</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import {auth} from '../firebase'

export default {
  name: 'Inscription',
  data () {
    return {
      user: {
        email: '',
        password: '',
        nom: '',
        prenom: ''
      },
      passwordConfirme: '',
      erreur: '',
      etatErr: null,
      erreurPass: null
    }
  },
  computed: {
    emailVerification () {
      var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
      return regex.test(this.user.email)
    },
    passwordVerification () {
      if (this.user.password === this.passwordConfirme) {
        return this.passwordConfirme
      } else {
        return ''
      }
    }
  },
  methods: {
    inscrire () {
      auth.createUserWithEmailAndPassword(this.user.email, this.passwordVerification).then(user => {
        alert('Inscription réussi')
        this.$router.push('/acceuil')
      }).catch(err => {
        switch (err.code) {
          case 'auth/email-already-in-use':
            this.etatErr = true
            this.erreur = 'Un compte existe déjà avec l\'adresse électronique indiquée.'
            break
          case 'auth/invalid-email':
            this.etatErr = true
            this.erreur = 'Adresse E-mail non valide.'
            break
          case 'auth/weak-password':
            this.etatErr = this.erreurPass = true
            this.erreur = 'Le mot de passe n\'est pas assez fort ou pas indentique'
            break
        }
      })
    }
  }
}
</script>

<style>
.limiter {
  background-image: url("../style/images/bg-01.jpg");
}
</style>
<style src="../style/css/main.css"></style>
<style src="../style/css/util.css"></style>
<style src="../style/fonts/font-awesome-4.7.0/css/font-awesome.min.css"></style>
