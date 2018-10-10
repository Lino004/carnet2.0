<template>
    <div id="limiter">
        <div class="container-login100">
            <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                <form class="login100-form validate-form">
                    <span class="login100-form-title p-b-49">Login</span>
                    <div>
                        <div class="validate-input m-b-23" v-bind:class="{'alert alert-danger': etatEmail}">
                            <label for="">Entrez votre Email</label>
                            <input class="form-control" type="text" placeholder="Email" v-model="user.email" >
                        </div>
                        <div class="validate-input" v-bind:class="{'alert alert-danger': etatPass}">
                            <label for="">Entrez votre Mot de passe</label>
                            <input class="form-control" type="password" placeholder="Mot de passe" v-model="user.password">
                        </div>
                        <div class="text-right p-t-8 p-b-31">
                            <a href="#">Mots de passe oublié?</a>
                        </div>
                        <div class="alert alert-danger" v-show="etatPass" >
                            <strong>Erreur!</strong> {{erreur}}
                        </div>
                        <div class="container-login100-form-btn">
                            <div class="wrap-login100-form-btn">
                                <div class="login100-form-bgbtn"></div>
                                <button class="login100-form-btn" @click.prevent="verifier"><i :class="{'fa fa-spinner fa-spin': isLoading}"> </i>Connecter</button>
                            </div>
                        </div>
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
      user: {
        email: '',
        password: ''
      },
      etatEmail: null,
      etatPass: null,
      erreur: '',
      isLoading: false
    }
  },
  methods: {
    verifier () {
      this.isLoading = true
      auth.signInWithEmailAndPassword(this.user.email, this.user.password).then(
        () => {
          this.$router.push('/acceuil')
        },
        (err) => {
          this.isLoading = false
          switch (err.code) {
            case 'auth/invalid-email':
              this.etatEmail = true
              this.etatPass = true
              this.erreur = 'Adresse E-mail non valide.'
              break
            case 'auth/user-disabled':
              this.etatEmail = true
              this.etatPass = true
              this.erreur = 'Utilisateur correspondant a été désactivé'
              break
            case 'auth/user-not-found':
              this.etatEmail = true
              this.etatPass = true
              this.erreur = 'Aucun utilisateur correspondant.'
              break
            case 'auth/wrong-password':
              this.etatPass = true
              this.erreur = 'Mot de passe invalide.'
              break
          }
        }
      )
    }
  }
}
</script>

<style scoped>
#limiter {
  background-image: url("https://firebasestorage.googleapis.com/v0/b/carnetdevoyage-2506.appspot.com/o/default%2Fbg-01.jpg?alt=media&token=0b8d4201-a03e-4135-84ec-ccaeaf5073f0");
  background-size: cover;
}
</style>

<style src="../style/css/main.css"></style>
<style src="../style/css/util.css"></style>
<style src="../style/fonts/font-awesome-4.7.0/css/font-awesome.min.css"></style>
