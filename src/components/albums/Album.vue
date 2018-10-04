<template>
    <div class="container">

        <!-- Option de suppression d'un événement -->
        <div class="level" id='trash'>
            
            <div class="column is-8">
                <div class="level-item" >
                    <a @click="fenetreModalActive = true">
                        <b-icon icon="library-plus" type="is-info" size="is-medium"></b-icon>
                    </a>
                    
                </div>
                <div class="level-item" >
                    <a>
                        <b-icon icon="delete" type="is-info" size="is-medium"></b-icon>
                    </a>
                </div>
            </div>
            
        </div>
        <b-modal :active.sync="fenetreModalActive" has-modal-card>
            <new-album></new-album>
        </b-modal>

        <div v-for="album in albums" :key="album.id" class="shadow p-3 mb-5 bg-white rounded">
            <a class="">
                <div class="level is-flex-mobile">
                    <div class="level-left">
                        <h4 class="title is-4 has-text-info">{{album.name}}</h4>
                    </div>
                    <div class="level-right">
                        <a class="" @click="addEvent(album)">
                            <b-icon icon="plus-circle" type="is-info"></b-icon>
                        </a>
                        <b-modal :active.sync="fenetreModalAddEvent" has-modal-card>
                            <add-event :album="albumActuel" ></add-event>
                        </b-modal>
                        <b-icon icon="arrow-down-drop-circle" type="is-info"></b-icon>
                    </div>
                </div>
            </a>
            {{album}}
        </div>
    </div>
</template>

<script>
import {db, storage, auth} from '../../firebase'
import NewAlbum from './NewAlbum'
import AddEvent from './AddEvent'
import ViewEvent from '../ViewEvent'

export default {
    name: 'album',
    components: { NewAlbum, ViewEvent, AddEvent},
    data () {
        return {
            userId: auth.currentUser.uid,
            albums: [],
            fenetreModalActive: false,
            fenetreModalAddEvent: false,
            albumActuel: []
        }
    },
    computed: {
        eventsDbRef () {
            return db.ref('events/' + this.userId)
        },
        albumsDbRef () {
            return db.ref('albums/' + this.userId)
        }
    },
    methods: {
        listenerAddAlbums () {
            this.albumsDbRef.on('child_added', snap => {
                this.albums.push({...snap.val()})
            })
        },
        addEvent (album) {
            this.albumActuel = album
            this.fenetreModalAddEvent = true
        }
    },
    mounted () {
        this.listenerAddAlbums()
    }
}
</script>

<style>
#main {
    margin-top: 20px;
}
#trash{
    position: fixed;
    left:10px;
}
</style>
