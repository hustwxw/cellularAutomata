<template>
  <el-container>
    <el-header>Game Life({{x}}X{{y}})</el-header>
    <el-main>
      <div class="box" v-bind:style="boxStyle">
        <el-row class="row-cell" v-for="(x, xIndex) in cells" v-bind:key="`x-${xIndex}`">
          <div @click="changeColor(xIndex, yIndex)" v-bind:class="{cell: true, t: y}" v-for="(y, yIndex) in x" v-bind:key="`y-${yIndex}`"></div>
        </el-row>
      </div>
      <div class="op">
        <el-button @click="start" type="primary" :disabled="isDisStart">Start</el-button>
        <el-button @click="stop" type="primary" :disabled="isDisStop">Stop</el-button>
        <el-button @click="clear" type="primary" :disabled="!isDisStop">clear</el-button>
        <div class="info" v-if="stats.nums !== 0">
          共运行了{{stats.nums}}代
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'langtonAnt',
  data () {
    return {
      boxStyle: {
        width: '1200px'
      },
      // 棋盘大小
      x: 0,
      y: 0,
      // 单元格
      cells: [],
      copyCells: [],
      // 计时句柄
      handler: -1,
      stats: {
        nums: 0
      },
      isDisStart: false,
      isDisStop: false,
      isDisClear: true
    }
  },
  methods: {
    genCells (x, y) {
      this.x = x
      this.y = y
      for (let i = 0; i < x; i++) {
        this.cells.push([])
        this.copyCells.push([])
        for (let j = 0; j < y; j++) {
          this.cells[this.cells.length - 1].push(false)
          this.copyCells[this.copyCells.length - 1].push(false)
        }
      }
    },
    changeColor (x, y) {
      let v = this.cells[x][y]
      this.$set(this.cells[x], y, !v)
      this.$set(this.copyCells[x], y, !v)
    },
    run () {
      let _run = () => {
        // Game is over?
        if (this.cells.toString().indexOf('true') === -1) {
          clearInterval(this.handler)
          this.stats.nums = 0
          this.isDisStart = false
          this.isDisStop = true
        }
        // Game rule
        this.copyCells.forEach((cpx, i) => {
          cpx.forEach((cpy, j) => {
            // 计数，周围有多少个
            let count = 0
            if (i - 1 > -1 && j - 1 > -1 && this.cells[i - 1][j - 1]) {
              count++
            }
            if (i - 1 > -1 && this.cells[i - 1][j]) {
              count++
            }
            if (i - 1 > -1 && j + 1 < this.y && this.cells[i - 1][j + 1]) {
              count++
            }
            if (j - 1 > -1 && this.cells[i][j - 1]) {
              count++
            }
            if (j + 1 < this.y && this.cells[i][j + 1]) {
              count++
            }
            if (i + 1 < this.x && j - 1 > -1 && this.cells[i + 1][j - 1]) {
              count++
            }
            if (i + 1 < this.x && this.cells[i + 1][j]) {
              count++
            }
            if (i + 1 < this.x && j + 1 < this.y && this.cells[i + 1][j + 1]) {
              count++
            }

            if (count === 3) {
              this.copyCells[i][j] = true
            } else if (count < 2 || count > 4) {
              this.copyCells[i][j] = false
            }
          })
        })
        // emit view
        this.cells.forEach((x, i) => {
          x.forEach((y, j) => {
            this.$set(this.cells[i], j, this.copyCells[i][j])
          })
        })
        // count
        this.stats.nums++
      }
      this.handler = setInterval(_run, 200)
    },
    start () {
      this.run()
      this.isDisStart = true
      this.isDisStop = false
    },
    stop () {
      clearInterval(this.handler)
      this.isDisStart = false
      this.isDisStop = true
    },
    clear () {
      this.stats.nums = 0
      this.genCells(60, 100)
      this.cells.forEach((x, i) => {
        x.forEach((y, j) => {
          this.$set(this.cells[i], j, false)
        })
      })
    }
  },
  mounted () {
    this.genCells(60, 100)
  }
}
</script>

<style lang="less" scoped>
.box{
  height: 100%;
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  float: left;
  .row-cell{
    width:100%;
    height:10px;
    display: inline-flex;
    margin-bottom: 1px;
  }
  .cell{
    width: 10px;
    height:10px;
    background-color: orange;
    display: inline-flex;
    box-sizing: border-box;
    margin-right: 1px;
    &.t{
      background-color: rgb(66, 44, 3);
    }
    &.f{
      background-color: rgb(167, 115, 19);
    }
  }
}
.op{
  width: 300px;
  height: auto;
  border: 1px solid rgb(233, 140, 140);
  float: right;
  padding: 10px;
  box-sizing: border-box;
  .info{
    width: 100%;
    height: 100px;
    border: 1px solid #ddd;
    margin-top: 20px;
    font-size: 16px;
    color: #666;
  }
}
</style>
