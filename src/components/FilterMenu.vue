<template>
  <v-card>
    <v-container fluid>
      <v-row align="start" class="chips-row">
        <v-menu
          v-model="filterDropdown.technique"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              rounded
              text
              :color="techniqueColor"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              {{ techniqueLabel }}
              <v-icon right> mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-card max-height="350" tile>
            <v-list-item-group
              subheader
              v-model="selectedFilters.technique"
              multiple
            >
              <v-list-item
                v-for="(item, index) in techniqueDictionary"
                :key="index"
                :value="item.id"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action style="margin-right: 10px !important">
                    <v-checkbox
                      small
                      :input-value="active"
                      color="primary"
                    ></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-subtitle>{{
                      item.nombre
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="clearTechniqueFilter()">
                Borrar
              </v-btn>
              <v-btn color="primary" text @click="applyFilter()"> Hecho </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-menu
          v-model="filterDropdown.material"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              rounded
              text
              :color="materialColor"
              outlined
              v-bind="attrs"
              v-on="on"
            >
               {{ materialLabel }}
              <v-icon right> mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-card max-height="350" tile>
            <v-list-item-group
              subheader
              v-model="selectedFilters.material"
              multiple
            >
              <v-list-item
                v-for="(item, index) in materialDictionary"
                :key="index"
                :value="item.id"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action style="margin-right: 10px !important">
                    <v-checkbox
                      small
                      :input-value="active"
                      color="primary"
                    ></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-subtitle
                      >{{ item.nombre }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="clearMaterialFilter()">
                Borrar
              </v-btn>
              <v-btn color="primary" text @click="applyFilter()"> Hecho </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-menu
          v-model="filterDropdown.category"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              rounded
              text
              :color="categoryColor"
              outlined
              v-bind="attrs"
              v-on="on"
            >
               {{ categoryLabel }}
              <v-icon right> mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-card max-height="350" tile>
            <v-list-item-group
              subheader
              v-model="selectedFilters.category"
              multiple
            >
              <v-list-item
                v-for="(item, index) in categoryDictionary"
                :key="index"
                :value="item.id"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action style="margin-right: 10px !important">
                    <v-checkbox
                      small
                      :input-value="active"
                      color="primary"
                    ></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-subtitle>{{
                      item.nombre
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="clearCategoryFilter()">
                Borrar
              </v-btn>
              <v-btn color="primary" text @click="applyFilter()"> Hecho </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-row>
      <v-row align="start" class="chips-row">
        <v-menu v-model="filterDropdown.museum" :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              rounded
              text
              :color="museumColor"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              {{museumLabel}}
              <v-icon right> mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-card max-height="450" width="600" tile>
  

            <v-list-item-group
              subheader
              v-model="selectedFilters.museum"
              multiple
            >
              <v-list-item
                v-for="(item, index) in museumDictionary"
                :key="index"
                :value="item.idmuseo"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action style="margin-right: 10px !important">
                    <v-checkbox
                      small
                      :input-value="active"
                      color="primary"
                    ></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-subtitle
                      >{{ item.museo }} ({{ item.acronimo }})
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group> 
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="clearMuseumFilter()"> Borrar </v-btn>
              <v-btn color="primary" text @click="applyFilter()"> Hecho </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-menu v-model="filterDropdown.country" :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              rounded
              text
              :color="countryColor"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              {{countryLabel}}
              <v-icon right> mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-card max-height="350" tile>
  

            <v-list-item-group
              subheader
              v-model="selectedFilters.country"
              multiple
            >
              <v-list-item
                v-for="(item, index) in countryDictionary"
                :key="index"
                :value="item.id"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action style="margin-right: 10px !important">
                    <v-checkbox
                      small
                      :input-value="active"
                      color="primary"
                    ></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-subtitle
                      >{{ item.nombre }} 
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group> 
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="clearCountryFilter()"> Borrar </v-btn>
              <v-btn color="primary" text @click="applyFilter()"> Hecho </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-menu v-model="filterDropdown.time" :close-on-content-click="false" >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              rounded
              text
              :color="centuryColor"
              outlined
              v-bind="attrs"
              v-on="on"
              :disabled="timelineShow"
            >
              {{centuryLabel}}
              <v-icon right> mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-card max-height="350" tile>
  

            <v-list-item-group
              subheader
              v-model="selectedFilters.time"
              multiple
            >
              <v-list-item
                v-for="(item, index) in centuryDictionary"
                :key="index"
                :value="item.id"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action style="margin-right: 10px !important">
                    <v-checkbox
                      small
                      :input-value="active"
                      color="primary"
                    ></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-subtitle
                      >{{ item.name }} 
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group> 
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="clearCenturyFilter()"> Borrar </v-btn>
              <v-btn color="primary" text @click="applyFilter()"> Hecho </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "FilterMenu",
  components: {},
  props: {
    categoryDictionary: {
      type: Array,
    },
    materialDictionary: {
      type: Array,
    },
    techniqueDictionary: {
      type: Array,
    },
    museumDictionary: {
      type: Array,
    },
    countryDictionary: {
      type: Array,
    },
    centuryDictionary: {
      type: Array,
    },
    apply: {
      type: Function,
    },
     timelineShow: {
      type: Boolean,
    },
  },
  data() {
    return {
      filterDropdown: {
        technique: false,
        material: false,
        category: false,
        museum: false,
        country: false,
        time: false,
      },
      selectedFilters: {
        technique: [],
        material: [],
        category: [],
        museum: [],
        country: [],
        time: [],
      },
      settings: null,
    };
  },
  mounted() {},
  computed: {
    techniqueLabel: function () {
      var label = "";
      if (!this.selectedFilters) return "Clasificación";
      switch (this.selectedFilters.technique.length) {
        case 0:
          label = "Clasificación";
          break;
        case 1:
          label = this.selectedFilters.technique.length + " clasificación";
          break;
        default:
          label = this.selectedFilters.technique.length + " clasificaciones";
          break;
      }
      return label;
    },
    materialLabel: function () {
      var label = "";
      if (!this.selectedFilters) return "Material";
      switch (this.selectedFilters.material.length) {
        case 0:
          label = "Material";
          break;
        case 1:
          label = this.selectedFilters.material.length + " material";
          break;
        default:
          label = this.selectedFilters.material.length + " materiales";
          break;
      }
      return label;
    },
    categoryLabel: function () {
      var label = "";
      if (!this.selectedFilters) return "Categoría";
      switch (this.selectedFilters.category.length) {
        case 0:
          label = "Categoría";
          break;
        case 1:
          label = this.selectedFilters.category.length + " categoría";
          break;
        default:
          label = this.selectedFilters.category.length + " categorías";
          break;
      }
      return label;
    },
    museumLabel: function () {
      var label = "";
      if (!this.selectedFilters) return "Museo";
      switch (this.selectedFilters.museum.length) {
        case 0:
          label = "Museo";
          break;
        case 1:
          label = this.selectedFilters.museum.length + " museo";
          break;
        default:
          label = this.selectedFilters.museum.length + " museos";
          break;
      }
      return label;
    },
    countryLabel: function () {
      var label = "";
      if (!this.selectedFilters) return "País";
      switch (this.selectedFilters.country.length) {
        case 0:
          label = "País";
          break;
        case 1:
          label = this.selectedFilters.country.length + " país";
          break;
        default:
          label = this.selectedFilters.country.length + " paises";
          break;
      }
      return label;
    },
    centuryLabel: function () {
      var label = "";
      if (!this.selectedFilters) return "Siglo";
      switch (this.selectedFilters.time.length) {
        case 0:
          label = "Siglo";
          break;
        case 1:
          label = this.selectedFilters.time.length + " siglo";
          break;
        default:
          label = this.selectedFilters.time.length + " siglos";
          break;
      }
      return label;
    },
    techniqueColor: function () {
      if (this.selectedFilters.technique.length > 0) return "primary";
      else return "secondary";
    },
    materialColor: function () {
      if (this.selectedFilters.material.length > 0) return "primary";
      else return "secondary";
    },
    categoryColor: function () {
      if (this.selectedFilters.category.length > 0) return "primary";
      else return "secondary";
    },
    museumColor: function () {
      if (this.selectedFilters.museum.length > 0) return "primary";
      else return "secondary";
    },
    countryColor: function () {
      if (this.selectedFilters.country.length > 0) return "primary";
      else return "secondary";
    },
    centuryColor: function () {
      if (this.selectedFilters.time.length > 0) return "primary";
      else return "secondary";
    },
  },
  methods: {
    clearTechniqueFilter: function()
    {
        this.selectedFilters.technique= [];
        this.applyFilter();
    },
    clearMaterialFilter: function()
    {
        this.selectedFilters.material= [];
        this.applyFilter();
    },
    clearCategoryFilter: function()
    {
        this.selectedFilters.category= [];
        this.applyFilter();
    },
    clearMuseumFilter: function()
    {
        this.selectedFilters.museum= [];
        this.applyFilter();
    },
    clearCountryFilter: function()
    {
        this.selectedFilters.country= [];
        this.applyFilter();
    },
    clearCenturyFilter: function()
    {
        this.selectedFilters.time= [];
        this.applyFilter();
    },
    applyFilter: function () {
      this.apply(this.selectedFilters);
    },
  },
};
</script>
<style scoped>
.chips-row {
  padding-bottom: 5px !important;
}
.chips-row > .v-btn {
  margin-right: 5px !important;
}
.chips-row > .v-btn:first-child {
  margin-left: 5px !important;
}
.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-list-item-group {
  flex-grow: 1;
  overflow: auto;
}
</style>