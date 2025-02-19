<template>
  <nut-row>
    <!-- 标题 -->
    <nut-col :span="18" style="text-align: center;">
      <h1 style="font-size: 36px;">Color Puzzle!</h1>
    </nut-col>
   <nut-col :span="6">
      <nut-button type="default" size="small" @click="ResetGame">Reset</nut-button>
    </nut-col>
  </nut-row>
    <!-- 颜色选择 -->
  <nut-row>
    <nut-col :span="'24'" style="text-align: center;">
      <nut-grid :column-num="6">
        <nut-grid-item >
          <nut-button type="primary" color="red" class="pick-1" @click="PickColor(1)"></nut-button>
        </nut-grid-item>
        <nut-grid-item >
          <nut-button type="primary" color="yellow" class="pick-2" @click="PickColor(2)"></nut-button>
        </nut-grid-item>
        <nut-grid-item >
          <nut-button type="primary" color="green" class="pick-3" @click="PickColor(3)"></nut-button>
        </nut-grid-item>
        <nut-grid-item >
          <nut-button type="primary" color="blue" class="pick-4" @click="PickColor(4)"></nut-button>
        </nut-grid-item>
        <nut-grid-item >
          <nut-button type="primary" color="orange" class="pick-5" @click="PickColor(5)"></nut-button>
        </nut-grid-item>
        <nut-grid-item >
          <nut-button type="primary" color="purple" class="pick-6" @click="PickColor(6)"></nut-button>
        </nut-grid-item>
      </nut-grid>
    </nut-col>
  </nut-row>

  <!-- 游戏地图 -->
  <nut-row class="game-map">
    <nut-col :span="16" >
      <nut-grid :column-num="4" :gutter="0">
        <nut-grid-item v-for="(n, index) in 40" :key="n" >
          <nut-button :style="btnStyles[index]" :class="'btn-' + n" class="btn-overall" @click="PickInjection(n)"></nut-button>
        </nut-grid-item>
      </nut-grid>
    </nut-col>
    <nut-col :span="8">
      <nut-row v-for="(i, index) in 10" :key="i" class="tipblock">
        <nut-row class="tipline">
          <nut-col :span="12" style="text-align: center !important; padding-left: 29% !important;" >
            <view :style="tipStyles[(index - 1)*4 +1 +3]" :class="'tip-'+ i + '1'" class="tip-overall"></view>
          </nut-col>
          <nut-col :span="12" style="text-align: center !important;">
            <view :style="tipStyles[(index - 1)*4 +2 +3]" :class="'tip-'+ i + '2'" class="tip-overall"></view>
          </nut-col>
        </nut-row>
        <nut-row class="tipline" style="margin-top: 6%;">
          <nut-col :span="12" style="text-align: center !important; padding-left: 29% !important;">
            <view :style="tipStyles[(index - 1)*4 +3 +3]" :class="'tip-'+ i + '3'" class="tip-overall"></view>
          </nut-col>
          <nut-col :span="12" style="text-align: center !important;">
            <view :style="tipStyles[(index - 1)*4 +4 +3]" :class="'tip-'+ i + '4'" class="tip-overall"></view>
          </nut-col>
        </nut-row>
      </nut-row>
    </nut-col>
  </nut-row>
  
  <!-- 分割线 -->
  <nut-divider style="margin-top: 0 !important;"> Answer </nut-divider>

  <!-- 答案 -->
  <nut-row>
    <nut-col :span="24">
      <nut-grid :column-num="4" :gutter="0">
        <nut-grid-item v-for="(n, index) in 4" :key="n">
          <nut-button :style="ansStyles[index]" :class="'ans-' + n" class="ans-overall"></nut-button>
        </nut-grid-item>
      </nut-grid>
    </nut-col>
  </nut-row>

</template>

<script setup>
import {reactive} from 'vue';
import { ref, onMounted } from "vue";
import Taro from '@tarojs/taro';


// 0: none
// 1: red
// 2: yellow
// 3: green
// 4: blue
// 5: orange
// 6: purple

const playerlevel = ref(1);

const btnStyles = ref(Array(40).fill({ backgroundColor: "transparent !important" }));
const tipStyles = ref(Array(40).fill({ backgroundColor: "gray" }));
const ansStyles = ref(Array(4).fill({ backgroundColor: "transparent !important" }));

const answer = reactive({
  ans1: 1,
  ans2: 2,
  ans3: 3,
  ans4: 4
});

const current = reactive({
  cur1: 0,
  cur2: 0,
  cur3: 0,
  cur4: 0
});

const action = reactive({
  colorIndex: 0,
  InjectionIndex: 0,
});

onMounted(() => {
  ResetGame();
});

const ResetGame = () =>{
  answer.ans1 = Math.floor(Math.random() * 6) + 1;
  answer.ans2 = Math.floor(Math.random() * 6) + 1;
  answer.ans3 = Math.floor(Math.random() * 6) + 1;
  answer.ans4 = Math.floor(Math.random() * 6) + 1;
  console.log(answer);

  playerlevel.value = 1;
  for(let i = 1; i <= 4; i++){
    current["cur" + i] = 0;
  }
  for(let i = 0; i < 40; i++){
    btnStyles.value[i] = {
      backgroundColor: "transparent !important"
    };
  }
  for(let i = 0; i < 40; i++){
    tipStyles.value[i] = {
      backgroundColor: "gray"
    };
  }
  for(let i = 0; i < 4; i++){
    ansStyles.value[i] = {
      backgroundColor: "transparent !important"
    };
  }
}

// 获取颜色的辅助函数
const getColor = (color) => {
  const colors = ["red", "yellow", "green", "blue", "orange", "purple"];
  return colors[color - 1] || "black";
};


