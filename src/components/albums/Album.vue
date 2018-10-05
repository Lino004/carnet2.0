<template>
    <div class="container">

        <!-- Option de suppression d'un événement -->
        <div class="level" id='trash'>
            
            <div class="column is-8">
                <div class="level-item" v-show="!etatSelectCheckbox">
                    <a @click="fenetreModalActive = true">
                        <b-icon icon="library-plus" type="is-info" size="is-medium"></b-icon>
                    </a>
                    
                </div>
                <div class="level-item" v-show="!etatSelectCheckbox">
                    <a @click="selectionner()">
                        <b-icon icon="delete" type="is-info" size="is-medium"></b-icon>
                    </a>
                </div>
                <div class="level-item" v-show="etatSelectCheckbox">
                    <a @click="supprimer()">
                        <b-icon icon="check-circle" type="is-info" size="is-medium"></b-icon>
                    </a>
                    <a @click="annulerSelection()">
                        <b-icon icon="close-circle" type="is-info" size="is-medium"></b-icon>
                    </a>
                </div>
            </div>
            
        </div>
        <b-modal :active.sync="fenetreModalActive" has-modal-card>
            <new-album></new-album>
        </b-modal>

        <b-modal :active.sync="fenetreModalAddEvent" has-modal-card>
            <add-event :album="albumActuel"></add-event>
        </b-modal>

        <div v-for="album in albums" :key="album.id" class="shadow p-3 mb-5 bg-white rounded">
            <div class="">
                <div class="level is-flex-mobile">
                    <div class="level-left">
                        <h4 class="title is-4 has-text-info">{{album.name}}</h4>
                    </div>
                    <div class="level-right">
                        <a class="" @click="addEvent(album)" v-show="!etatSelectCheckbox">
                            <b-icon icon="plus-circle" type="is-info"></b-icon>
                        </a>
                        <a @click.prevent="actifAlbum(album)">
                            <b-icon icon="arrow-down-drop-circle" type="is-info"></b-icon>
                        </a>
                        <div class="level-left" v-show="etatSelectCheckbox" >
                            <b-checkbox v-model="album.selectionner"
                                type="is-info">
                            </b-checkbox>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <view-event-album :album="album" v-show="album.actif"></view-event-album>
            </div>
        </div>
    </div>
</template>

<script>
import {db, storage, auth} from '../../firebase'
import NewAlbum from './NewAlbum'
import AddEvent from './AddEvent'
import ViewEventAlbum from './ViewEventAlbum'

export default {
    name: 'album',
    components: { NewAlbum, AddEvent, ViewEventAlbum},
    data () {
        return {
            userId: auth.currentUser.uid,
            albums: [],
            fenetreModalActive: false,
            fenetreModalAddEvent: false,
            albumActuel: [],
            etatSelectCheckbox: false,
        }
    },
    computed: {
        albumsDbRef () {
            return db.ref('albums/' + this.userId)
        }
    },
    methods: {
        selectionner () {
            this.etatSelectCheckbox = true
        },
        annulerSelection () {
            this.etatSelectCheckbox = false
            this.albums.forEach((al) => {
                al.selectionner = false
            })
        },
        miseAJourAlbums () {
            console.log('miseajour')
            this.albums.forEach((al) => {
                this.albumsDbRef.child(al.id).update({...al})
            })
        },
        supprimer () {
            this.$dialog.confirm({
                title: 'Confirmation',
                message: 'Êtes-vous sûr de vouloir continuer ?',
                cancelText: 'Non',
                confimText: 'Oui',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {
                    this.miseAJourAlbums()
                    let al = this.albums.filter(al => al.selectionner === true)
                    al.forEach((al) => {
                        this.supprimerAlbum(al)
                    })
                    this.etatSelectCheckbox = false
                }, 
                onCancel: () => {
                    this.annulerSelection()
                    this.$toast.open({
                        message: 'Suppression annulée'
                    })
                }
            })
        },
        supprimerEventsAlbum (album) {
            var eventsAlbumDbRef = db.ref('eventsAlbums/' + album.id)
            var events
            eventsAlbumDbRef.on('child_added', snap => {
                events.push({...snap.val(), id: snap.key})
                events.forEach( (ev) =>{
                    storage.ref().child(e.imageRef).delete().then(() => {
                        console.log('supp image success')
                    }).catch( (error) => {
                        this.alertError(error.message)
                    })
                })
            })
            eventsAlbumDbRef.remove().then(() => {
                console.log('supp data success')
            }).catch( (error) => {
                this.alertError(error.message)
            })
        },
        supprimerAlbum (album) {
            this.supprimerEventsAlbum(album)
            this.albumsDbRef.child(album.id).remove().then(() => {
                console.log('supp data success')
            }).catch( (error) => {
                this.alertError(error.message)
            })
        },
        listenerAddAlbums () {
            this.albumsDbRef.on('child_added', snap => {
                this.albums.push({...snap.val()})
            })
        },
        listenerAlbumsSupp () {
            this.albumsDbRef.on('child_removed', snap => {
                const deleteAlbum = this.albums.find(al => al.id === snap.key)
                const index = this.albums.indexOf(deleteAlbum)
                this.albums.splice(index, 1)
            })
        },
        destroyListener () {
            this.albumsDbRef.off()
        },
        addEvent (album) {
            this.albumActuel = album
            this.fenetreModalAddEvent = true
        },
        actifAlbum (album) {
            album.actif = !album.actif
            console.log(album.actif)
            this.albumsDbRef.child(album.id).update({actif: album.actif})
        },
        alertError(message) {
            this.$toast.open({
                message: message,
                position: 'is-bottom',
                type: 'is-danger'
            })
        }
    },
    mounted () {
        this.listenerAddAlbums()
        this.listenerAlbumsSupp()
    },
    beforeDestroy () {
        this.destroyListener()
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
