<template>
    <section class="hero is-small is-fullheight" id="fully">
        <div class="hero-body">
            <div class="container">
                <h1 class="title has-text-centered is-1 has-text-white">
                    Quelle est votre prochaine destination?
                </h1>
                <h2 class="subtitle has-text-centered is-4 has-text-white">
                    Gargez vos meilleurs souvenirs ici.
                </h2>
                <div class=" has-text-centered">
                    <a class="button is-rounded is-centered is-white is-outlined is-medium" @click="fenetreModalActive = true">Ajouter</a>
                </div>
                <b-modal :active.sync="fenetreModalActive" has-modal-card>
                    <new-event></new-event>
                </b-modal>
            
            </div>
        </div>
    </section>
</template>

<script>
import NewEvent from './NewEvent'

export default {
    name: "background-initial",
    components: {
        NewEvent
    },
    data () {
        return {
            fenetreModalActive: false
        }
    },
}
</script>

<style>

#fully{
    
    background-image: url('https://firebasestorage.googleapis.com/v0/b/carnetdevoyage-2506.appspot.com/o/default%2Fview1.jpg?alt=media&token=9139dfcd-d642-487d-a390-1a89fadf6e71');
    background-size: cover;
    
}
.container{
    backdrop-filter: blur(5px);
}

</style>
