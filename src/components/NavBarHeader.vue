<template>
    <div>
        <header>
            <div class="navbar">
                <div class="navbar-brand">
                    <a class=""  href="index.html">
                        <img src="https://firebasestorage.googleapis.com/v0/b/carnetdevoyage-2506.appspot.com/o/default%2FTRIP.png?alt=media&token=4e9771ae-c683-4e1c-b3c9-0814d28aadad" width="60" alt="Homepage">
                    </a>
                </div>
                <div class="navbar-end d-flex align-items-center text-white">
                    <span class="navbar-brand align-items-center"> {{user.displayName}} </span>

                    <div class="dropdown dropleft">
                        <div id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <b-icon icon="account-circle" 
                                type="is-white" 
                                size="is-medium" 
                                slot="trigger">
                            </b-icon>
                        </div>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" @click="modalMonCompte = true">Mon compte</a>
                            <a class="dropdown-item" @click="deconnecter()">Déconnection</a>
                        </div>
                    </div>

                    <b-modal :active.sync="modalMonCompte" has-modal-card>
                        <mon-compte></mon-compte>
                    </b-modal>
                </div>
            </div>
        </header>
        <section>
    </section>
    </div>
</template>
<script>
    import { auth } from '../firebase'
    import MonCompte from './MonCompte'
    
    export default {
        name: 'nav-bar-header',
        components: {
            MonCompte
        },
        data () {
            return {
                show: false,
                fenetreModalActive: false,
                modalMonCompte: false
            }
        },
        computed: {
            user () {
                return auth.currentUser
            }
        },
        methods: {
            goToAccueil () {
                this.show = !this.show
                this.$parent.condition = true
            },
            goToAlbum () {
                this.show = !this.show
                this.$parent.condition = false
            },
            deconnecter () {
                auth.signOut().then(() => {
                    this.$store.dispatch('setUser', null)
                    this.$router.replace('login')
                })
            }
        }
    }
</script>
<style>
.site-logo{
width: 60px;
height: 60px;

margin-left:-100px;
}
.navbar{
    background-image: linear-gradient(to bottom,#3e0aa9,#5128a6);
    margin-bottom: 20px;
}
#compte{
   margin-right:-40px; 
   
}
</style>

