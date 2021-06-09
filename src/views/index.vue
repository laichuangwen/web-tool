<template>
    <div id="app">
        <menu-list :list="list">
            <template #bottom>
                <div :class="s.bottom">
                    <router-link :class="[s.nav,$route.path.includes('setting')?s.active:'']"
                        :to="{name: 'setting'}">
                        <i :class="['ewen-iconhuaban',s.icon]"></i>
                    </router-link>
                </div>
            </template>
            <router-view />
        </menu-list>
    </div>
</template>
<script>
import MenuList from './MenuList.vue';


export default {
    components: {
        MenuList
    },
    data() {
        return {

        };
    },
    computed: {
        list() {
            return [
                {
                    title: 'git',
                    icon: 'ewen-icongit',
                    to: {
                        name: 'git',
                        path: 'git',
                    }
                },
                {
                    title: 'swagger',
                    icon: 'ewen-iconapi1',
                    to: {
                        name: 'swagger',
                        path: 'swagger',
                    }
                },
                {
                    title: 'yapi',
                    icon: 'ewen-iconapi',
                    to: {
                        name: 'yapi',
                        path: 'yapi',
                    }
                },
                {
                    title: '文档',
                    icon: 'ewen-iconel-icon-my-fangdan',
                    show: ! this.$ctx.store.state.doc.url,
                    to: {
                        name: 'doc',
                        path: 'doc',
                    }
                },
            ].filter(item=>!item.show)
        }
    },
    methods: {

    }
};
</script>
<style lang="scss"  module="s">
.bottom {
    width: 66px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.nav {
    width: 66px;
    height: 45px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    &.active {
        &::before {
            content: '';
            background: white;
            width: 2px;
            height: 80%;
            position: absolute;
            left: 0;
            top: 10%;
        }
    }
    .icon {
        font-size: 28px;
        color: #fff;
    }
    &:hover {
        opacity: 0.7;
    }
}
.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
}
</style>
