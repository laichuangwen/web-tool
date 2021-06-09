<template>
    <Page :class="s.view"
        class="main_intetface_view">
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
                        <label>创建人：</label>
                        <span> {{info.username}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>状态：</label>
                        <span> {{info.status}}</span>
                    </el-col>
                </el-row>
                <el-row :class="s.row">
                    <el-col :span="24">
                        <label>Tag：</label>
                        <span> {{info.tag}}</span>
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
                            @click="cope({type:'array',children:reqQuery})">复制</el-button>
                    </h4>
                    <el-table :class="s.table"
                        :data="reqQuery"
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
                            @click="cope({type:'array',children:reqBody})">复制</el-button>
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
                        <el-table-column prop="default"
                            width="100"
                            label="默认值">
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
        <el-backtop target=".main_intetface_view"></el-backtop>
    </Page>
</template>

<script>
import Page from '../../../Page';
import TableModal from './TableModal.vue';
const toTree = (obj, list, pid = '') => {
    const { properties } = obj;
    if (properties) {
        for (const key in properties) {
            if (Object.hasOwnProperty.call(properties, key)) {
                const item = properties[key];
                const id = pid ? `${pid}-${key}` : `${key}`;
                const data = {
                    id,
                    name: key,
                    type: item.type,
                    other: item.format || '',
                    remark: item.description || '',
                    required: '',
                    defalut: '',
                    children: []
                }
                if (item.type === 'object') {
                    toTree(item, data.children, id)
                }
                if (item.type === 'array') {
                    toTree(item.items, data.children, id)
                }
                list.push(data)
            }
        }
    }
}
const toJsObject = (arr) => {
    let list = [];
    for (const key in arr) {
        const item = arr[key];
        let str = '';
        if (item.children && item.children.length) {
            str = `${item.name}:[${toJsObject(item.children)}],`
        } else {
            str = `${item.name}: '', ${item.remark ? `//${item.remark}` : ''}`;
        }
        list.push(str)
    }
    return `{ \n${list.join('\n')}\n}`;
}
export default {
    components: {
        TableModal,
        Page
    },
    data() {
        return {
            loading: false,
            info: '',
        };
    },
    mounted() {
        this.getDetails();
    },
    computed: {
        reqQuery() {
            if (!this.info) return [];
            if (!this.info.req_query) return [];
            return this.info.req_query.map(item => {
                return {
                    name: item.name,
                    value: item.value,
                    required: item.required,
                    remark: item.desc || '',
                }
            })
        },
        reqBody() {
            if (!this.info) return [];
            if (this.info.req_body_type !== 'json') return [];
            if (!this.info.req_body_other) return [];
            const body = JSON.parse(this.info.req_body_other)
            let tableList = [];
            toTree(body, tableList)
            console.log(tableList);
            return tableList;
        },
        resBody() {
            if (!this.info) return [];
            const body = JSON.parse(this.info.res_body)
            let tableList = [];

            toTree(body, tableList)
            console.log(tableList);
            return tableList;
        }
    },
    methods: {
        async getDetails() {
            try {
                this.loading = true;
                const { _id, project_id,token ,url} = this.$route.query
                console.log(this.$route.query);
                const res = await this.$ctx.apiYapi.get(`${url}/api/interface/get`, {
                    params: {
                        token,
                        id: _id,
                        project_id: project_id,
                    }
                })
                this.loading = false;
                console.log(res);
                this.info = res;
            } catch (e) {
                this.$message.error('获取项目失败')
            }
        },
        cope(obj) {
            let data = '';
            if (obj.type === 'array') {
                data = toJsObject(obj.children)
            } else if (obj.type === 'object') {
                this.cope({ type: 'array', children: [obj] })
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
.view {
  height: calc(100vh - 64px);
  overflow-x: hidden;
  position: relative;
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
