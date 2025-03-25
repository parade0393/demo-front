<script lang="ts" setup>
// 仪表盘页面
</script>

<template>
  <div class="dashboard-container">
    <el-card class="dashboard-card">
      <template #header>
        <div class="card-header">
          <span>系统概览</span>
        </div>
      </template>
      <div class="dashboard-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <el-statistic title="用户数" :value="1254" />
              <el-icon class="stat-icon"><User /></el-icon>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <el-statistic title="文章数" :value="856" />
              <el-icon class="stat-icon"><Document /></el-icon>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <el-statistic title="分类数" :value="32" />
              <el-icon class="stat-icon"><Folder /></el-icon>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <el-statistic title="评论数" :value="2451" />
              <el-icon class="stat-icon"><ChatDotRound /></el-icon>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .dashboard-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dashboard-content {
      margin-top: 20px;

      .stat-card {
        position: relative;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .stat-icon {
          position: absolute;
          right: 20px;
          top: 20px;
          font-size: 30px;
          color: #ebeef5;
        }

        &:hover {
          .stat-icon {
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>
