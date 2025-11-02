<script setup lang="ts">
defineProps<{
  niuRankList: {
    userId: number
    nickname: string
    item: {
      length: number
      injectedCount: number //注入次数
      ejaculateCount: number //释放次数
      charm: number //魅力
    }
    rank: number // 排行
    percent: number // 占比
  }[]
}>()
</script>

<template>
  <div class="niu-rank-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-circle amber-circle"></div>
      <div class="decoration-circle blue-circle"></div>
      <div class="decoration-circle purple-circle"></div>
    </div>

    <div class="content-wrapper">
      <!-- 标题区域 -->
      <div class="header-section">
        <div class="title-wrapper">
          <h1 class="main-title">
            <svg t="1762013591640" class="icon" viewBox="0 0 1238 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7776" width="45" height="45"><path d="M1029.906558 390.329333c97.729813-40.507729 165.865386-95.566779 165.865386-196.049544C1195.771944 45.915314 924.212847-102.44916 1071.692444 95.370139c140.695535 187.594047-252.28843 175.009121-293.189439 173.239367a257.204417 257.204417 0 0 0-307.642439 0.491598c-86.029765 1.966395-404.684013-1.966395-275.885165-173.730965C344.126433-102.44916 71.780778 45.915314 71.780778 194.279789c0 100.581085 68.233893 155.640134 166.160345 196.639462-5.997504 0-12.093327-0.589918-18.18915-0.589918-99.696207 0-235.967355 108.151704-218.171483 180.318387 16.910994 67.643975 118.475276 72.166683 218.171483 72.166682a226.135382 226.135382 0 0 0 122.997984-34.116946 216.303409 216.303409 0 0 1 86.226404 243.734613 91.142391 91.142391 0 0 0 21.728661 89.274316c49.159866 51.716179 109.331541 82.293615 174.812482 82.293615 61.548152 0 118.671916-27.037926 165.963706-73.2482a89.962554 89.962554 0 0 0 22.515218-92.813826A216.303409 216.303409 0 0 1 896.978281 609.582333a227.118579 227.118579 0 0 0 121.326549 33.03543c99.597888 0 201.16217-4.522708 218.073163-72.166683 17.402592-69.708689-108.250024-172.354489-206.471435-180.121747z m-673.195199 43.65396c-2.163034-1.671435-4.326068-3.441191-6.587422-5.014306l7.570619 2.261354c-0.393279 1.376476-0.688238 1.868075-0.983197 2.752952z m61.253192 192.215075a76.88603 76.88603 0 0 1-21.237062-58.991839 73.543159 73.543159 0 0 1 79.835622 79.835622 76.88603 0 0 1-58.59856-20.843783z m109.233221 328.97782a29.495919 29.495919 0 1 1 29.49592-29.495919 29.495919 29.495919 0 0 1-29.49592 29.495919z m186.80749 0a29.495919 29.495919 0 1 1 29.495919-29.495919 29.495919 29.495919 0 0 1-29.495919 29.495919z m106.480268-328.97782a76.68939 76.68939 0 0 1-58.991838 21.237062 73.543159 73.543159 0 0 1 79.835621-79.835622 76.88603 0 0 1-20.843783 58.59856z" p-id="7777" data-spm-anchor-id="a313x.search_index.0.i16.2f7b3a81QaF3Dg" class="selected"></path></svg>
            牛牛争霸榜
            <svg t="1762013591640" class="icon" viewBox="0 0 1238 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7776" width="45" height="45"><path d="M1029.906558 390.329333c97.729813-40.507729 165.865386-95.566779 165.865386-196.049544C1195.771944 45.915314 924.212847-102.44916 1071.692444 95.370139c140.695535 187.594047-252.28843 175.009121-293.189439 173.239367a257.204417 257.204417 0 0 0-307.642439 0.491598c-86.029765 1.966395-404.684013-1.966395-275.885165-173.730965C344.126433-102.44916 71.780778 45.915314 71.780778 194.279789c0 100.581085 68.233893 155.640134 166.160345 196.639462-5.997504 0-12.093327-0.589918-18.18915-0.589918-99.696207 0-235.967355 108.151704-218.171483 180.318387 16.910994 67.643975 118.475276 72.166683 218.171483 72.166682a226.135382 226.135382 0 0 0 122.997984-34.116946 216.303409 216.303409 0 0 1 86.226404 243.734613 91.142391 91.142391 0 0 0 21.728661 89.274316c49.159866 51.716179 109.331541 82.293615 174.812482 82.293615 61.548152 0 118.671916-27.037926 165.963706-73.2482a89.962554 89.962554 0 0 0 22.515218-92.813826A216.303409 216.303409 0 0 1 896.978281 609.582333a227.118579 227.118579 0 0 0 121.326549 33.03543c99.597888 0 201.16217-4.522708 218.073163-72.166683 17.402592-69.708689-108.250024-172.354489-206.471435-180.121747z m-673.195199 43.65396c-2.163034-1.671435-4.326068-3.441191-6.587422-5.014306l7.570619 2.261354c-0.393279 1.376476-0.688238 1.868075-0.983197 2.752952z m61.253192 192.215075a76.88603 76.88603 0 0 1-21.237062-58.991839 73.543159 73.543159 0 0 1 79.835622 79.835622 76.88603 0 0 1-58.59856-20.843783z m109.233221 328.97782a29.495919 29.495919 0 1 1 29.49592-29.495919 29.495919 29.495919 0 0 1-29.49592 29.495919z m186.80749 0a29.495919 29.495919 0 1 1 29.495919-29.495919 29.495919 29.495919 0 0 1-29.495919 29.495919z m106.480268-328.97782a76.68939 76.68939 0 0 1-58.991838 21.237062 73.543159 73.543159 0 0 1 79.835621-79.835622 76.88603 0 0 1-20.843783 58.59856z" p-id="7777" data-spm-anchor-id="a313x.search_index.0.i16.2f7b3a81QaF3Dg" class="selected"></path></svg>
          </h1>
          <div class="title-glow"></div>
        </div>
        
        <p class="subtitle">TOP 20 牛子王闪耀登场</p>
      </div>

      <!-- 排行榜网格 -->
      <div class="ranking-grid">
        <div 
          v-for="user in niuRankList" 
          :key="user.userId"
          class="ranking-card"
        >
          <div class="card-content">
            <!-- 排名徽章 -->
            <div class="rank-section">
              <div 
                class="rank-number"
                :class="[
                  user.rank === 1 ? 'rank-first' : 
                  user.rank === 2 ? 'rank-second' : 
                  user.rank === 3 ? 'rank-third' : 
                  'rank-normal'
                ]"
              >
                {{ user.rank }}
              </div>
            </div>

            <!-- 头像区域 -->
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <div 
                  class="avatar-border"
                  :class="user.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-500' : 
                         user.rank === 2 ? 'bg-gradient-to-br from-purple-400 to-purple-500' : 
                         user.rank === 3 ? 'bg-gradient-to-br from-blue-400 to-blue-500' : 
                         'bg-gradient-to-br from-slate-500 to-slate-600'"
                >
                  <img 
                    class="avatar-image" 
                    :src="`https://q1.qlogo.cn/g?b=qq&nk=${user.userId}&s=0`" 
                    :alt="user.nickname" 
                  />
                </div>
                <!-- 成就标识 -->
                <div v-if="user.item.length >= 18" class="achievement-tag">
                  超神
                </div>
              </div>
            </div>

            <!-- 用户信息 -->
            <div class="info-section">
              <div class="info-left">
                <div class="user-header">
                  <h3 
                    class="user-nickname"
                    :class="user.rank === 1 ? 'text-amber-200' : 
                          user.rank === 2 ? 'text-purple-200' : 
                          user.rank === 3 ? 'text-blue-200' : 
                          'text-slate-200'"
                  >{{ user.nickname }}</h3>
                </div>
                <div 
                  class="user-id"
                  :class="user.rank === 1 ? 'text-amber-300' : 
                        user.rank === 2 ? 'text-purple-300' : 
                        user.rank === 3 ? 'text-blue-300' : 
                        'text-slate-300'"
                >
                  ID: {{ user.userId }}
                </div>

                <!-- 主要数据 -->
                <div class="data-section">
                  <div class="data-item">
                    <span 
                      class="value-number"
                      :class="user.rank === 1 ? 'text-amber-200' : 
                            user.rank === 2 ? 'text-purple-200' : 
                            user.rank === 3 ? 'text-blue-200' : 
                            'text-slate-200'"
                    >{{ user.item.injectedCount }}</span>
                    <span class="data-unit">次</span>
                    <span class="data-label">透人</span>
                  </div>
                  <div class="data-item">
                    <span 
                      class="value-number"
                      :class="user.rank === 1 ? 'text-amber-200' : 
                            user.rank === 2 ? 'text-purple-200' : 
                            user.rank === 3 ? 'text-blue-200' : 
                            'text-slate-200'"
                    >{{ user.item.ejaculateCount }}</span>
                    <span class="data-unit">次</span>
                    <span class="data-label">打胶</span>
                  </div>
                  
                  <div class="data-item">
                    <span 
                      class="value-number"
                      :class="user.rank === 1 ? 'text-amber-200' : 
                            user.rank === 2 ? 'text-purple-200' : 
                            user.rank === 3 ? 'text-blue-200' : 
                            'text-slate-200'"
                    >{{ user.item.charm }}</span>
                    <span class="data-unit">点</span>
                    <span class="data-label">魅力</span>
                  </div>
                  
                  <div class="data-item">
                    <span 
                      class="value-number"
                      :class="user.rank === 1 ? 'text-amber-200' : 
                            user.rank === 2 ? 'text-purple-200' : 
                            user.rank === 3 ? 'text-blue-200' : 
                            'text-slate-200'"
                    >{{ user.percent }}</span>
                    <span class="data-unit">%</span>
                    <span class="data-label">击败</span>
                  </div>
                </div>
              </div>
              
              <div class="info-right">
                <div class="length-display">
                  <span 
                    class="length-value"
                    :class="user.rank === 1 ? 'length-value-first' : 
                           user.rank === 2 ? 'length-value-second' : 
                           user.rank === 3 ? 'length-value-third' : 
                           'length-value-normal'"
                  >{{ user.item.length }}</span>
                  <span class="length-unit">cm</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 底部装饰 -->
          <div 
            class="bottom-decoration"
            :class="user.rank === 1 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 
                   user.rank === 2 ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 
                   user.rank === 3 ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 
                   'bg-gradient-to-r from-slate-400 to-slate-600'"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.niu-rank-container {
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
  background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
  min-height: 100vh;
  color: #cbd5e1;
  font-family: 'ZCOOL KuaiLe', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 修改数字字体为艺术字体 */
