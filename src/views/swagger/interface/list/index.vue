<template>
    <page>
        <div :class="s.top">
            <section>
                <label style="margin-right: 12px;">关键字&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <el-input style="width:200px;margin-right: 12px;"
                    v-model="keyword"
                    clearable
                    placeholder="关键字">
                </el-input>
            </section>
            <section>
                <el-button type="primary"
                    @click="getList">查询</el-button>
            </section>
        </div>
        <el-table :data="list"
            v-loading="loading"
            :class="s.table"
            border>
            <el-table-column prop="summary"
                label="名称"
                width="180">
            </el-table-column>
            <el-table-column prop="fullPath"
                min-width="280"
                label="路径">
            </el-table-column>
            <el-table-column prop="type"
                width="80"
                label="方式">
                <template slot-scope="scope">
                    <el-tag :type="tag[scope.row.type]||null">{{scope.row.type}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="description"
                min-width="280"
                label="备注">
            </el-table-column>
            <el-table-column fixed="right"
                label="操作"
                width="80">
                <template slot-scope="scope">
                    <el-button type="text"
                        @click="$router.push({
                        name:'swagger.interface.details',
                        query: {
                            path: scope.row.path,
                            url: $route.query.url,
                            type: scope.row.type,
                        }})"
                        size="small">详情</el-button>

                </template>
            </el-table-column>
        </el-table>
    </page>
</template>

<script>
import Page from '../../../Page.vue';
export default {
    components: {
        Page
    },
    data() {
        return {
            loading: false,
            keyword: '',
            list: [],
            tag: {
                get: 'info',
                post: 'success',
                put: 'warning',
                delete: 'danger'
            }
        };
    },
    async mounted() {
        this.getList()
    },
    methods: {
        async getList() {
            const { url } = this.$route.query
            const { basePath, paths } = await this.$ctx.apiSwagger.get(url)
            let list = []
            Object.keys(paths).forEach(key => {
                Object.keys(paths[key]).forEach(type => {
                    list.push({
                        ...paths[key][type],
                        type: type || '',
                        path: key || '',
                        fullPath: `${basePath}${key}` || ''
                    })
                })
            })
            this.list = list.filter(item =>
                item.fullPath.includes(this.keyword)
                || item.summary.includes(this.keyword)
                || item.type.includes(this.keyword)
                || (item.description && item.description.includes(this.keyword)))
            console.log(this.list);
        }
    },
};
</script>

<style lang="scss" module="s">
.top {
    min-width: 600px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    section {
        margin-right: 16px;
        display: inline-block;
        label {
            color: #666;
        }
    }
    margin-bottom: 16px;
}
.table {
}
</style>
