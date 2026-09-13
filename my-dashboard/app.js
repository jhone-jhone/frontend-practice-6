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


loadData();