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
      <div class="orb orb-4"></div>
      <div class="grid-overlay"></div>
      <div class="floating-particles"></div>
    </div>

    <div class="content-wrapper">
      <!-- 现代化用户卡片 -->
      <div class="modern-user-card" v-if="userInfo">
        <div class="card-header">
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
        </div>

        <div class="card-content">
          <!-- 尺寸展示区 -->
          <div class="size-display-section">
            <div class="size-display-container">
              <div class="size-value-wrapper"
                :class="userInfo.rank === 1 ? 'text-gold' : 
                        userInfo.rank === 2 ? 'text-purple' : 
                        userInfo.rank === 3 ? 'text-blue' : 
                        'text-gray'">
                <span class="size-value">{{ userInfo.length }}</span>
                <span class="size-unit">cm</span>
              </div>
            </div>
          </div>

          <!-- 数据统计区 -->
          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ userInfo.injectedCount }}<span class="stat-unit">次</span></div>
                <div class="stat-label">被透</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-value">{{ userInfo.ejaculateCount }}<span class="stat-unit">次</span></div>
                <div class="stat-label">释放</div>
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
  min-height: 100vh;
}

/* 动态背景 */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
  width: 100%;
  height: 100%;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #ff9a9e, #fad0c4);
  top: 5%;
  left: 2%;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #a1c4fd, #c2e9fb);
  bottom: 10%;
  right: 5%;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #d4fc79, #96e6a1);
  top: 40%;
  left: 15%;
}

.orb-4 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #84fab0, #8fd3f4);
  top: 70%;
  left: 70%;
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
  background-size: 20px 20px;
}

.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(rgba(255, 255, 255, 0.15) 0.5px, transparent 0.5px);
  background-size: 40px 40px, 20px 20px;
  background-position: 0 0, 20px 20px;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1rem;
  background: rgba(30, 35, 60, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* 排名徽章 */
.modern-rank-badge {
  position: relative;
  top: 0;
  right: 0;
  z-index: 10;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-inner {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  transform: rotate(10deg);
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
  font-size: 1.8rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.rank-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-content {
  padding: 1.5rem 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

/* 个人信息区域 */
.profile-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 300px;
}

.avatar-container {
  position: relative;
}

.avatar-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 3px;
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
  border: 2px solid rgba(25, 30, 50, 0.8);
}

.achievement-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(255, 65, 108, 0.4);
}

.user-basic-info {
  flex: 1;
}

.user-nickname {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 0.2rem;
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
  font-size: 1rem;
  color: #a3b3c7;
  font-weight: 400;
}

/* 尺寸展示区 */
.size-display-section {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(30, 35, 60, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 
    0 10px 20px -5px rgba(0, 0, 0, 0.3),
    inset 0 0 15px rgba(100, 150, 255, 0.1);
}

.size-display-container {
  position: relative;
}

.size-value-wrapper {
  font-weight: 900;
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-end;
  gap: 0.3rem;
}

.size-value {
  font-size: 3.5rem;
}

.size-unit {
  font-size: 1.85rem;
  margin-bottom: 0.3rem;
  -webkit-text-fill-color: #f5895e; /* 覆盖父元素的渐变色影响 */
  background: none; /* 移除父元素的背景渐变 */
  background-clip: initial; /* 重置背景剪裁 */
}

.size-label {
  font-size: 1rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
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
  background: linear-gradient(135deg, #8A2BE2, #9370DB);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.text-blue {
  background: linear-gradient(135deg, #1E90FF, #00BFFF);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.text-gray {
  background: linear-gradient(135deg, #adb5bd, #6c757d);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* 统计部分 */
.stats-section {
  flex: 2;
  min-width: 300px;
}

/* 数据统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.8rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
  color: #37fbff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background: linear-gradient(90deg, #37fbff, #00c6ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.stat-label {
  font-size: 0.9rem;
  color: #a3b3c7;
  margin-bottom: 0.1rem;
}

.stat-unit {
  font-size: 1rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 附加数据区 */
.additional-stats {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.additional-stat-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  width: 100%;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item-label {
  color: #a3b3c7;
  font-size: 1.15rem;
  flex: 1;
}

.stat-item-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 1.5rem;
  text-align: right;
  min-width: fit-content;
  margin-left: 0.5rem;
  font-family: 'Bahnschrift SemiBold', 'Resonay', 'Lovefern Script', 'Beloved Script', cursive;
  background: linear-gradient(90deg, #8A2BE2, #FF6B6B);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.stat-unit-small {
  font-size: 0.8rem;
  color: #6c757d;
  margin-left: 0.2rem;
  font-weight: normal;
}

.cooldown-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.cooldown-label {
  color: #a3b3c7;
  font-size: 1.15rem;
}

.cooldown-value {
  color: #2fb2bb;
  font-weight: 700;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
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
  
  .content-wrapper {
    padding: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  
  .card-content {
    flex-direction: column;
    padding: 1rem;
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
  
  .size-value-wrapper {
    font-size: 2.5rem;
  }
  
  .size-value {
    font-size: 2.5rem;
  }
  
  .size-unit {
    font-size: 1rem;
  }
  
  .modern-rank-badge {
    width: 70px;
    height: 70px;
  }
  
  .rank-inner {
    width: 50px;
    height: 50px;
  }
  
  .rank-text {
    font-size: 1.2rem;
  }
  
  .avatar-ring {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .size-value-wrapper {
    font-size: 2rem;
  }
  
  .size-value {
    font-size: 2rem;
  }
  
  .size-unit {
    font-size: 0.9rem;
  }
  
  .stat-card {
    padding: 0.6rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}
</style>