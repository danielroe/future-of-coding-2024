<template>
  <div>
    <MalleableComponent />
    <form @submit.prevent="requestChanges">
      <input v-model="prompt" type="text" placeholder="Make everything better.">
      <button type="submit">Request changes</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import '@picocss/pico'
const malleables = reactive({
  query: `
  query {
  episodes(page: 1) {
    results {
      id
      name
      air_date
      created
      episode
      characters {
        name
        species
        gender
        origin {
          name
        }
        location {
          name
        }
      }
    }
  }
}
`,
  template: `
    <div class="container">
      <ul>
        <li v-for="result in data.data.episodes.results" :key="result.id">
          {{ result.name }}
        </li>
      </ul>
    </div>
    `
})
const MalleableComponent = defineComponent({
  async setup() {
    const { data } = await useFetch('https://rickandmortyapi.com/graphql', {
      method: 'POST',
      body: { query: malleables.query }
    })
    return () => h({
      data: () => ({ data: data.value }),
      template: malleables.template
    })
  },
})
const prompt = ref('')

async function requestChanges() {
  const result = await $fetch('/api/completion', {
    method: 'POST',
    body: {
      malleables,
      prompt: prompt.value
    }
  })
  Object.assign(malleables, result)
}
</script>