const PickColor = (color) => {
  if (action.InjectionIndex === 0) {
    action.colorIndex = color;
  } else { 
    if (action.InjectionIndex >= (playerlevel.value - 1)  * 4 + 1 && action.InjectionIndex <= playerlevel.value * 4){
      btnStyles.value[action.InjectionIndex - 1] = {
      backgroundColor: getColor(color) + " !important;" +
        "border-color: black !important;" +
        "border-style: solid !important;" 
      };
    } 
    let i = action.InjectionIndex % 4;
    if (i === 0) {
      i = 4;
    }
    console.log(i);
    current["cur" + i ] = color;
    console.log(current);
    action.InjectionIndex = 0;
    if(CheckIfLineSelected()) {
      CheckAnswer(playerlevel.value);
    }
  }
};

const PickInjection = (index) =>{
  if(action.colorIndex === 0){
    action.InjectionIndex = index;
  }else{
    if (index >= (playerlevel.value - 1)  * 4 + 1 && index <= playerlevel.value * 4){
      btnStyles.value[index - 1] = {
      backgroundColor: getColor(action.colorIndex) + " !important;" +
        "border-color: black !important;" +
        "border-style: solid !important;" 
      };
    };
    let i = index % 4;
    if (i === 0) {
      i = 4;
    }
    console.log(i);
    current["cur" + i ] = action.colorIndex;
    action.colorIndex = 0;
    console.log(current);
    if(CheckIfLineSelected()) {
      CheckAnswer(playerlevel.value);
    }
  }
};

const CheckIfLineSelected = () =>{
  if(current.cur1 !== 0 && current.cur2 !== 0 && current.cur3 !== 0 && current.cur4 !== 0){
    return true;
  }else {
    return false;
  }
}

const CheckAnswer = (level) =>{
  let indexright = 0;
  let colorright = 0;
  let vis_cur = Array(4).fill(0);
  let vis_ans = Array(4).fill(0);
  for(let i = 1; i <= 4; i++){
    if(current["cur" + i] === answer["ans" + i]){
      indexright++;
      vis_cur[i] = 1;
      vis_ans[i] = 1;
      continue;
    }
    for(let j = 1; j <= 4; j++){
      if(current["cur" + i] === answer["ans" + j]){
        colorright++;
        vis_cur[i] = 1;
        vis_ans[j] = 1;
        continue;
      }
    }
  }
  console.log("indexright: " + indexright + " colorright: " + colorright);
  if (indexright === 4){
    UpdateTipColor(level, indexright, colorright);
    ShowAnswer();
    Taro.showToast({
      title: "You F**king Win!",
      icon: "success",
      duration: 2000
    });
  }else{
    UpdateTipColor(level, indexright, colorright);
    NextLevel();
    if(playerlevel.value === 11){
      ShowAnswer();
      Taro.showToast({
        title: "You Lose!",
        icon: "error",
        duration: 2000
      });
    }
  }
  
}

const UpdateTipColor = (level, indexright, colorright) => {
  console.log("level" + level);
  let start = (level - 1) * 4 + 1;
  console.log("start" + start);
  for(let i = start; i <= level * 4; i++){
    console.log("i" + i-1);
    if(indexright > 0){
      tipStyles.value[i - 1] = {
        backgroundColor: "green"
      };
      indexright--;
      continue;
    }else if(colorright > 0){
      tipStyles.value[i - 1] = {
        backgroundColor: "yellow"
      };
      colorright--;
      continue;
    }else{
      tipStyles.value[i - 1] = {
        backgroundColor: "gray"
      };
    }
  }
}

const NextLevel = () => {
  playerlevel.value++;
  for(let i = 1; i <= 4; i++){
    current["cur" + i] = 0;
  }
}

const ShowAnswer = () => {
  for(let i = 1; i <= 4; i++){
    ansStyles.value[i - 1] = {
      backgroundColor: getColor(answer["ans" + i]) + " !important;" +
        "border-color: black !important;" +
        "border-style: solid !important;" 
    };
  }
}








</script>

<style>




.pick-1{
  --nut-button-border-width:3px !important;
  border-color: black !important;
  border-radius: 50% !important;
  
}
.pick-2{
  border-radius: 50% !important;
  --nut-button-border-width:3px !important;
  border-color: black !important;
}
.pick-3{
  border-radius: 50% !important;
  --nut-button-border-width:3px !important;
  border-color: black !important;
}
.pick-4{
  border-radius: 50% !important;
  --nut-button-border-width:3px !important;
  border-color: black !important;
}
.pick-5{
  border-radius: 50% !important;
  --nut-button-border-width:3px !important;
  border-color: black !important;
}
.pick-6{
  border-radius: 50% !important;
  --nut-button-border-width:3px !important;
  border-color: black !important;
}
.game-map{
  margin-left: 5% !important;
  margin-top: 3% !important;
}
.nut-grid-item__content{
  padding: 9% !important;
}

.btn-overall{
  border-style: dashed !important;
  border-color: grey !important;
  border-width: 5px !important;
  /* background-color: transparent !important; */
  border-radius: 50% !important;
}
.tip-overall{
  width: 4vw !important;
  height: 4vw !important;
  border-radius: 50% !important;
  background-color: gray;
  border-style: solid;
  border-color: black;
  border-width: 0.2vw;
}
.tipblock{
  margin-top: -4%;
  margin-bottom: 17%;
}
.tipline{
  margin-top: 10%;
}

.ans-overall{
  border-style: dashed !important;
  border-color: grey !important;
  border-width: 5px !important;
  /* background-color: transparent !important; */
  border-radius: 50% !important;
}

</style>