<template>
    <div>
        <header>
            <div class="navbar">
                <div class="container d-flex is-flex-mobile ">
                     <a class="site-logo"  href="index.html">
                        <img src="../style/images/TRIP.png" alt="Homepage">
                     </a>
                    
                    <div class="d-flex align-items-center text-white" id="compte">
                        <span class="navbar-brand align-items-center"> {{user.displayName}} </span>
                        
                        <b-dropdown hoverable>
                            <b-icon icon="account-circle" 
                            type="is-white" 
                            size="is-medium" 
                            slot="trigger"></b-icon>

                            <b-dropdown-item @click="modalMonCompte = true">Mon compte</b-dropdown-item>
                            <b-dropdown-item @click="deconnecter()">Déconnection</b-dropdown-item>
                            
                        </b-dropdown>
                        <b-modal :active.sync="modalMonCompte" has-modal-card>
                            <mon-compte></mon-compte>
                        </b-modal>
                    </div>
                </div>
            </div>
        </header>
        <section>
    </section>
    </div>
</template>
<script>
    import { auth } from '../firebase'
    import NewEvent from './NewEvent'
    import MonCompte from './MonCompte'
    
    export default {
        name: 'nav-bar-header',
        components: {
            NewEvent,
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

