import { read, write } from '@/workers/store'

read('imageCounts').then(res => {
  console.log(res)
})

console.log(process.env)
