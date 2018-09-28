<template>
    <div>
        <header class="modal-card-head">
            <p class="modal-card-title">Modification de l'Événement</p>
        </header>
        <section class="modal-card-body">
            <b-field class="file">
                <b-upload v-model="files">
                    <a class="button is-info">
                        <b-icon icon="upload"></b-icon>
                        <span>Modifier l'image</span>
                    </a>
                </b-upload>
                <span class="file-name"
                    v-if="files && files.length">
                    {{ files[0].name }}
                </span>
            </b-field>

            <b-field label="Titre">
                <b-input v-model="event.titre"></b-input>
            </b-field>

            <b-field label="Lieu">
                <b-input v-model="event.lieu"></b-input>
            </b-field>
            <b-field label="Message">
                <b-input type="textarea" 
                    v-model="event.recit"></b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <button class="button" 
                type="button" 
                @click="closeModal()">Annuler
            </button>
            <button class="button is-info"
                type="button">Modifier
            </button>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'test',
    data () {
        return {
            tab: ['ville', 'pays', 'continent'],
        }
    }
}
</script>

<style>

</style>
