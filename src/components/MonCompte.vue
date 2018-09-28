<template>
  <section>
    <form>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
           <p class="modal-card-title has-text-centered">Mon Compte</p>
          </header>
          <section class="modal-card-body">
            <div class="container">
              <div class="row">
                <div class="col-sm-8 col-md-5 py-4">
                  <b-field>
                    <b-upload v-model="dropFiles"
                    multiple
                    drag-drop >
                      <section class="section">
                        <div class="content has-text-centered " id="profilContainer">
                          <p>
                            <b-icon icon="upload" size="is-large"> </b-icon>
                          </p>
                           <p>Ajouter Photo de profil</p>
                            <span v-for="(file, index) in dropFiles"
                              :key="index"
                              class="tag is-primary" >
                              {{file.name}}
                                <button class="delete is-small"
                                type="button"
                                @click="deleteDropFile(index)">
                                </button>
                            </span>
                        </div>
                      </section>
                    </b-upload>
                  </b-field>
                </div>
                <div class="col-sm-4 py-4">
                  <b-field label="Pseudo">
                    <b-input
                    type="text"
                    :value="pseudo"
                    placeholder="Votre Pseudo "
                    required>
                    </b-input>
                  </b-field> 
                  <b-field label="Email">
                    <b-input
                    type="email"
                    :value="email"
                    placeholder="Votre email"
                    required>
                    </b-input>
                  </b-field>
                  <b-field label="Mot de passe">
                    <b-input
                    type="password"
                    :value="password"
                    password-reveal
                    placeholder="Votre mot de passe"
                    required>
                    </b-input>
                  </b-field>
                </div>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <a class="button is-info is-outlined is-rounded" @click="$parent.close()">Fermer</a>
            <a class="button is-info is-outlined is-rounded" 
            @click="selectionner()"
            v-show="!etatSelectCheckbox">Modifier</a>
            <a class="button is-info is-outlined is-rounded" 
            @click="annulerSelection()" 
            v-show="etatSelectCheckbox">Annuler</a>
          </footer>
        </div>
    </form>
</section>
</template>
<script>
  import {db,auth} from '../firebase'
  export default {
    name: 'mon-compte',
data() {
return {
etatModifierMonCompte: false,
isComponentModalActive: false,
userRef: db.ref('users/'+auth.currentUser.ui),
dropFiles: []
}
} ,
methods: {
selectionner () {
this.etatSelectCheckbox = true
},
deleteDropFile(index) {
this.dropFiles.splice(index, 1)
}
}
}
</script>

<style scoped>
  #profilContainer{
    border:50%;
}
</style>

