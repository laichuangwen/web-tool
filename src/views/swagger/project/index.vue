<template>
    <div :class="s.content">
        <el-button type="primary"
            @click="add">添加swagger地址</el-button>
        <el-table :data="list"
            v-loading="loading"
            :class="s.table"
            border>
            <el-table-column prop="name"
                label="名称"
                width="180">
            </el-table-column>
            <el-table-column prop="url"
                min-width="280"
                label="url">
            </el-table-column>
            <el-table-column prop="remark"
                min-width="280"
                label="备注">
            </el-table-column>
            <el-table-column fixed="right"
                label="操作"
                width="160">
                <template slot-scope="scope">
                    <el-button type="text"
                        @click="$router.push({
                        name:'swagger.interface.list',
                        query: {
                            url: scope.row.url
                        }})"
                        size="small">接口</el-button>
                    <el-button type="text"
                        @click="edit(scope)"
                        size="small">编辑</el-button>
                    <el-button type="text"
                        @click="del(scope)"
                        size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <AddModal ref="AddModal"
            @success="opChange"></AddModal>
    </div>
</template>

<script>
import AddModal from './AddModal.vue';
export default {
    components: {
        AddModal
    },
    data() {
        return {
            list: [],
            loading: false,
            projects: [],
        };
    },
    mounted() {
        this.getProjects()
    },
    methods: {
        getProjects() {
            this.list = this.$ctx.eStore.get('swaggerList') || [];
        },
        opChange({ type, form }) {
            if (type === 'add') {

                this.list.push(form)
                this.$ctx.eStore.set('swaggerList', this.list)
            } else {
                const index = this.list.findIndex(item => item.id == form.id)
                this.list.splice(index, 1, form)
                this.$ctx.eStore.set('swaggerList', this.list)
            }
            this.getProjects()
        },
        add() {
            this.$refs.AddModal.open()
        },
        edit({ row }) {
            this.$refs.AddModal.open(row)
        },
        del({ $index }) {
            console.log($index);
            this.$confirm('您确定删除该仓库吗?<br/>说明：<br/>仅删除开发助手的仓库记录，不会删除目录的文件', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                this.list.splice($index, 1)
                this.$ctx.eStore.set('swaggerList', this.list)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getProjects()

            })

        },
    }
};
</script>

<style lang="scss" module="s">
.content {
    .table {
        width: 100%;
        margin-top: 8px;
    }
    .op {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>