.niu-rank-container .rank-number,
.niu-rank-container .value-number,
.niu-rank-container .data-unit {
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  /* 添加一些样式增强数字的艺术感 */
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.background-decoration {
  position: absolute;
  inset: 0;
  opacity: 0.1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(2rem);
}

.amber-circle {
  top: 5rem;
  left: 2.5rem;
  width: 8rem;
  height: 8rem;
  background-color: #fbbf24;
}

.blue-circle {
  top: 10rem;
  right: 5rem;
  width: 6rem;
  height: 6rem;
  background-color: #60a5fa;
}

.purple-circle {
  bottom: 8rem;
  left: 33%;
  width: 7rem;
  height: 7rem;
  background-color: #a78bfa;
}

.content-wrapper {
  max-width: 80rem;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.title-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.main-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(to right, #fde68a, #fbbf24, #fde68a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}
.main-title svg{
  fill: #fbbf24;
}

.title-glow {
  position: absolute;
  inset: -1.25rem;
  background: linear-gradient(to right, #fbbf2420, #fbbf2420, #fbbf2420);
  filter: blur(2rem);
  border-radius: 50%;
  z-index: -1;
}

.subtitle {
  font-size: 1.25rem;
  color: #60a5fa;
  font-weight: 500;
  text-shadow: 0 0 12px rgba(96, 165, 250, 0.3);
}

.ranking-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ranking-card {
  position: relative;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, var(--bg-from), var(--bg-to));
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: 0 0.75rem 1.5rem var(--glow-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.ranking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.ranking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1.25rem;
}

.rank-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.5rem;
}

.rank-number {
  font-weight: 900;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-first {
  font-size: 3rem;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 15px rgba(251, 191, 36, 0.7);
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.9));
}

.rank-second {
  font-size: 3rem;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 15px rgba(167, 139, 250, 0.7);
  filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.9));
}

