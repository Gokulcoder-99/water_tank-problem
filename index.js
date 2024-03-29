function fetchArr() {
  const inputElement = document.getElementById('inputArr');
  const inputArr = inputElement.value.split(',').map(Number);
  waterAndBricks(inputArr);
  onlyWater(inputArr);
}

function createTable(xAxisInput, outputArr, id) {
  const dom = document.getElementById(id);
  const myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
  });
  console.log(xAxisInput)
  var app = {};

var option;

var series = [
  {
    data: [...xAxisInput],
    type: 'bar',
    stack: 'a',
    name: 'a',
    color:'black'
  },
  {
    data: [...outputArr],
    type: 'bar',
    stack: 'a',
    name: 'b',
    color:'blue'
  }
];
const stackInfo = {};
for (let i = 0; i < series[0].data.length; ++i) {
  for (let j = 0; j < series.length; ++j) {
    const stackName = series[j].stack;
    if (!stackName) {
      continue;
    }
    if (!stackInfo[stackName]) {
      stackInfo[stackName] = {
        stackStart: [],
        stackEnd: []
      };
    }
    const info = stackInfo[stackName];
    const data = series[j].data[i];
    if (data && data !== 0) {
      if (info.stackStart[i] == null) {
        info.stackStart[i] = j;
      }
      info.stackEnd[i] = j;
    }
  }
}
for (let i = 0; i < series.length; ++i) {
  const data = series[i].data;
  const info = stackInfo[series[i].stack];
  for (let j = 0; j < series[i].data.length; ++j) {
    // const isStart = info.stackStart[j] === i;
    const isEnd = info.stackEnd[j] === i;
    const topBorder = isEnd ? 20 : 0;
    const bottomBorder = 0;
    data[j] = {
      value: data[j]
    };
  }
}
option = {
  xAxis: {
    type: 'category',
    data: xAxisInput.map((_, index) => index)
  },
  yAxis: {
    type: 'value'
  },
  series: series
};
  if (option && typeof option === 'object') {
      myChart.setOption(option);
  }
  window.addEventListener('resize', myChart.resize);
}
function createTable1(xAxisInput, outputArr, id) {
  const dom = document.getElementById(id);
  const myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
  });
  const option = {
      xAxis: {
          type: 'category',
          data: xAxisInput.map((_, index) => index)
      },
      yAxis: {
          type: 'value'
      },
      series: [
          {
              data: outputArr,
              type: 'bar'
          }
      ]
  };
  if (option && typeof option === 'object') {
      myChart.setOption(option);
  }
  window.addEventListener('resize', myChart.resize);
}

function calculateWater(arr) {
  const n = arr.length;
  let totalWater = 0;
  const waterLevels = new Array(n).fill(0);

  for (let i = 1; i < n - 1; i++) {
      let left = arr[i];
      for (let j = 0; j < i; j++) {
          left = Math.max(left, arr[j]);
      }

      let right = arr[i];
      for (let j = i + 1; j < n; j++) {
          right = Math.max(right, arr[j]);
      }

      const minSideHeight = Math.min(left, right);
      const waterStored = minSideHeight - arr[i];
      totalWater += waterStored;
      waterLevels[i] = waterStored;
  }

  return { waterLevels, totalWater };
}

function waterAndBricks(bricks) {
  const { waterLevels } = calculateWater(bricks);
  createTable(bricks, waterLevels, 'chart-container');
  const outputSpan = document.getElementById('waterunit');
  outputSpan.innerHTML = `Total ${calculateWaterUnits(waterLevels)} Water Units`;
}

function onlyWater(bricks) {
  const { waterLevels } = calculateWater(bricks);
  console.log(waterLevels,"water")
  const result = bricks.map((brick, index) => ({
    value: waterLevels[index],
    itemStyle: {
        color: '#0000FF'
    }
}));

  createTable1(bricks,result, 'chart-container1');
}

function calculateWaterUnits(waterLevels) {
  return waterLevels.reduce((total, level) => total + level, 0);
}