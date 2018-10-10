<template>
    <div id="limiter">
        <div class="container-login100">
            <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                <form class="login100-form validate-form">
                    <span class="login100-form-title p-b-49">Login</span>
                    <div>
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
                        
                        <div class="text-right p-t-8 p-b-31">
                            <a href="#">Mots de passe oublié?</a>
                        </div>
                        <button class="button is-block is-info is-large is-fullwidth is-rounded"
                          :class="{'is-loading': isLoading}"
                          @click.prevent="verifier()">
                          Inscription
                        </button>
                    </div>
                    <div class="txt1 text-center p-t-54 p-b-20">
                        <p>Vous n'avez pas de compte? <router-link to="/inscription"> <strong class="text-primary">Inscrivez vous ici</strong> </router-link> </p>
                        <span>Ou s'inscrire en utlisant</span>
                    </div>
                    <div class="flex-c-m">
                        <a href="#" class="login100-social-item bg2">
                            <i class="fa fa-instagram"></i>
                        </a>
                        <h3>INSTAGRAM</h3>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import {auth} from '../firebase'

export default {
  name: 'login',
  data () {
    return {
        email: {
            valeur: '',
            type: '',
            message: ''
        },
        password: {
            valeur: '',
            type: '',
            message: ''
        },
      isLoading: false
    }
  },
  methods: {
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
    isValide () {
      if ( this.emailValide() && this.passwordValide()) {
        return true
      }else{
        return false
      }
    },
    verifier () {
      this.isLoading = true
      if (this.isValide()) {
          auth.signInWithEmailAndPassword(this.email.valeur, this.password.valeur).then(
            () => {
                this.isLoading = false
                this.alertSuccess('Connexion réussi')
                this.$router.push('/acceuil')
            },
            (err) => {
                this.isLoading = false
                this.alertError(err.message)
            }
        )
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
