<template>
    <div :class="s.content">
        <el-form :inline="true"
            :model="form">
            <el-form-item label="关键字">
                <el-input v-model="form.search"
                    clearable
                    placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                    @click="$refs.AddModal.open()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="filterList"
            v-loading="loading"
            :class="s.table"
            border>
            <el-table-column prop="_id"
                label="项目id"
                width="180">
            </el-table-column>
            <el-table-column prop="name"
                label="项目名称"
                width="280">
                <template slot-scope="scope">
                    <el-button type="text"
                        @click="$router.push({
                        name:'yapi.interface.list',
                        query: {
                            ...scope.row
                        }})">{{scope.row.name}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="url"
                show-overflow-tooltip
                label="baseUrl">
            </el-table-column>
            <el-table-column prop="token"
                show-overflow-tooltip
                label="token">
            </el-table-column>
            <el-table-column fixed="right"
                label="操作"
                width="80">
                <template slot-scope="scope">
                    <el-button type="text"
                        @click="del(scope)"
                        size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-modal ref="AddModal"
            @success="success"></add-modal>
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
            form: {
                search: '',
            },
            loading: false,
            projects: [],
        };
    },
    computed: {
        filterList() {
            if (!this.projects.length) return [];
            return this.projects.filter(item =>
                item.name.includes(this.form.search) || item.token.includes(this.form.search) ||
                `${item._id}`.includes(this.form.search))
        },
    },
    mounted() {
        this.getProjects();

    },
    methods: {
        async getProjects() {
            this.projects = this.$ctx.eStore.get('yapiList') || [];
        },
        success(row) {
            console.log(row);
            if (this.projects.map(item => item._id).includes(row._id)) {
                this.$message.error('添加失败，项目已存在！')
            } else {
                this.projects.push(row)
                this.$ctx.eStore.set('yapiList', this.projects)

            }
        },
        reset() {
            this.form.search = ''
        },
        del({ $index }) {
            this.projects.splice($index, 1);
            this.$ctx.eStore.set('yapiList', this.projects)
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
