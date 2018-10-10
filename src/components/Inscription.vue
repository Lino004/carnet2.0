<template>
    <div id="limiter">
        <div class="container-login100">
            <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">

              <!-- Formulaire -->
                <form class="login100-form validate-form">
                    <span class="login100-form-title p-b-49">S'inscrire</span>
                    <div>

                        <!-- Pseudonyme -->
                        <b-field label="Entrez votre Pseudo"
                            :type="pseudo.type"
                            :message="pseudo.message">
                            <b-input v-model="pseudo.valeur"
                              maxlength="30"
                              placeholder="pseudo"
                              @input="pseudoValide()">
                            </b-input>
                        </b-field>
                        
                        <!-- Email -->
                        <b-field label="Entrez votre Email"
                            :type="email.type"
                            :message="email.message">
                            <b-input type="email"
                                v-model="email.valeur"
                                placeholder="email"
                                @input="emailValide()">
                            </b-input>
                        </b-field>
                        
                        <!-- Mot de passe -->
                        <b-field label="Entrez votre Mot de passe"
                            :type="password.type"
                            :message="password.message">
                            <b-input type="password"
                                v-model="password.valeur"
                                placeholder="Mot de passe"
                                password-reveal
                                @input="passwordValide()">
                            </b-input>
                        </b-field>
                        
                        <!-- Confirmation du mot de passe -->
                        <b-field label="Confirmer votre Mot de passe"
                          :type="passwordConfirme.type"
                          :message="passwordConfirme.message">
                          <b-input type="password"
                              v-model="passwordConfirme.valeur"
                              placeholder="Mot de passe"
                              password-reveal
                              @input="passwordConfirmeValide()">
                          </b-input>
                        </b-field>


                        <div class="text-right p-t-8 p-b-31">
                          <p>Ou
                            <router-link to="/login">
                              <strong class="text-primary">allez à la page de connexion</strong>
                            </router-link>
                          </p>
                        </div>

                        <button class="button is-block is-info is-large is-fullwidth is-rounded"
                          :class="{'is-loading': isLoading}"
                          @click.prevent="inscrire()">
                          Inscription
                        </button>
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
      email: {
        valeur: '',
        type: '',
        message: ''
      },
      pseudo: {
        valeur: '',
        type: '',
        message: ''
      },
      password: {
        valeur: '',
        type: '',
        message: ''
      },
      passwordConfirme: {
        valeur: '',
        type: '',
        message: ''
      },
      usersRef: db.ref('users'),
      isLoading: false
    }
  },
  methods: {
    pseudoValide () {
      if (this.pseudo.valeur.length > 3) {
        this.pseudo.type = 'is-success'
        this.pseudo.message = 'Pseudonyme valide'
        return true
      }else{
        this.pseudo.type = 'is-danger'
        this.pseudo.message = 'Pseudonyme invalide'
        return false
      }
    },
    emailValide () {
      var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
      if (regex.test(this.email.valeur)) {
        this.email.type = 'is-success'
        this.email.message = 'Email valide'
        return true
      }else{
        this.email.type = 'is-danger'
        this.email.message = 'Email invalide'
        return false
      }
    },
    passwordValide () {
      if (this.password.valeur.length > 8) {
        this.password.type = 'is-success'
        this.password.message = 'Mot de passe valide'
        return true
      }else{
        this.password.type = 'is-danger'
        this.password.message = 'Le mot de passe doit être supérieur à 8 caractères'
        return false
      }
    },
    passwordConfirmeValide () {
      if (this.passwordConfirme.valeur === this.password.valeur) {
        this.passwordConfirme.type = 'is-success'
        this.passwordConfirme.message = 'Mot de passe valide'
        return true
      }else{
        this.passwordConfirme.type = 'is-danger'
        this.passwordConfirme.message = 'Les mots de passe ne sont pas identique'
        return false
      }
    },
    isValide () {
      if ( this.pseudoValide() && this.emailValide() && this.passwordValide() && this.passwordConfirmeValide()) {
        return true
      }else{
        return false
      }
    },
    inscrire () {
      this.isLoading = true
      if (this.isValide()) {
        auth.createUserWithEmailAndPassword(this.email.valeur, this.passwordConfirme.valeur).then(infoUser => {
          infoUser.user.updateProfile({
            displayName: this.pseudo.valeur,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/carnetdevoyage-2506.appspot.com/o/default%2Fcompte.png?alt=media&token=94e1cc48-c416-4918-affb-0ec99898eeef"
          }).then( () =>{
            this.isLoading = false
            this.alertSuccess('Inscription réussi')
            this.$router.push('/acceuil')
          })
        }).catch(err => {
          this.isLoading = false
          this.alertError(err.message)
        })
      }else{
        this.isLoading = false
        this.alertError('Oups!!!! Il y a des conditions qui ne sont pas valides')
      }
    },
    alertError(message) {
        this.$toast.open({
            message: message,
            position: 'is-bottom',
            type: 'is-danger'
        })
    },
    alertSuccess(message) {
        this.$toast.open({
            message: message,
            position: 'is-bottom',
            type: 'is-info'
        })
    }
  }
}
</script>

<style scoped>
#limiter {
  background-image: url("https://firebasestorage.googleapis.com/v0/b/carnetdevoyage-2506.appspot.com/o/default%2Fbg-01.jpg?alt=media&token=0b8d4201-a03e-4135-84ec-ccaeaf5073f0");
  background-size: cover;
}
.button {
  background-image: linear-gradient(to bottom,#aa4bfd,#a64bf4);
}
</style>
<style src="../style/css/main.css"></style>
<style src="../style/css/util.css"></style>
<style src="../style/fonts/font-awesome-4.7.0/css/font-awesome.min.css"></style>
