<template>
  <div class="p-5 mb-4 rounded-3 tablecard">
    <div class="container-fluid py-5">
      <h1 class="display-5 fw-bold">Latest Data</h1>
      <h3>This is the data from the last 5h, it updates every 5 seconds</h3>

      <div class="table-responsive">
        <table class="table" style="color:white">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Temperature</th>
              <th scope="col">Humidity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="datapoint in data">
              <td>{{new Date( datapoint.reported_at)}}</td>
              <td>{{datapoint.decoded.payload[0].value}} celcius</td>
              <td>{{datapoint.decoded.payload[2].value}} %</td>
              <td><a style="color:white" :href="'https://explorer.helium.com/hotspots/'+ datapoint.hotspots[0].id">View Hotspot Details</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
    }
  },
  async asyncData({ $axios }) {
    const data = await $axios.$get('/.netlify/functions/output-last-5h')
    return { data }
  },
  methods: {
    regrabdata() {
      this.$axios
        .$get('/.netlify/functions/output-last-5h')
        .then((response) => {
          this.data = response
        })
    },
  },
  mounted() {
    // regrabdata() is called every 5 seconds
    setInterval(this.regrabdata, 5000)
  },
}
</script>

<style>
.tablecard {
  background-color: #8fa6cb;
  color: white;
}
</style>
