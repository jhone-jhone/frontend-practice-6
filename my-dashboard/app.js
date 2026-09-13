const state = { data: null };
let barChart = null;
let lineChart = null;

const loadData = async () => {
  $('#status').text('加载中...').show();
  try {
    const response = await fetch('studyrooms.json');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const data = await response.json();
    if (!data.rooms || data.rooms.length === 0) {
      $('#status').text('暂无数据').show();
      return;
    }
    state.data = data;
    $('#sub-title').text(data.title + ' · 数据来源：' + data.source);
    $('#status').hide();
    renderCards(data);
    renderBarChart(data);
    renderLineChart(data);
  } catch (error) {
    $('#status').text('加载失败：' + error.message).show();
  }
};

const renderCards = (data) => {
  data.rooms.forEach(r => {
    const rate = r.seats > 0 ? Math.round(r.occupied / r.seats * 100) : 0;
    const badgeColor = r.status === '开放' ? 'bg-success'
      : r.status === '维修' ? 'bg-warning'
      : 'bg-secondary';
    $('#cards').append(`
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${r.name}</h3>
            <p class="card-text fs-4">${r.occupied} / ${r.seats}</p>
            <p class="card-text small text-muted">座位占用率 ${rate}%</p>
            <p class="card-text small">状态：<span class="badge ${badgeColor}">${r.status}</span></p>
            <p class="card-text small text-muted">开放时间：${r.hours}</p>
          </div>
        </div>
      </div>
    `);
  });
};

const renderBarChart = (data) => {
  const map = {};
  data.rooms.forEach(r => {
    if (!map[r.building]) map[r.building] = { seats: 0, occupied: 0 };
    map[r.building].seats += r.seats;
    map[r.building].occupied += r.occupied;
  });
  const buildings = Object.keys(map);

  if (barChart === null) {
    barChart = echarts.init(document.querySelector('#bar-chart'));
  }
  barChart.setOption({
    title: { text: '各楼宇座位数与占用数', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: { data: buildings },
    yAxis: { name: '个' },
    series: [
      { name: '总座位数', type: 'bar', data: buildings.map(b => map[b].seats) },
      { name: '已占用数', type: 'bar', data: buildings.map(b => map[b].occupied) }
    ]
  });
};

loadData();