.rank-third {
  font-size: 3rem;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 15px rgba(96, 165, 250, 0.7);
  filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.9));
}

.rank-normal {
  font-size: 3rem;
  width: 2.5rem;
  height: 2.5rem;
  color: #94a3b8;
}

.avatar-section {
  display: flex;
  justify-content: center;
}

.avatar-wrapper {
  position: relative;
}

.avatar-border {
  padding: 0.2rem;
  border-radius: 0.875rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.25);
}

.avatar-image {
  width: 5rem;
  height: 5rem;
  border-radius: 0.725rem;
  object-fit: cover;
  background-color: #334155;
}

.achievement-tag {
  position: absolute;
  bottom: -0.35rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.15rem 0.3rem;
  border-radius: 9999px;
  background: linear-gradient(to right, #ef4444, #f97316);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 0.15rem 0.3rem rgba(0, 0, 0, 0.25);
}

.info-section {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-left {
  flex: 1;
}

.info-right {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-nickname {
  font-weight: 700;
  font-size: 2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 0.75rem;
}

.length-display {
  display: flex;
  align-items: baseline;
  gap: 0.1rem;
  padding: 0.2rem 0.6rem;
}

.length-value {
  font-weight: 700;
  font-size: 4rem;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.length-value-first {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 15px rgba(251, 191, 36, 0.7);
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.9));
}
.length-value-second {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 15px rgba(167, 139, 250, 0.7);
  filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.9));
}
.length-value-third {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 15px rgba(96, 165, 250, 0.7);
  filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.9));
}
.length-value-normal {
  color: #94b8a3;
}

.length-unit {
  font-size: 2.5rem;
  color: #94a3b8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.user-id {
  font-size: 1rem;
  color: #a7b894;
  margin-top: 0;
  margin-bottom: 0.25rem;
}

.data-section {
  display: flex;
  gap: 1rem;
}

.data-item {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
}

.value-number {
  font-weight: 900;
  font-size: 1.5rem;
}

.data-unit {
  color: #00acf1;
  font-size: 0.9rem;
}

.data-label {
  color: #b9ff7b;
  font-size: 1rem;
  font-weight: 500;
}

.bottom-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.3rem;
  opacity: 0.8;
}
</style>