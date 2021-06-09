<template>
    <div :class="s.content">
        <div :class="s.nav">
            <div :class="s.back">
                <el-button type="text" @click="$router.go(-1)">返回</el-button>  |
            </div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item  v-for="(item,index) in list" :key="index">{{item.meta.title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    computed:{
        list(){
            if(!this.$route&&this.$route.matched) return []
            return this.$route.matched.filter((item => item.meta && item.meta.title))
        }
    }
};
</script>

<style lang="scss" module="s">
.content {
    min-width: 900px;
    .nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 12px;
        .back{
            color: #666;
            margin-right: 8px;
        }
    }
}
</style>
