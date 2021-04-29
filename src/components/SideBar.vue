<template>
  <v-card
    v-show="sidebarShow"
    transition="scroll-x-transition"
    style="width: 350px"
  >
    <div>
      <v-tabs v-model="active_tab">
        <v-tab :key="0">
          <v-icon left> map </v-icon>
          {{ translate.opciones_mapa }}
        </v-tab>
        <v-tab :key="1">
          <v-icon left> settings </v-icon>
          {{ translate.opciones_filtro }}
        </v-tab>
        <v-tab :key="2">
          <v-icon left> help </v-icon>
          {{ translate.ayuda }}
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-flex xs12>
              <v-select
                @change="onChangeMap"
                :label="translate.menu"
                :items="map_menu.options"
                v-model="map_local"
                style="margin-right: 10px; margin-left: 10px"
              >
              </v-select>
              <v-container fluid>
                <p>{{ translate.visualizar }}</p>
                <v-radio-group mandatory color="primary" @change="onChangeLayer" v-model="show_layer">
                  <v-radio :label="translate.ubicacion" value="location"></v-radio>
                  <v-radio :label="translate.procedencia" value="procedence"></v-radio>
                </v-radio-group>
              </v-container>
              <Language :idioma="onChangeLan" />
            </v-flex>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-flex xs12>
              <v-combobox
                @change="onChangeMat"
                :label="translate.material"
                :items="items_sideBar[0].options"
                :prepend-icon="items_sideBar[0].icon"
                multiple
                v-model="items_sideBar[0].model"
                id="Material"
                style="margin-right: 10px; margin-left: 10px"
              ></v-combobox>
              <v-combobox
                @change="onChangeTec"
                :label="translate.tecnica"
                :items="items_sideBar[1].options"
                :prepend-icon="items_sideBar[1].icon"
                multiple
                v-model="items_sideBar[1].model"
                id="Technique"
                style="margin-right: 10px; margin-left: 10px"
              ></v-combobox>
              <v-combobox
                @change="onChangeCat"
                :label="translate.categoria"
                :items="items_sideBar[2].options"
                :prepend-icon="items_sideBar[2].icon"
                multiple
                v-model="items_sideBar[2].model"
                id="Category"
                style="margin-right: 10px; margin-left: 10px"
              ></v-combobox>
              <v-range-slider
                @change="onChangeDate"
                v-model="range"
                thumb-label
                :min="smin"
                :max="emax"
                prepend-icon="watch_later"
                style="margin-right: 10px; margin-left: 10px"
              ></v-range-slider>
              <v-btn
                style="margin-left: 10px"
                class="primary"
                @click="applyFilter()"
              >
                {{ translate.aplicar }}
              </v-btn>
              <v-btn
                style="margin-left: 10px"
                class="primary"
                @click="resetFilter()"
              >
                {{ translate.reset }}
              </v-btn>
            </v-flex>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-container style="margin-left: 30px;">
            <img
            src="../assets/legend/position.png"
            style="width:20px"
            /> {{ translate.position }}
            <br>
            <br>
            <img
            src="../assets/legend/cluster_low.png"
            style="width:20px"
            /> {{ translate.clusterlow }}
            <br>
            <br>
            <img
            src="../assets/legend/cluster_mid.png"
            style="width:20px"
            /> {{ translate.clustermid }}
            <br>
            <br>
            <img
            src="../assets/legend/cluster_high.png"
            style="width:20px"
            /> {{ translate.clusterhigh }}
          </v-container>
        </v-tab-item>
      </v-tabs>
    </div>
  </v-card>
</template>

