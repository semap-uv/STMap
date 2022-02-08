<template>
  <v-card     
    v-show="timelineShow"
    transition="scroll-y-transition"
    style="height:100px; position: absolute; bottom: 5px; right:5px; left:5px; z-index: 999999;">
     <div>
    <v-card-text>
      <v-slider
        v-model="centuries"
        :tick-labels="centuryLabels"
        :max="centuryLabels.length - 1"
        step="1"
        ticks="always"
        tick-size="4"
        :thumb-size="48"
        thumb-label="always"
        v-on:mousedown.stop
        v-on:mouseup.stop
        v-on:click.stop
        v-on:mousemove.stop
        v-on:pointerdown.stop="event.preventDefault"
        @end="updateTimeFilter"
      >
        <template v-slot:thumb-label="{}">
          {{ selectedCenturyLabel }}
        </template>
      </v-slider>
    </v-card-text>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "Timeline",
  props: {
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
  components: {},
  data() {
    return {
      centuries: 0,
    };
  },
  mounted() {},
  computed: {
    selectedCenturyLabel: function () {
      {
        if (
          this.centuryDictionary != null &&
          this.centuryDictionary.length > 0 &&
          this.centuryDictionary[this.centuries]
        ) {
          return this.centuryDictionary[this.centuries].name;
        } else {
          return "";
        }
      }
    },
    centuryLabels: function () {
      if (this.centuryDictionary != null && this.centuryDictionary.length > 0)
        return this.centuryDictionary.map((c) => c.id);
      else return [];
    },
  },
  methods: {
    updateTimeFilter(value) {
      this.apply(this.centuryDictionary[value].id);
    },
  },
};
</script>
<style scoped>

</style>