<template>
    <section>
    
        <button class="button is-primary is-medium"
            @click="cardModal()">
            Launch card modal 
        </button>
    </section>
</template>

<script>
    const ModalForm = {
        props: ['email', 'password'],
        template: `
            <form action="">
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">
                       
                    </header>
                    <section class="modal-card-body">
                     <p class="modal-card-title">Login</p>
                     <b-field label="Pseudo">
                            <b-input
                                type="text"
                                :value="text"
                                placeholder="{{pseudo}}"
                                required>
                            </b-input>
                        </b-field>

                        <b-field label="Email">
                            <b-input
                                type="email"
                                :value="email"
                                placeholder="{{email}}"
                                required>
                            </b-input>
                        </b-field>

                        <b-field label="Password">
                            <b-input
                                type="password"
                                :value="password"
                                password-reveal
                                placeholder="{{password}}"
                                required>
                            </b-input>
                        </b-field>

                        
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" type="button" @click="$parent.close()">Valider</button>
                        <button class="button is-primary">Modifier</button>
                    </footer>
                </div>
            </form>
        `
    }

    export default {
       name: 'mon-compte',
        methods: {
           
            cardModal() {
                this.$modal.open({
                    parent: this,
                    component: ModalForm,
                    hasModalCard: true
                })
            }
        }
    }
</script>