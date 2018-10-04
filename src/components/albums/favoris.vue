<template>
    <div>
        <favorite name="favorite"></favorite>
        <script type="text/x-template" id="template-favorite">
            <div class="favoriting">
                <label
                        class="favorite__heart"
                        v-bind:class="{'favorite__heart__selected': value, 'is-disabled': disabled}"
                        v-on:click="favorite">
                    <input
                            class="favorite__checkbox"
                            type="checkbox"
                            v-bind:name="name"
                            v-bind:value="value"
                            v-bind:required="required"
                            v-bind:disabled="disabled"
                            v-model="value">
                    ❤
                </label>
            </div>
        </scipt>
    </div>
</template>

<scipt>
Vue.component('favorite', {
    template: '#template-favorite',
    data: function() {
        return { };
    },
    props: {
        'name': {
            type: String,
            default: 'favorite'
        },
        'value': {
            type: Boolean,
            default: false
        },
        'disabled': {
            type: Boolean,
            default: false
        }
    },
    methods: {
        favorite: function() {
            if (this.disabled==true) {
                return;
            }
            this.value = !this.value;
        }
    }
});


var app = new Vue({
   el: 'body'
});
</scipt>

<style>

.favoriting{
    display: inline-block
}
.favorite__heart {
    display: inline-block;
    padding: 3px;
    vertical-align: middle;
    line-height: 1;
    font-size: 16px;
    color: #ABABAB;
    cursor: pointer;
    -webkit-transition: color .2s ease-out;
    transition: color .2s ease-out;
}
.favorite__heart.is-disabled:hover {
     cursor: default;
 }
.favorite__checkbox {
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
}
.favorite__heart__selected{
    color: #df470b;
}
</style>

