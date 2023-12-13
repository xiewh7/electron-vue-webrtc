<script setup>
import { ref,
  onMounted, onBeforeMount, nextTick
} from 'vue'
import { ipcRenderer } from 'electron'
import './peer-puppet'


const localCode = ref('')
const remoteCode = ref('')
const controlText = ref('')

const setLocalCode = (val) => {
  localCode.value = val
}

const setControlText = (val) => {
  controlText.value = val
}

const startControl = () => {
  console.log('startControl')
  ipcRenderer.send('control', remoteCode.value)
}

const login = async () => {
  console.log('login')
  const code = await ipcRenderer.invoke('login')
  setLocalCode(code)
}

const handleConrolState = (e, name, type) => {
  console.log('handleConrolState', e, name, type)
  setControlText('')
  if (type === 1) {
    setControlText(`正在远程控制${name}`)
  } else if (type === 2) {
    setControlText(`被${name}控制中`)
  }
}

onBeforeMount(() => {
  console.log('onBeforeMount')
  ipcRenderer.on('control-state-change', handleConrolState)
})

onMounted(() => {
  console.log('onMounted')
  nextTick(() => {
    login()
  })
})

</script>

<template>
  <div class="hello">
    <p class="status">{{controlText}}</p>
    你的验证码：<input v-model="localCode" disabled>
    输入对方的验证码：<input v-model="remoteCode">
    <button @click="startControl">确认</button>
  </div>
</template>
