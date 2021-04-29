<template>
  <v-app>
    <v-main>
      <v-overlay class="overlay-progress" :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <div class="map-overlay">
        <v-toolbar dense width="400">
          <v-text-field
            hide-details
            prepend-icon="mdi-magnify"
            single-line
          ></v-text-field>
          
          <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            v-bind="attrs"
            v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
          </template>

          <!-- <v-dialog
          style="z-index: 99999;"
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="light"
          light
          v-bind="attrs"
          v-on="on"
        >
          {{ translate.busqueda }}
        </v-btn>
      </template>
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ translate.busqueda }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="dialog = false"
            >
              {{ translate.aplicar }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list
        style="margin-left: 150px; margin-right:150px"
          three-line
          subheader
        >
          <v-list-item >
            <v-list-item-content>
              <v-text-field
                :label= translate.buscar 
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-subheader>{{ translate.filtros_g }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ translate.material }}</v-list-item-title>
              <v-select>
              </v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ translate.tecnica }}</v-list-item-title>
              <v-select>
              </v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ translate.categoria }}</v-list-item-title>
              <v-select>
              </v-select>
            </v-list-item-content>
          </v-list-item>
          
        </v-list>
        <v-divider></v-divider>
        <v-list
        style="margin-left: 150px; margin-right:150px"
          three-line
          subheader
        >
          <v-subheader>{{ translate.filtros_a }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ translate.museo }}</v-list-item-title>
              <v-select>
              </v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ translate.autor }}</v-list-item-title>
              <v-select>
              </v-select>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog> -->
    <v-dialog
      v-model="dialog"
      style="z-index: 99999;"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="light"
          light
          v-bind="attrs"
          v-on="on"
        >
          {{ translate.busqueda }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ translate.busqueda }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :label="translate.buscar"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
              <v-select
              :label="translate.material">
              </v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
              :label="translate.tecnica">
              </v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
              :label="translate.categoria">
              </v-select>
              </v-col>

              <v-divider></v-divider>
              
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
              :label="translate.museo">
              </v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
              :label="translate.autor">
              </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            {{translate.cerrar}}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            {{translate.aplicar}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

          </v-menu>
        </v-toolbar>
        <v-card v-if="selectedMarker" width="400" class="card-description">
          <v-img height="300px" v-if="loadedImage" :src="selectedImage" @error="objectImageLoadError"> </v-img>
          <v-card-title> {{ selectedMarker.title }}</v-card-title>
          <v-card-text>
            <v-btn
              depressed
              color="primary"
              :href="selectedMarkerUri"
              target="_blank"
            >
              {{ translate.ceres }}
              <v-icon dark right> launch </v-icon>
            </v-btn>
            <div class="my-4 subtitle-2">
              <p class="text-justify" v-if="selectedMarker.located.label">
                <v-icon left>museum</v-icon> {{ selectedMarker.located.label }}
              </p>
              <p class="text-justify" v-if="selectedMarker.procedence">
                <v-icon left>place</v-icon> {{ selectedMarker.procedence }}
              </p>
              <p
                class="text-justify"
                v-if="selectedMarker.start || selectedMarker.end"
              >
                <v-icon left>date_range</v-icon>
                {{ selectedMarker.start }} -
                {{ selectedMarker.end }}
              </p>
              <p class="text-justify" v-if="selectedMarker.category">
                <v-icon left>category</v-icon>
                {{ selectedMarker.category }}
              </p>
            </div>
            <div v-if="selectedMarker.description">
              <p class="text-justify">
                {{ selectedMarker.description }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </div>
      <div class="timeline-overlay" v-if="timeline">
        <v-toolbar dense color="primary" style="margin-top: -7px" dark>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>skip_previous</v-icon>
              </v-btn>
            </template>
            <span>{{ translate.anterior }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>play_arrow</v-icon>
              </v-btn>
            </template>
            <span>{{ translate.reproducir }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>skip_next</v-icon>
              </v-btn>
            </template>
            <span>{{ translate.siguiente }}</span>
          </v-tooltip>
          <v-slider
            align="center"
            justify="center"
            v-model="seasons"
            ticks
            thumb-label
            tick-size="4"
          ></v-slider>
        </v-toolbar>
      </div>

      <!-- SliderBar -->
      <div class="map-parent">
        <SideBar
          :layer_change="onChangeLayer"
          :map_set="onChangeMapLocal"
          :map_change="onChangeMap"
          :translate_change="onChangeTranslate"
          :sidebarShow="sidebarShow"
          :filter_change="onChangeFilter"
          :date_change="onChangeDate"
          :apply="applyFilter"
          :geoJSON="geoJSON"
          :show="show"
          ref="sideBarComponent"
        />

        <div id="mapid">
          <v-btn
            style="z-index: 99999; margin-top: 30px"
            color="indigo"
            fab
            dark
            absolute
            small
            top
            left
            @click="sidebarShow = !sidebarShow"
          >
            <v-icon v-if="!sidebarShow">settings</v-icon>
            <v-icon v-else>close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import L from "leaflet";
import moment from "moment";
import "../assets/leaflet/leaflet.css";
require("../assets/leaflet-providers");
require("../assets/Leaflet.markercluster-1.4.1/leaflet.markercluster-src");
require("../assets/Leaflet.markercluster-1.4.1/MarkerCluster.css");
require("../assets/Leaflet.markercluster-1.4.1/MarkerCluster.Default.css");
require("../assets/leaflet.timeline/leaflet.timeline");
require("../assets/leaflet.timeline/leaflet.timeline.css");
require("../assets/leaflet.markercluster.layersupport");
import utf8 from "utf8";
//import geoJSON from "../assets/semap5.json";
import colorDictionary from "../components/colorDictionary";
//sidebar
import SideBar from "../components/SideBar.vue";

export default {
  name: "MapView",
  components: {
    SideBar,
  },
  props: {},
  data() {
    return {
      map: null,
      myTileLayer: null,
      selectedMarker: null,
      timeline: false,
      seasons: [134, 1500, 1600, 1800],

      translate: {},

      sidebarShow: false,
      map_local: null,
      filters: [],
      dateMin: null,
      dateMax: null,
      dateF: false,

      locationLayer: null,
      procedenceLayer: null,
      geoJSON: null,
      overlay:true,
      loadedImage:false,
      dialog:false,
    };
  },
  computed: {
    selectedImage: function () {
      if (this.selectedMarker) {
        var m = this.selectedMarker;
        return (
          "http://ceres.mcu.es/pages/Viewer?accion=42&Museo=&AMuseo=" +
          m.located.id +
          "&Ninv=" +
          m.inventary +
          "&txt_id_imagen=1"
        );
      } else return "";
    },
    selectedMarkerUri: function () {
      if (this.selectedMarker) {
        var m = this.selectedMarker;
        return (
          "http://ceres.mcu.es/pages/Main?idt=" +
          m.identifier +
          "&inventary=" +
          m.inventary +
          "&table=FMUS&museum=" +
          m.located.id
        );
      } else return "";
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    //Init Map
    this.map = L.map("mapid", { minZoom: 4, maxZoom: 15 }).setView(
      [45.46, 20],
      2
    );

    //Local-storage
    switch (this.map_local) {
      case "Normal":
        this.myTileLayer = L.tileLayer(
          "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              'Map data &copy; <a href="http://..org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            maxZoom: 15,
          }
        );
        break;
      case "Topographic":
        this.myTileLayer = L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 15,
            attribution:
              'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          }
        );
        break;
      case "Dark":
        this.myTileLayer = L.tileLayer(
          "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
          {
            maxZoom: 15,
            attribution:
              '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          }
        );
        break;
      default:
        break;
    }

    this.myTileLayer.addTo(this.map);
    //L.tileLayer.provider("Esri.WorldStreetMap").addTo(this.map);

    this.locationLayer = L.layerGroup();
    this.procedenceLayer = L.layerGroup();
  },
  methods: {
    objectImageLoadError: function(){
      this.loadedImage = false;
    },
    show: function () {
      this.sidebarShow = true;
    },
    loadInfo: function () {
      //this.$refs.sideBarComponent.loadInfo(this.geoJSON);
    },
    fetchData: function () {
      var self = this;
      fetch("https://www.uv.es/semap/mapa/semap5.min.geojson")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          self.geoJSON = json;
          self.loadGeoJSON();
          self.loadInfo();
        })
        .catch(function (error) {
          debugger;
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });
    },
    loadGeoJSON: function () {
      /* CLUSTERING */

      var self = this;
      // Load GEOJSON information and apply conditional styles
      var geoJSONLayer = L.geoJSON(this.geoJSON, {
        pointToLayer: function (feature, latlng) {
          var customIcon = self.generateIcon(feature.properties.category[0]);
          return L.marker(latlng, { icon: customIcon });
        },
        onEachFeature: this.onEachFeature,
      });

      function updateProgressBar(processed, total, elapsed, layersArray) {
			if (elapsed > 1000) {
        console.log("init clustering");

			}

			if (processed === total) {
				console.log("All markers processed");
        console.log(elapsed);
			}
		}
      // Generate MarkerClusterGroups
      var mcgOptions = {
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 120,
        chunkedLoading: true,
        chunkProgress: updateProgressBar 
      };
      var markerGroupLocation = L.markerClusterGroup.layerSupport(mcgOptions);
      var markerGroupProcedence = L.markerClusterGroup.layerSupport(mcgOptions);

      markerGroupLocation.addTo(this.map);
      markerGroupLocation.checkIn(this.locationLayer);
      markerGroupProcedence.addTo(this.map);
      markerGroupProcedence.checkIn(this.procedenceLayer);

      //this.locationLayer.addTo(this.map);
      this.procedenceLayer.addTo(this.map);
      /* CLUSTERING */

      /* TIMELINE *
    var self = this;
    var timeline = L.timeline();
    var timelineControl = L.timelineSliderControl({
      formatOutput: function (date) {
        return moment(date).format("YYYY");
      },
      enableKeyboardControls: true,
    });
    timeline.addTo(this.map);
    timelineControl.addTo(this.map);
    timelineControl.addTimelines(timeline);
    /* TIMELINE */

      //Listen to Click event on map to de-select marker
      this.map.on(
        "click",
        function (e) {
          this.selectedMarker = null;
        },
        this
      );
      this.overlay = false;
    },

    onChangeLan: function (datos) {
      this.translate = datos;
    },

    onChangeMapLocal: function (datos) {
      this.map_local = datos;
    },

    onEachFeature: function (feature, layer) {
      var self = this;
      layer.on("click", function (e) {
        if (feature.properties) {
          self.selectedMarker = feature.properties;
          self.loadedImage = true;
        }
      });
      let cont = 0;
      layer.eachLayer(function (l) {
        //Cambiar orden cuando javi corrija los datos
        if (cont == 0) self.locationLayer.addLayer(l);
        else self.procedenceLayer.addLayer(l);
        cont++;
      });
    },

    generateIcon: function (feature) {
      var x = colorDictionary[feature];
      if (typeof myVar == "undefined") x = "#02AC66";
      const markerHtmlStyles = `
        background-color: ${x};
        width: 2rem;
        height: 2rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`;

      const customIcon = L.divIcon({
        className: "my-custom-pin",
        iconAnchor: [-8, 16],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`,
      });
      return customIcon;
    },

    updateValue(value) {
      console.log(value);
    },
    onChangeLayer(value) {
      if (value == "procedence") {
        this.map.removeLayer(this.locationLayer);
        this.procedenceLayer.addTo(this.map);
      } else {
        this.map.removeLayer(this.procedenceLayer);
        this.locationLayer.addTo(this.map);
      }
    },
    onChangeMap() {
      this.map.removeLayer(this.myTileLayer);
      switch (this.map_local) {
        case "Normal":
          this.myTileLayer = L.tileLayer(
            "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                'Map data &copy; <a href="http://..org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
              maxZoom: 18,
            }
          );
          break;
        case "Topographic":
          this.myTileLayer = L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 17,
              attribution:
                'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            }
          );
          break;
        case "Dark":
          this.myTileLayer = L.tileLayer(
            "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
            {
              maxZoom: 20,
              attribution:
                '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            }
          );
          break;
        default:
          break;
      }
      this.myTileLayer.addTo(this.map);
    },

    onChangeTranslate(datos) {
      this.translate = datos;
    },

    onChangeFilter(datos) {
      this.filters = datos;
    },

    onChangeDate(datos1, datos2, datos3) {
      this.dateMin = datos1;
      this.dateMax = datos2;
      this.dateF = datos3;
    },

    applyFilter() {
      var self = this;

      //Clear Layers
      self.locationLayer.eachLayer(function (layer) {
        self.locationLayer.removeLayer(layer);
      });
      self.procedenceLayer.eachLayer(function (layer) {
        self.procedenceLayer.removeLayer(layer);
      });

      // Load GEOJSON information and apply conditional styles
      var geoJSONLayer = L.geoJSON(this.geoJSON, {
        pointToLayer: function (feature, latlng) {
          var customIcon = self.generateIcon(feature.properties.category[0]);
          return L.marker(latlng, { icon: customIcon });
        },
        filter: function (feature, layer) {
          let aux = [];
          if (
            (!(
              isNaN(parseInt(feature.properties.start)) ||
              isNaN(parseInt(feature.properties.end))
            ) &&
              parseInt(feature.properties.start) >= self.dateMin &&
              parseInt(feature.properties.end) <= self.dateMax) ||
            (parseInt(feature.properties.end) >= self.dateMin &&
              parseInt(feature.properties.end) <= self.dateMax) ||
            (parseInt(feature.properties.start) >= self.dateMin &&
              parseInt(feature.properties.start) <= self.dateMax) ||
            !self.dateF
          ) {
            var foundMat = false;
            var foundTec = false;
            var foundCat = false;

            if (self.filters[0].filter.length != 0) {
              self.filters[0].filter.forEach((element) => {
                aux = feature.properties.material.split(" ; ");
                if(aux.includes(element)){
                  foundMat = true;
                }
                // if (feature.properties.material.indexOf(element) > -1) {
                  
                // }
              });
            } else {
              foundMat = true;
            }

            if (self.filters[1].filter.length != 0 && foundMat) {
              self.filters[1].filter.forEach((element) => {
                aux = feature.properties.technique.split(" ; ");
                if(aux.includes(element)){
                  foundTec = true;
                }
                // if (feature.properties.technique.indexOf(element) > -1) {
                //   foundTec = true;
                // }
              });
            } else {
              foundTec = true;
            }

            if (self.filters[2].filter.length != 0 && foundTec) {
              self.filters[2].filter.forEach((element) => {
                aux = feature.properties.category.split(" ; ");
                if(aux.includes(element)){
                  foundCat = true;
                }
                // if (feature.properties.category.indexOf(element) > -1) {
                //   foundCat = true;
                // }
              });
            } else {
              foundCat = true;
            }
            return foundCat && foundTec && foundMat;
          }
        },
        onEachFeature: this.onEachFeature,
      });

      this.map.on(
        "click",
        function (e) {
          this.selectedMarker = null;
        },
        this
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map-parent {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
}
#mapid {
  flex: 1;
}
.map-overlay {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 999;
  display: block;
}
.card-description {
  max-height: 85vh;
  overflow-y: auto;
}
.timeline-overlay {
  position: absolute;
  bottom: 0px;
  height: 160px;
  right: 0px;
  z-index: 999;
  display: block;
  background: rgba(0, 0, 0, 0.1);
  width: 100vw;
}
.overlay-progress{
  z-index: 99999 !important;
}
</style>