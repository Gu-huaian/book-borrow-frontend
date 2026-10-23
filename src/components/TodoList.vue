<script setup>
// 1. 声明 props：告诉 Vue 父组件会传一个叫 'list' 的数组给我
const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
})

// 2. 声明 emit：触发 'delete' 事件，把要删除的 index 传给父组件
const emit = defineEmits(['delete'])
</script>

<template>
  <ul class="todo-list">
    <li v-if="list.length === 0" class="empty">
      还没有东西，快去添加吧！
    </li>
    <li v-for="(item, index) in list" :key="index" class="todo-item">
      <span class="item-text">{{ item }}</span>
      <button class="delete-btn" @click="emit('delete', index)">删除</button>
    </li>
  </ul>
</template>

<style scoped>
.todo-list {
  list-style: none;
  margin: 0;
  padding: 0 20px 30px;
}
.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f7f8fa;
  border-radius: 8px;
  border: 1px solid #eee;
}
.item-text {
  font-size: 15px;
  color: #333;
}
.delete-btn {
  padding: 6px 14px;
  font-size: 13px;
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #e05555;
}
.empty {
  text-align: center;
  padding: 30px;
  color: #bbb;
  font-size: 14px;
}
</style>