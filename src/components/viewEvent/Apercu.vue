<template>
    <div class="modal-card">
        <div class="is-overlay">
            <div class="level is-flex-mobile background-color-blak-flou">
                <div class="level-item">
                    <span class="title is-5 has-text-white">{{event.titre}}</span>
                </div>
                <div class="level-right is-flex-mobile">
                    <div v-show="!event.favori">
                        <a @click.prevent="favoris(event)">
                            <b-icon icon="heart-outline" type="is-grey"></b-icon>
                        </a>
                    </div>
                    <div v-show="event.favori">
                        <a @click.prevent="favoris(event)">
                            <b-icon icon="heart" type="is-danger"></b-icon>
                        </a>
                    </div>
                </div>
                <div class="level-right">
                    <div style="margin-right: 10px;">
                        <a @click="isModalModif = true">
                            <b-icon icon="circle-edit-outline" type="is-info"></b-icon>
                        </a>
                    </div>
                </div>
            </div>
            <p class="has-text-white background-color-blak-flou" id="position-commentaire">
                {{event.recit}}
                <br><em class="has-text-right is-white">Le {{event.date}} à {{event.lieu}}</em>
            </p>
        </div>
        <img :src="event.imageUrl">
        <b-modal :active.sync="isModalModif" has-modal-card>
            <modif-event :event="event"></modif-event>
        </b-modal>
    </div>
</template>

<script>
import ModifEvent from '../ModifEvent'
export default {
    name: 'apercu',
    components: { ModifEvent },
    props: ['event', 'eventsDbRef'],
    data () {
        return {
            isModalModif: false
        }
    },
    methods: {
        favoris (event)  {
            event.favori = !event.favori
            this.eventsDbRef.child(event.id).update({favori: event.favori})
        }
    }
}
</script>

<style>
.background-color-blak-flou {
    margin: 10px;
    background-color: rgba(0, 0, 0, .5);
}
#position-commentaire {
    position: absolute;
    bottom: 5%
}
</style>
