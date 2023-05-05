import { defineStore } from 'pinia'
import { ref } from 'vue'
import usePdt from './usePdt'

defineStore('sheet', () => {
  const list = ref([])
  const addSheet = () => {
    //
  }
  return {
    list,
    addSheet
  }
})
