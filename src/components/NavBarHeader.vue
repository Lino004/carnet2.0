<template>
    <header>
    
        <div class="bg-dark" v-if="show">
            <div class="container">
                <div class="row">
                    
                    <!--Texte descriptif de l'application-->
                    <div class="col-sm-8 col-md-5 py-4">
                        <h4 class="text-white">Album</h4>
                        <p class="text-muted">Votre plateforme de voyage. Parcourez le monde et gardez vos souvenir près de vous à chaque moment</p>
                    </div>

                    <!--Menu de navigation de l'application-->
                    <div class="col-sm-2 offset-md-1 py-4">
                        <h4 class="text-white"></h4>
                        <ul class="list-unstyled">
                            <li><a href="#" class="text-white"><i class="fa fa-home"></i>&emsp;Acceuil</a></li>
                            <li><a href="#" class="text-white"><i class="fa fa-image"></i>&emsp;Mes Albums</a></li>
                            <li><a href="#" class="text-white"><i class="fa fa-gratipay"></i>&emsp;Mes Favoris</a></li>
                        </ul>
                    </div>

                    <div class="col-sm-2 offset-md-1 py-4">
                        <h4 class="text-white"></h4>
                        <ul class="list-unstyled">
                            <li><a href="#" class="text-white"><i class="fa fa-plane"> </i> Mes Destinations</a></li>
                            <li><a href="#" class="text-white"><i class="fa fa-user-circle"> </i> Mon compte</a></li>
                            <li><a href="#" class="text-white" @click.prevent="deconnecter()"><i class="fa fa-sign-out"> </i> Deconnection</a></li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

      <div class="navbar navbar-dark bg-dark box-shadow">
        <div class="container d-flex justify-content-between">
            
            <!--Bouton d'ajout d'un evenement-->
            <a href="#" class="navbar-brand d-flex align-items-center" @click="viewAddModal">
                <i class="fa fa-plus"></i>&nbsp;
                <span>Add</span>
            </a>
            
            <!--Bouton de navigation-->
            <div class="d-flex align-items-center">
                <span class="navbar-brand"> {{currentUser.displayName}} </span>
                <button class="navbar-toggler d-flex" type="button" v-on:click="show = !show">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>

        </div>
      </div>
      
    </header>
</template>

<script>
import { auth } from '../firebase'
import { mapGetters } from 'vuex'

export default {
    name: 'nav-bar-header',
    data () {
        return {
            show: false
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    methods: {
        viewAddModal () {
            $("#addModal").modal('show')
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
