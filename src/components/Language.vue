<template>
<p></p>
       <!--  <v-select
        :label="translate.idioma"
        @change="onChangeLan"
        :items="language.options"
        v-model="lang"
        style="width: 330px; z-index: 99999; margin-top: 15px; margin-right: 10px; margin-left: 10px"
        >
    </v-select> -->
</template>

<script>
import langJSON from "../assets/translate.json";

export default {
    name: "Language",
    props: {
        idioma: {
            type: Function
        }
    },
    data() {
        return {
            language: { title: "Language", icon: "language", options: ["ESPAÑOL", "ENGLISH", "CATALÀ", "GALEGO"], number: 4},
            lang: null,
            translate: [],
            textCSV: null,
        };
    },
    mounted() {
        this.lang = localStorage.getItem('lang') || 'ES';
        switch (this.lang) {
            case "ESPAÑOL":
                this.translate = langJSON.es;
                break;
            case "ENGLISH":
                this.translate = langJSON.en;
                break;
            case "CATALÀ":
                this.translate = langJSON.ca;
                break;
            case "GALEGO":
                this.translate = langJSON.ga;
                break;
            default:
                this.translate = langJSON.es;
                break;
        }
        this.idioma(this.translate);
    },
    methods: {
        onChangeLan(value) {
            localStorage.setItem('lang', value);
            this.lang = localStorage.getItem('lang');
            switch (this.lang) {
                case "ESPAÑOL":
                this.translate = langJSON.es;
                break;
                case "ENGLISH":
                this.translate = langJSON.en;
                break;
                case "CATALÀ":
                this.translate = langJSON.ca;
                break;
                case "GALEGO":
                this.translate = langJSON.ga;
                break;
                default:
                break;
            }
            this.idioma(this.translate);
        },
    },
};
</script>