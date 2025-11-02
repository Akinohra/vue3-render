<script setup lang="ts">
defineProps<{
  userInfo: {
    userId: number
    nickname: string
    rank: number
    percent: number
    cooldownTime: string // 冷却时间
    length: number
    injectedCount: number // 注入次数
    ejaculateCount: number // 释放次数
    charm: number // 魅力
    injectedValue: number // 被注射价值
    ejaculatedValue: number // 注射价值
  }
}>()
</script>

<template>
  <div class="user-info-container">
    <!-- 动态背景 -->
    <div class="background-animation">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="content-wrapper">

      <!-- 现代化用户卡片 -->
      <div class="modern-user-card" v-if="userInfo">
        <!-- 排名徽章 -->
        <div class="modern-rank-badge">
          <div 
            class="rank-inner"
            :class="[
              userInfo.rank === 1 ? 'rank-first' : 
              userInfo.rank === 2 ? 'rank-second' : 
              userInfo.rank === 3 ? 'rank-third' : 
              'rank-normal'
            ]"
          >
            <span class="rank-text">{{ userInfo.rank }}</span>
            <span class="rank-label">排名</span>
          </div>
        </div>

        <div class="card-content">
          <!-- 头像与基本信息 -->
          <div class="profile-section">
            <div class="avatar-container">
              <div 
                class="avatar-ring"
                :class="userInfo.rank === 1 ? 'ring-gold' : 
                       userInfo.rank === 2 ? 'ring-purple' : 
                       userInfo.rank === 3 ? 'ring-blue' : 
                       'ring-gray'"
              >
                <img 
                  class="avatar-image" 
                  :src="`https://q1.qlogo.cn/g?b=qq&nk=${userInfo.userId}&s=0`" 
                  :alt="userInfo.nickname" 
                />
              </div>
              <div v-if="userInfo.length >= 18" class="achievement-badge">
                超神
              </div>
            </div>
            
            <div class="user-basic-info">
              <h2 
                class="user-nickname"
                :class="userInfo.rank === 1 ? 'text-gold' : 
                        userInfo.rank === 2 ? 'text-purple' : 
                        userInfo.rank === 3 ? 'text-blue' : 
                        'text-gray'"
              >
                {{ userInfo.nickname }}
              </h2>
              <div class="user-id">ID: {{ userInfo.userId }}</div>
            </div>
          </div>

          <!-- 尺寸展示区 -->
          <div class="size-display-section">
            <div class="size-display-container">
              <div class="size-circle">
                <div 
                  class="size-value-wrapper"
                  :class="userInfo.rank === 1 ? 'text-gold' : 
                          userInfo.rank === 2 ? 'text-purple' : 
                          userInfo.rank === 3 ? 'text-blue' : 
                          'text-gray'"
                >
                  {{ userInfo.length }}
                </div>
                <div class="size-unit">cm</div>
              </div>
              <div class="size-label">长度</div>
            </div>
          </div>

          <!-- 数据统计区 -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ userInfo.injectedCount }}<span class="stat-unit">次</span></div>
              <div class="stat-label">被透</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">{{ userInfo.ejaculateCount }}<span class="stat-unit">次</span></div>
              <div class="stat-label">打胶</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">{{ userInfo.charm }}<span class="stat-unit">点</span></div>
              <div class="stat-label">魅力</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">{{ userInfo.percent }}<span class="stat-unit">%</span></div>
              <div class="stat-label">击败玩家</div>
              
            </div>
          </div>

          <!-- 附加数据区 -->
          <div class="additional-stats">
            <div class="additional-stat-row">
              <div class="stat-item">
                <span class="stat-item-label">被注入总量</span>
                <span class="stat-item-value">{{ userInfo.injectedValue }}<span class="stat-unit-small">ml</span></span>
              </div>
              
              <div class="stat-item">
                <span class="stat-item-label">释放总量</span>
                <span class="stat-item-value">{{ userInfo.ejaculatedValue }}<span class="stat-unit-small">ml</span></span>
              </div>
            </div>
            
            <div class="cooldown-section">
              <div class="cooldown-label">冷却时间</div>
              <div class="cooldown-value">{{ userInfo.cooldownTime }}</div>
            </div>
          </div>
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
/* 容器样式 */
.user-info-container {
  background: linear-gradient(135deg, #0c0f1d 0%, #12172e 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 动态背景 */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  /* width: 100%;
  height: 100%; */
  overflow: hidden;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #ff9a9e, #fad0c4);
  top: 10%;
  left: 5%;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(45deg, #a1c4fd, #c2e9fb);
  bottom: 15%;
  right: 10%;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #d4fc79, #96e6a1);
  top: 50%;
  left: 20%;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(rgba(92, 119, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(92, 119, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
}


/* 现代化用户卡片 */
.modern-user-card {
  background: rgba(25, 30, 50, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.6),
    inset 0 0 20px rgba(100, 150, 255, 0.1);
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 排名徽章 */
.modern-rank-badge {
  position: absolute;
  top: -32px;
  right: 30px;
  z-index: 10;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-inner {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transform: rotate(15deg);
  transition: transform 0.3s ease;
}

.rank-first {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: 2px solid #FFD700;
}

.rank-second {
  background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
  border: 2px solid #C0C0C0;
}

.rank-third {
  background: linear-gradient(135deg, #CD7F32, #A0522D);
  border: 2px solid #CD7F32;
}

.rank-normal {
  background: linear-gradient(135deg, #6c757d, #495057);
  border: 2px solid #6c757d;
}

.rank-text {
  font-weight: 900;
  font-size: 2.5rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.rank-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-content {
  padding: 2.5rem;
}

/* 个人信息区域 */
.profile-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.avatar-container {
  position: relative;
}

.avatar-ring {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.ring-purple {
  background: linear-gradient(135deg, #8A2BE2, #9370DB);
}

.ring-blue {
  background: linear-gradient(135deg, #1E90FF, #00BFFF);
}

.ring-gray {
  background: linear-gradient(135deg, #6c757d, #495057);
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #1e293b;
  border: 3px solid rgba(25, 30, 50, 0.8);
}

.achievement-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(255, 65, 108, 0.4);
}


.user-basic-info {
  flex: 1;
}

.user-nickname {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.3rem;
}

.text-gold {
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  background: linear-gradient(45deg, #ffd700, #ffaa00, #ffd700, #fff470, #ffd700);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  background-size: 200% 200%;
}


.text-purple {
  color: #8A2BE2;
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
}

.text-blue {
  color: #1E90FF;
  text-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
}

.text-gray {
  color: #adb5bd;
  text-shadow: 0 0 10px rgba(173, 181, 189, 0.5);
}

.user-id {
  font-size: 1.2rem;
  color: #a3b3c7;
  font-weight: 400;
}

/* 尺寸展示区 */
.size-display-section {
  text-align: center;
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: center;
}

.size-display-container {
  position: relative;
}

.size-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.3),
    0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.size-circle::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    transparent, 
    rgba(168, 239, 255, 0.5), 
    transparent 30%
  );
  z-index: 1;
}

.size-circle::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: rgba(25, 30, 50, 0.9);
  border-radius: 50%;
  z-index: 2;
}

.size-value-wrapper {
  font-weight: 900;
  font-size: 4.5rem;
  line-height: 1;
  z-index: 3;
  margin-bottom: 0.5rem;
  background-clip: text;
  -webkit-background-clip: text;
}

.text-purple {
  background: linear-gradient(135deg, #8A2BE2, #9370DB);
}

.text-blue {
  background: linear-gradient(135deg, #1E90FF, #00BFFF);
}

.text-gray {
  background: linear-gradient(135deg, #adb5bd, #6c757d);
}

.size-unit {
  font-size: 1.8rem;
  color: #a3b3c7;
  font-weight: 600;
  z-index: 3;
  margin-top: -0.5rem;
}

.size-label {
  font-size: 1.5rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
  z-index: 3;
}

/* 数据统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 1.2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.3rem;
  color: #37fbff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background: linear-gradient(90deg, #37fbff, #00c6ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.stat-label {
  font-size: 1.5rem;
  color: #a3b3c7;
  margin-bottom: 0.2rem;
}

.stat-unit {
  font-size: 1.5rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 附加数据区 */
.additional-stats {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.additional-stat-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  width: 100%;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item-label {
  color: #a3b3c7;
  font-size: 1.5rem;
  flex: 1;
}

.stat-item-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 2rem;
  text-align: right;
  min-width: fit-content;
  margin-left: 1rem;
  font-family: 'Bahnschrift SemiBold', 'Resonay', 'Lovefern Script', 'Beloved Script', cursive;
  background: linear-gradient(90deg, #8A2BE2, #FF6B6B);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.stat-unit-small {
  font-size: 1.2rem;
  color: #6c757d;
  margin-left: 0.3rem;
  font-weight: normal;
}

.cooldown-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.cooldown-label {
  color: #a3b3c7;
  font-size: 1.5rem;
}

.cooldown-value {
  color: #2fb2bb;
  font-weight: 700;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.4rem 1rem;
  border-radius: 30px;
  background: linear-gradient(90deg, #d9f3f5, #42c882);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info-container {
    padding: 1rem;
  }
  
  .main-title {
    font-size: 1.8rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .profile-section {
    flex-direction: column;
    text-align: center;
  }
  
  .user-basic-info {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .size-circle {
    width: 170px;
    height: 170px;
  }
  
  .size-value-wrapper {
    font-size: 3.8rem;
  }
  
  .size-unit {
    font-size: 1.5rem;
  }
  
  .modern-rank-badge {
    width: 70px;
    height: 70px;
    top: -15px;
    right: 20px;
  }
  
  .rank-inner {
    width: 50px;
    height: 50px;
  }
  
  .rank-text {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .size-circle {
    width: 150px;
    height: 150px;
  }
  
  .size-value-wrapper {
    font-size: 3.2rem;
  }
  
  .size-unit {
    font-size: 1.3rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 2.5rem;
  }
}
</style>