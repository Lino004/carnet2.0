<template>
    <div>
        <header>
            <div class="navbar navbar-dark bg-dark box-shadow">
                <div class="container d-flex justify-content-between">
                    <!--Bouton d'ajout d'un evenement-->
                    <a href="#" class="navbar-brand d-flex align-items-center" 
                        @click="fenetreModalActive = true">
                        <i class="fa fa-plus"></i>&nbsp;<span>Ajouter</span>
                    </a>
                    <b-modal :active.sync="fenetreModalActive" has-modal-card>
                        <new-event></new-event>
                    </b-modal>
                    <!--Bouton de navigation-->
                    <div class="d-flex align-items-center">
                        <span class="navbar-brand align-items-center"> {{currentUser.displayName}} </span>
                        
                        <b-dropdown hoverable>
                            <b-icon icon="account-circle" 
                            type="is-white" 
                            size="is-medium" 
                            slot="trigger"></b-icon>

                            <b-dropdown-item @click="modalMonCompte = true">Mon compte</b-dropdown-item>

                            <b-modal :active.sync="modalMonCompte" has-modal-card>
                                <mon-compte></mon-compte>
                            </b-modal>

                            <b-dropdown-item @click="deconnecter()">Déconnection</b-dropdown-item>
                        </b-dropdown>
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
    import { mapGetters } from 'vuex'
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
            ...mapGetters(['currentUser'])
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

</style>

