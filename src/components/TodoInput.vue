<script setup>
import { ref } from 'vue'

// 1. 声明 emit：告诉 Vue 这个子组件会触发一个叫 'add' 的事件
const emit = defineEmits(['add'])

// 2. 本地 ref：存输入框当前的文字
const inputText = ref('')

// 3. 点击按钮时：如果输入不为空，就 emit 给父组件，并清空输入框
const handleAdd = () => {
  const text = inputText.value.trim()
  if (!text) return
  emit('add', text)
  inputText.value = ''
}
</script>

<template>
  <div class="todo-input">
    <input
      v-model="inputText"
      type="text"
      placeholder="输入要买的东西..."
      @keyup.enter="handleAdd"
    />
    <button @click="handleAdd">添加</button>
  </div>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 10px;
  padding: 0 20px 20px;
}
.todo-input input {
  flex: 1;
  padding: 10px 14px;
  font-size: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}
.todo-input input:focus {
  border-color: #4f8cff;
}
.todo-input button {
  padding: 10px 20px;
  font-size: 15px;
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.todo-input button:hover {
  background: #3a78e6;
}
</style>