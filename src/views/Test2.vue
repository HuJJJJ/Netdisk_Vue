<template>
  <div>
    Test2
    <!-- <div class="box-img" @mousedown="handleMouseDown">
      <div
        class="mask"
        v-show="positionList.is_show_mask"
        :style="
          'width:' +
          mask_width +
          'left:' +
          mask_left +
          'height:' +
          mask_height +
          'top:' +
          mask_top
        "
      ></div>
      <el-checkbox-group v-model="selectedState" class="checkboxGroup">
        <el-checkbox
          v-for="(item, index) in tableData"
          :key="index"
          :label="item.id"
          :class="
            selectedState.includes(item.id) ? 'checkbox aa-active' : 'checkbox'
          "
          @change="checkItem($event, item)"
        >
          <img
            style="width: 100%; height: 100%"
            :src="handleAssetsImages(item.img)"
            alt=""
          />
          <span class="num" v-show="selectedState.includes(item.id)">{{
            selectedState.indexOf(item.id) + 1
          }}</span>
        </el-checkbox>
      </el-checkbox-group>
    </div> -->
  </div>
</template>
 
// <script>
// import { ref, reactive, onMounted, computed } from "vue";

// export default {
//   data() {
//     return {
//       tableData: reactive([
//         { id: "abcd1", data: "cccc", img: "1.png" },
//         { id: "abcd2", data: "dddd", img: "1.png" },
//         { id: "abcd3", data: "eeee", img: "1.png" },
//         { id: "abcd4", data: "ffff", img: "1.png" },
//         { id: "abcd5", data: "gggg", img: "1.png" },
//         { id: "abcd6", data: "hhhh", img: "1.png" },
//         { id: "abcd7", data: "iiii", img: "1.png" },
//         { id: "abcd8", data: "jjjj", img: "1.png" },
//         { id: "abcd9", data: "kkkk", img: "1.png" },
//         { id: "abcd10", data: "llll", img: "1.png" },
//       ]),
//       selectedState: ref([]),
//       positionList: {
//         is_show_mask: false,
//         box_screen_left: 0,
//         box_screen_top: 0,
//         start_x: 0,
//         start_y: 0,
//         end_x: 0,
//         end_y: 0,
//       },
//       mask_width: computed(() => {
//         return `${Math.abs(positionList.end_x - positionList.start_x)}px;`;
//       }),
//       mask_height: computed(() => {
//         return `${Math.abs(positionList.end_y - positionList.start_y)}px;`;
//       }),
//       mask_left: computed(() => {
//         return `${
//           Math.min(positionList.start_x, positionList.end_x) -
//           positionList.box_screen_left
//         }px;`;
//       }),
//       mask_top: computed(() => {
//         return `${
//           Math.min(positionList.start_y, positionList.end_y) -
//           positionList.box_screen_top
//         }px;`;
//       }),
//     };
//   },
//   methods: {
//      //循环动态加载图片
//     handleAssetsImages(name){
//     },
// //单击多选框选中
// checkItem(val,item){
//         console.log(val,item);

//         let str = item.id ;
//         let i = selectedState.value.indexOf(str)  // 判断选中列表中是否包含这个点击的div
//         if (i < 0) {
//             selectedState.value.push(str) ;  // 如果不包含就加进去
//         } else {
//             selectedState.value.splice(i, 1);  // 如果包含就删
//         }
//     },

// //鼠标按下事件
//       handleMouseDown(event){
//         positionList.is_show_mask = true;
//         positionList.start_x = event.clientX;
//         positionList.start_y = event.clientY;
//         positionList.end_x = event.clientX;
//         positionList.end_y = event.clientY;
//         document.body.addEventListener("mousemove", handleMouseMove); //监听鼠标移动事件
//         document.body.addEventListener("mouseup", handleMouseUp); //监听鼠标抬起事件
//     },



//   },
// };
// </script>