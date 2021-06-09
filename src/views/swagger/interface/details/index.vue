<template>
    <Page>
        <div :class="s.main"
            v-loading="loading">
            <h3 :class="s.title">基本信息</h3>
            <div :class="s.info">
                <el-row :class="s.row">
                    <el-col :span="8">
                        <label>接口名称：</label>
                        <span> {{info.title}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>描述：</label>
                        <span> {{info.description}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>版本：</label>
                        <span> {{info.version}}</span>
                    </el-col>
                </el-row>
                <el-row :class="s.row">
                    <el-col :span="24">
                        <label>Tags：</label>
                        <span> {{info.tags}}</span>
                    </el-col>
                </el-row>
                <el-row :class="s.row">
                    <el-col :span="24">
                        <label>接口路径：</label>
                        <i>{{info.method}}</i>
                        <span> {{info.path}}</span>
                        <i :class="s.cope"
                            v-if="info.path"
                            @click="copePath">复制</i>
                    </el-col>
                </el-row>
            </div>
            <h3 :class="s.title">请求参数</h3>
            <div :class="s.wrap">
                <template v-if="info.req_headers&&info.req_headers.length">
                    <h4>Headers：</h4>
                    <el-table :class="s.table"
                        :data="info.req_headers"
                        border
                        style="width: 100%">
                        <el-table-column prop="name"
                            label="参数名称"
                            width="180">
                        </el-table-column>
                        <el-table-column prop="value"
                            label="参数值"
                            width="180">
                        </el-table-column>
                        <el-table-column prop="required"
                            :formatter="(row)=>row.required==='1'?'是':'非必须'"
                            label="是否必须	">
                        </el-table-column>
                        <el-table-column prop="address"
                            label="示例">
                        </el-table-column>
                        <el-table-column prop="remark"
                            label="备注">
                        </el-table-column>
                    </el-table>
                </template>
                <template v-if="reqQuery.length">
                    <h4>Query： <el-button type="text"
                            @click="cope({type:reqBodyType,children:reqQuery})">复制</el-button>
                    </h4>
                    <el-table :class="s.table"
                        :data="reqQuery"
                        border
                        style="width: 100%">
                        <el-table-column prop="name"
                            label="参数名称"
                            width="180">
                        </el-table-column>
                        <el-table-column prop="type"
                            label="类型"
                            width="180">
                        </el-table-column>
                        <el-table-column prop="required"
                            :formatter="(row)=>row.required==='1'?'是':'非必须'"
                            label="是否必须	">
                        </el-table-column>
                        <el-table-column prop="remark"
                            label="备注">
                        </el-table-column>
                        <el-table-column fixed="right"
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button type="text"
                                    size="small"
                                    @click="cope(scope.row)">复制</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <template v-if="reqBody.length">
                    <h4>Body: <el-button type="text"
                            @click="cope({type:reqBodyType,children:reqBody})">复制</el-button>
                    </h4>
                    <el-table :class="s.table"
                        :data="reqBody"
                        row-key="id"
                        border
                        style="width: 100%">
                        <el-table-column prop="name"
                            min-width="250"
                            label="名称">
                        </el-table-column>
                        <el-table-column prop="required"
                            width="100"
                            :formatter="(row)=>row.required==='1'?'是':'非必须'"
                            label="是否必须	">
                        </el-table-column>
                        <el-table-column prop="remark"
                            min-width="250"
                            label="备注">
                        </el-table-column>
                        <el-table-column prop="type"
                            label="类型"
                            width="100">
                        </el-table-column>
                        <el-table-column prop="other"
                            label="其他信息">
                        </el-table-column>
                        <el-table-column fixed="right"
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button type="text"
                                    size="small"
                                    @click="cope(scope.row)">复制</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
            <h3 :class="s.title">返回数据</h3>
            <div :class="s.wrap">
                <el-table :class="s.table"
                    :data="resBody"
                    row-key="id"
                    border
                    style="width: 100%">
                    <el-table-column prop="name"
                        min-width="250"
                        label="名称">
                    </el-table-column>
                    <!-- <el-table-column prop="required"
                        width="100"
                        :formatter="(row)=>row.required==='1'?'是':'否'"
                        label="是否必须	">
                    </el-table-column>
                    <el-table-column prop="default"
                        width="100"
                        label="默认值">
                    </el-table-column> -->
                    <el-table-column prop="remark"
                        min-width="250"
                        label="备注">
                    </el-table-column>
                    <el-table-column prop="type"
                        label="类型"
                        width="100">
                    </el-table-column>
                    <el-table-column prop="other"
                        label="其他信息">
                    </el-table-column>
                    <el-table-column fixed="right"
                        label="操作"
                        width="120">
                        <template slot-scope="scope">
                            <el-button type="text"
                                size="small"
                                @click="cope(scope.row)">复制</el-button>
                            <el-button type="text"
                                :disabled="scope.row.type !=='array'"
                                size="small"
                                @click="$refs.TableModal.open(scope.row)">生成表头</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <table-modal ref="TableModal"></table-modal>
    </Page>
</template>

<script>
import Page from '../../../Page';
import TableModal from './TableModal.vue';

const toJsObject = (arr) => {
    let list = [];
    for (const key in arr) {
        const item = arr[key];
        let str = '';
        if (item.children && item.children.length) {
            if (item.type === 'array') {
                str = `${item.name}:[${toJsObject(item.children)}],`
            } else if (item.type === 'object') {
                str = `${item.name}:${toJsObject(item.children)},`
            }
        } else {
            str = `${item.name}: '', ${item.remark ? `//${item.remark}` : ''}`;
        }
        list.push(str)
    }
    return `{ \n${list.join('\n')}\n}`;
}
export default {
    components: {
        Page,
        TableModal
    },
    data() {
        return {
            loading: false,
            info: '',
            pathInfo: '',
            definitions: '',
            undefined: [{
                clientAuthParams: {
                    agentId: '',
                    corpId: '',
                    feiShuAuthParams: [{
                        appId: '',
                    }],
                },
                name: '',
            }]
        };
    },
    computed: {
        reqQuery() {
            if (!this.pathInfo) return [];
            if (this.pathInfo.consumes) return []; //是否是body
            if (!this.pathInfo.parameters) return [];
            return this.pathInfo.parameters.map(item => {
                return {
                    name: item.name,
                    type: item.type,
                    required: item.required,
                    remark: item.description || '',
                }
            })
        },
        reqBodyType() {
            if (!this.definitions) return 'object'
            if (!this.pathInfo) return 'object'
            if (!this.pathInfo.consumes) return 'object'
            if (!this.pathInfo.parameters) return 'object'
            if (!this.pathInfo.parameters.length) return 'object'
            const [data] = this.pathInfo.parameters
            const { schema: {
                originalRef
            } } = data
            return this.definitions[originalRef].type || 'object'
        },
        reqBody() {
            if (!this.definitions) return []
            if (!this.pathInfo) return [];
            if (!this.pathInfo.consumes) return [];
            if (!this.pathInfo.parameters) return [];
            if (!this.pathInfo.parameters.length) return [];
            const [data] = this.pathInfo.parameters
            if (data.in !== 'body') return [];
            const { schema: {
                originalRef
            } } = data
            let tableList = [];
            this.toTree(this.definitions[originalRef], tableList)
            console.log(tableList);
            return tableList;
        },
        resBody() {
            if (!this.definitions) return []
            if (!this.pathInfo) return [];
            if (!this.pathInfo.responses) return [];
            const res200 = this.pathInfo.responses['200']
            const { schema: {
                originalRef
            } } = res200
            let tableList = [];
            this.toTree(this.definitions[originalRef], tableList)
            console.log(tableList);
            return tableList;
        }
    },
    mounted() {
        this.getDetails();
    },
    methods: {
        async getDetails() {
            try {
                this.loading = true;
                const { url, path, type } = this.$route.query
                const res = await this.$ctx.apiSwagger.get(url)
                this.loading = false;
                console.log(path);
                console.log(res);
                this.definitions = res.definitions;
                const baseInfo = {
                    ...res.info
                }
                const pathInfo = res.paths[path][type]
                console.log(baseInfo);
                console.log(pathInfo);
                this.info = {
                    title: pathInfo.summary,
                    description: pathInfo.description,
                    tags: pathInfo.tags,
                    version: baseInfo.version,
                    path: `${res.basePath}${path}`,
                    method: type,
                }
                this.pathInfo = pathInfo
                let tableList = []
                this.toTree(pathInfo, tableList)
                console.log(tableList);
            } catch (e) {
                this.$message.error('获取项目详情失败')
            }
        },
        toTree(obj, list, pid = '') {
            if (obj && obj.properties) {
                const { properties } = obj
                for (const key in properties) {
                    if (Object.hasOwnProperty.call(properties, key)) {
                        const item = properties[key];
                        const id = pid ? `${pid}-${key}` : `${key}`;
                        const data = {
                            id,
                            name: key,
                            type: item.originalRef ? 'object' : item.type,
                            other: item.format || '',
                            remark: item.description || '',
                            required: '',
                            defalut: '',
                            children: []
                        }
                        if (item.schema) {
                            const ref = item.schema.originalRef
                            console.log(this.definitions[ref]);
                            this.toTree(this.definitions[ref], data.children, id)
                        }
                        if (item.type === 'object') {
                            console.log('dddeeee', item);
                            //this.toTree(item, data.children, id)
                        }
                        if (item.originalRef) {
                            // 对象时
                            this.toTree(this.definitions[item.originalRef], data.children, id)
                        }
                        if (item.type === 'array') {
                            console.log('items', item);
                            const ref = item.items.originalRef
                            this.toTree(this.definitions[ref], data.children, id)
                        }
                        list.push(data)
                    }
                }
            }
        },
        cope(obj) {
            console.log(obj, '复制');
            let data = '';
            if (obj.type === 'array') {
                if (obj.name) {
                    data = `${obj.name}:[${toJsObject(obj.children)}]`
                } else {
                    data = `[${toJsObject(obj.children)}]`
                }

            } else if (obj.type === 'object') {
                console.log('对象');
                if (obj.name) {
                    data = `${obj.name}:${toJsObject(obj.children)}`
                } else {
                    data = `${toJsObject(obj.children)}`
                }
            } else {
                data = `${obj.name}: '', ${obj.remark ? `//${obj.remark}` : ''}`;
            }
            this.$ctx.util.copy(data)
            this.$message.success('成功复制到粘贴板');
        },
        copePath() {
            this.$ctx.util.copy(this.info.path)
            this.$message.success('成功复制到粘贴板');
        }
    },
};
</script>

<style lang="scss" module="s">
.top {
    flex: 1 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    min-width: 1280px;
    height: 65px;
    max-height: 65px;
    box-shadow: 0 3px 8px 0 rgba(116, 129, 141, 0.1);
    border-bottom: 1px solid #d4dadf;
    background-color: #fff;
    z-index: 20;
    > h3 {
        color: #0bb27a;
        font-weight: 500;
    }
    .back {
        position: absolute;
        left: 100px;
        top: 50%;
        margin-top: -16px;
    }
}
.main {
    .title {
        border-left: 3px solid #0bb27a;
        margin: 24px 0;
        padding-left: 8px;
    }
    .wrap {
        margin-left: 16px;
        h4 {
            margin: 8px 0;
        }
        .table {
            margin-bottom: 24px;
        }
    }
    .info {
        margin-left: 16px;
        .row {
            margin-bottom: 16px;
        }
        i {
            color: #0bb27a;
            background-color: rgb(207, 239, 223);
            padding: 2px 4px;
            border-radius: 4px;
        }
        span {
            color: #333;
        }
        label {
            width: 100px;
            font-weight: 500;
        }
        .cope {
            margin-left: 16px;
            cursor: pointer;
        }
    }
}
</style>
