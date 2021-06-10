<template>
    <keep-alive :include="['interfaceList']">
        <router-view></router-view>
    </keep-alive>
</template>

<script>
export default {
    data() {
        return {
        };
    },
};
</script>

<style lang="scss" module="s">
</style>
