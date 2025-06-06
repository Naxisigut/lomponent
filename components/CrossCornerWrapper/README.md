## 简介
纯样式组件，在所包裹元素的四个角上显示一个小十字。

```html
<CrossCornerWrapper>
  <div class="p-2 flex flex-col items-center cursor-pointer" @click="toWebsite">
    <Globe class="w-8 h-8 text-sky-800" />
    <span class="mt-2 text-sky-800">常用网站</span>
  </div>
</CrossCornerWrapper>


<CrossCornerWrapper>
  <div class="relative flex items-center w-full rounded-md bg-transparent ">
    <!-- 搜索引擎选择 -->
    <div @mousewheel="handleScroll">
      <Select v-model="selectedEngine">
        <SelectTrigger class="h-10 border-0 focus:ring-0 focus:ring-offset-0 bg-transparent">
          <SelectValue>
            <div class="flex items-center">
              <img :src="engines.find(e => e.id === selectedEngine)?.icon" :alt="selectedEngine" class="w-4 h-4" />
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="engine in engines" :key="engine.id" :value="engine.id">
            <div class="flex items-center gap-2">
              <img :src="engine.icon" :alt="engine.id" class="w-4 h-4" />
              <span>{{ engine.name }}</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- 分隔线 -->
    <div class="h-5 w-px bg-border"></div>

    <!-- 输入框 -->
    <Input 
      v-model="searchText" placeholder="输入关键词搜索..."
      ref="iptRef" 
      style="box-shadow: none;" 
      @keyup.enter="handleSearch" 
      class="flex-1 border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-500 placeholder:italic"
    />

    <!-- 搜索按钮 -->
    <button class="w-12 h-10 flex items-center justify-center hover:opacity-70 bg-transparent" @click="handleSearch">
      <SearchIcon class="h-4 w-4 text-muted-foreground" />
    </button>
  </div>
</CrossCornerWrapper>
```


## 平台与兼容性


## 技术栈
vue3 vue2

## 库依赖