<script>
import Language from "../components/Language.vue";
export default {
  name: "SideBar",
  components: {
    Language,
  },
  props: {
    show: {
      type: Function,
    },
    map_set: {
      type: Function,
    },
    layer_change: {
      type: Function,
    },
    map_change: {
      type: Function,
    },
    filter_change: {
      type: Function,
    },
    date_change: {
      type: Function,
    },
    apply: {
      type: Function,
    },
    translate_change: {
      type: Function,
    },
    sidebarShow: {
      type: Boolean,
    },
    geoJSON: {},
  },
  data() {
    return {
      active_tab: 0,
      drawer: true,
      map_local: null,
      map_menu: {
        title: "Map",
        icon: "map",
        options: ["Normal", "Topographic", "Dark"],
      },
      items_sideBar: [
        { title: "Material", icon: "carpenter", options: [], model: [] },
        { title: "Technique", icon: "brush", options: [], model: [] },
        { title: "Category", icon: "layers", options: [], model: [] },
      ],
      filters: [
        { title: "matFilter", filter: [] },
        { title: "tecFilter", filter: [] },
        { title: "catFilter", filter: [] },
      ],
      start: [],
      end: [],
      smin: null,
      emax: null,
      range: [],
      dateMin: null,
      dateMax: null,
      show_layer: 'procedence',
      translate: {},
    };
  },
  mounted() {
    this.map_local = localStorage.getItem("map_local") || "Normal";
    this.map_set(this.map_local);
  },
  methods: {

    onChangeLan: function (datos) {
      this.translate = datos;
      this.translate_change(datos);
    },

    loadInfo(value) {
      
      value.features.forEach((element) => {
        var exist = false;

        element.properties.category.split(" ; ").forEach((cat) => {
          for (let i = 0; i < this.items_sideBar[2].options.length; i++) {
            let cate = this.items_sideBar[2].options[i];
            cat = cat.trim();
            if (cate == cat) {
              exist = true;
            }
          }
          if (!exist) {
            this.items_sideBar[2].options.push(cat);
          }
          exist = false;
        });

        for (let i = 0; i < this.start.length; i++) {
          let cate = this.start[i];
          if (cate == element.properties.start) {
            exist = true;
          }
        }
        if (!exist) {
          if (!isNaN(parseInt(element.properties.start))) {
            this.start.push(parseInt(element.properties.start));
          }
        }
        exist = false;
          
        for (let i = 0; i < this.end.length; i++) {
          let cate = this.end[i];
          if (cate == element.properties.end) {
            exist = true;
          }
        }
        if (!exist) {
          if (!isNaN(parseInt(element.properties.end))) {
            this.end.push(parseInt(element.properties.end));
          }
        }
        exist = false;
      });


      //Load info into the range element
      this.smin = Math.min(...this.start);
      this.emax = Math.max(...this.end);
      this.dateMin = this.smin;
      this.dateMax = this.emax;
      this.range = [this.smin, this.emax];

      if (localStorage.getItem("help") != "2") {
        localStorage.setItem("help", "2");
        this.active_tab = 2;
        this.show();
      }
    },

    onChangeLayer(event) {
      this.layer_change(event);
    },

    onChangeMap(value) {
      localStorage.setItem("map_local", value);
      this.map_set(this.map_local);
      this.map_change();
    },

    onChangeDate(value) {
      this.dateMin = value[0];
      this.dateMax = value[1];
      if (this.dateMin == this.smin && this.dateMax == this.emax) {
        this.date_change(this.dateMin, this.dateMax, false);
      } else {
        this.date_change(this.dateMin, this.dateMax, true);
      }
    },

    onChangeMat(value) {
      this.filters[0].filter = [];
      value.forEach((element) => {
        this.filters[0].filter.push(element);
      });
    },

    onChangeTec(value) {
      this.filters[1].filter = [];
      value.forEach((element) => {
        this.filters[1].filter.push(element);
      });
    },

    onChangeCat(value) {
      this.filters[2].filter = [];
      value.forEach((element) => {
        this.filters[2].filter.push(element);
      });
    },

    applyFilter() {
      this.filter_change(this.filters);
      this.apply();
    },

    resetFilter() {
      this.items_sideBar[0].model = [];
      this.items_sideBar[1].model = [];
      this.items_sideBar[2].model = [];

      this.range = [this.smin, this.emax];

      this.filters[0].filter = [];
      this.filters[1].filter = [];
      this.filters[2].filter = [];

      this.dateMin = this.smin;
      this.dateMax = this.emax;

      this.filter_change(this.filters);
      this.date_change(this.dateMin, this.dateMax);

      this.applyFilter();
    },
  },
};
</script>
<style scoped>
.v-tabs-bar__content {
  flex-wrap: wrap;
  width: 100%;
}
div.v-tabs-bar {
  height: auto;
}
</style>