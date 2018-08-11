<template>
  <el-select v-model="value8" filterable placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.ddKey"
      :label="item.ddName"
      :letter="item.letter"
      :value="item.ddKey">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    data() {
      return {
        options: [{"ddKey":"00118001","ddName":"人民币","ddOrder":"","extendValue":"","extendValue2":"","letter":"rmb","pddKey":""},{"ddKey":"00118002","ddName":"美元","ddOrder":"","extendValue":"","extendValue2":"","letter":"my","pddKey":""},{"ddKey":"00118003","ddName":"港币","ddOrder":"","extendValue":"","extendValue2":"","letter":"gb","zpddKey":""},{"ddKey":"00118004","ddName":"加币","ddOrder":"","extendValue":"","extendValue2":"","letter":"jb","pddKey":""},{"ddKey":"00118005","ddName":"欧元","ddOrder":"","extendValue":"","extendValue2":"","letter":"oy","pddKey":""},{"ddKey":"00118011","ddName":"泰国铢","ddOrder":"","extendValue":"","extendValue2":"","letter":"tgz","pddKey":""},{"ddKey":"00118012","ddName":"瑞士法郎","ddOrder":"","extendValue":"","extendValue2":"","letter":"rsfl","pddKey":""},{"ddKey":"00118013","ddName":"法国法郎","ddOrder":"","extendValue":"","extendValue2":"","letter":"fgfl","pddKey":""},{"ddKey":"00118014","ddName":"比利时法郎","ddOrder":"","extendValue":"","extendValue2":"","letter":"blsfl","pddKey":""},{"ddKey":"00118015","ddName":"卢森堡法郎","ddOrder":"","extendValue":"","extendValue2":"","letter":"lsbfl","pddKey":""},{"ddKey":"00118031","ddName":"西班牙比塞塔","ddOrder":"","extendValue":"","extendValue2":"","letter":"xbybst","pddKey":""},{"ddKey":"00118017","ddName":"俄罗斯卢布","ddOrder":"","extendValue":"","extendValue2":"","letter":"elslb","pddKey":""},{"ddKey":"00118018","ddName":"德国马克","ddOrder":"","extendValue":"","extendValue2":"","letter":"dgmk","pddKey":""},{"ddKey":"00118019","ddName":"丹麦克朗","ddOrder":"","extendValue":"","extendValue2":"","letter":"dmkl","pddKey":""},{"ddKey":"00118020","ddName":"印尼盾","ddOrder":"","extendValue":"","extendValue2":"","letter":"ynd","pddKey":""},{"ddKey":"00118021","ddName":"爱尔兰镑","ddOrder":"","extendValue":"","extendValue2":"","letter":"aelb","pddKey":""},{"ddKey":"00118022","ddName":"马拉西亚林吉特","ddOrder":"","extendValue":"","extendValue2":"","letter":"mlxyljt","pddKey":""},{"ddKey":"00118023","ddName":"荷兰盾","ddOrder":"","extendValue":"","extendValue2":"","letter":"hld","pddKey":""},{"ddKey":"00118024","ddName":"挪威克朗","ddOrder":"","extendValue":"","extendValue2":"","letter":"nwkl","pddKey":""},{"ddKey":"00118025","ddName":"新加坡元","ddOrder":"","extendValue":"","extendValue2":"","letter":"xjpy","pddKey":""},{"ddKey":"00118026","ddName":"瑞典克朗","ddOrder":"","extendValue":"","extendValue2":"","letter":"rdkl","pddKey":""},{"ddKey":"00118027","ddName":"葡萄牙埃斯库多","ddOrder":"","extendValue":"","extendValue2":"","letter":"ptyaskd","pddKey":""},{"ddKey":"00118028","ddName":"菲律宾比索","ddOrder":"","extendValue":"","extendValue2":"","letter":"flbbs","pddKey":""},{"ddKey":"00118029","ddName":"新西兰元","ddOrder":"","extendValue":"","extendValue2":"","letter":"xxly","pddKey":""},{"ddKey":"00118030","ddName":"奥地利先令","ddOrder":"","extendValue":"","extendValue2":"","letter":"adlxl","pddKey":""},{"ddKey":"00118010","ddName":"韩国元","ddOrder":"","extendValue":"","extendValue2":"","letter":"hgy","pddKey":""},{"ddKey":"00118009","ddName":"芬兰马克","ddOrder":"","extendValue":"","extendValue2":"","letter":"flmk","pddKey":""},{"ddKey":"00118008","ddName":"澳元","ddOrder":"","extendValue":"","extendValue2":"","letter":"ay","pddKey":""},{"ddKey":"00118007","ddName":"英镑","ddOrder":"","extendValue":"","extendValue2":"","letter":"yb","pddKey":""},{"ddKey":"00118006","ddName":"日元","ddOrder":"","extendValue":"","extendValue2":"","letter":"ry","pddKey":""},{"ddKey":"00118016","ddName":"意大利里拉","ddOrder":"","extendValue":"","extendValue2":"","letter":"ydlll","pddKey":""}],
        value8: ''
      }
    }
  }
</script>