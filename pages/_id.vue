<template>
  <div class="p-5 mb-4 rounded-3 tablecard">
    <div class="container-fluid py-5">
      <h1 class="display-5 fw-bold">Device {{ this.$route.params.id }}</h1>
      <h1 class="display-5 fw-bold">Latest Data</h1>
      <h3>This is the data from the last 30 days, it updates every minute</h3>

      <div class="table-responsive">
        <table class="table" style="color:white">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Temperature</th>
              <th scope="col">CO2</th>
              <th scope="col">PM 1.0</th>
              <th scope="col">PM 2.5</th>
              <th scope="col">PM 10.0</th>
              <th scope="col">NoX</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="datapoint in data">
              <td>{{new Date( datapoint.reported_at)}}</td>
              <td>{{datapoint.temp}} celcius</td>
              <td>{{datapoint.ppm}}</td>
              <td>{{datapoint.pm01}}</td>
              <td>{{datapoint.pm25}}</td>
              <td>{{datapoint.pm10}}</td>
              <td>{{datapoint.noX}} V</td>
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
  async asyncData({ $axios, params }) {
    const data = await $axios.$get('/.netlify/functions/output-last-5h')
    return { 
      data: data.filter(item => item.device === parseInt(params.id))
    }
  },
  methods: {
    regrabdata() {
      const routeID = this.$route.params.id; // Assign the route ID to a local variable
      this.$axios
        .$get('/.netlify/functions/output-last-5h')
        .then(response => { 
          this.data = response.filter(item => item.device == routeID); // Assign the filtered data to the component's data property
        })
    },
  },
  mounted() {
    // regrabdata() is called every 5 seconds
    setInterval(this.regrabdata, 60000)
  },
}
</script>

<style>
.tablecard {
  background-color: #403D39;
  color: white;
}
</style>
