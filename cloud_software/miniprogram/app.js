App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud-developer-0g62palod4333641', // 这里替换为你的云开发环境 ID
        traceUser: true,   // 记录用户访问情况
      });
    }
  }
});
