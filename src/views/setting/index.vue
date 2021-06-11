<template>
    <div :class="s.view">
        <setting-list :class="s.content"
            :list="list"
            @item-confirm="itemConfirm"
            @editEvent="editEvent">
            <template #version>
                <p>{{version}}</p>
            </template>
            <template #debug>
                <i @click="debugOpen"
                    :class="['ewen-iconyiwen', s.icon]"></i>
            </template>
        </setting-list>
        <el-button type="primary"
            slot="reference"
            @click="refresh">刷新</el-button>
    </div>
</template>

<script>
const remote = require('@electron/remote')
import SettingList from './SettingList.vue';
export default {
    components: {
        SettingList
    },
    data() {
        return {
            visible: false,
            docUrl: '',
            version: '',
        };
    },
    computed: {
        list() {
            return [
                {
                    id: 3,
                    label: '当前版本',
                    type: 'custom',
                    slotItemName: 'version',
                },
                {
                    id: 2,
                    label: '文档地址',
                    type: 'input',
                    value: this.docUrl,
                },
                {
                    id: 1,
                    label: '打开调试',
                    type: 'custom',
                    slotItemName: 'debug',
                },
            ]
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.docUrl = this.$ctx.eStore.get('docUrl') || '';
            this.version = `v${remote.app.getVersion()}`
            this.$ctx.store.commit('doc/setUrl', this.docUrl)
        },
        reset() {
            this.visible = false
        },
        refresh() {
            this.$message.success('刷新成功！其实什么事情都没干！嘿嘿')
            this.init()
        },
        debugOpen() {
            remote.getCurrentWindow().webContents.openDevTools()
        },
        editEvent() {
        },
        itemConfirm({ val, item }) {
            const { id } = item
            switch (id) {
                case 2:
                    this.$ctx.eStore.set('docUrl', val)
                    this.init()
                    break;
                default:
                    break;
            }
        }
    }
};
</script>

<style lang="scss" module="s">
.view {
    padding: 16px 32px 32px;
}
.content {
    min-width: 800px;
    .icon {
        font-size: 18px;
        color: #999;
        margin-right: 4px;
        cursor: pointer;
        &:hover {
            color: #59c993;
        }
    }
}
</style>
