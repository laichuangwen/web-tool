<template>
    <el-dialog title="删除分支"
        :visible.sync="isShow"
        width="500px">
        <template>
            <p :class="s.tipD">
                1. 以下是本地分支列表已经过滤了dev,test,master
            </p>

            <el-table :data="list"
                border
                v-loading="loading.getBranch"
                @selection-change="handleSelectionChange"
                :height="300"
                empty-text="没有分支">
                <el-table-column type="selection"
                    width="55">
                </el-table-column>
                <el-table-column prop="commit"
                    label="commit" />˝
                <el-table-column prop="name"
                    width="200"
                    label="分支名称" />
            </el-table>
        </template>
        <div slot="footer"
            :class="s.footer">
            <el-checkbox v-model="isDel">
                是否删除远程
            </el-checkbox>
            <div :class="s.operator">
                <el-button @click="cancel">
                    取消
                </el-button>
                <el-button type="primary"
                    :loading="loading.submit"
                    @click="submit">
                    删除
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import Git from '../../git.js';
let git
export default {
    data() {
        return {
            isShow: false,
            isDel: true,
            list: [],
            branch: null,
            loading: {
                getBranch: false,
                submit: false
            },
            multipleSelection: [],
            saveBk: true
        };
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            if (this.$route.query.path) {
                console.log(this.$route.query.path);
                git = Git(this, this.$route.query.path)
            }
        },
        open(branch) {
            this.isShow = true;
            this.loading.getBranch = false
            this.loading.submit = false
            this.branch = branch
            this.getDiffCommits()
        },
        async getDiffCommits() {
            this.loading.getBranch = true
            try {
                // 先获取远程最新代码
                await git.fetch([
                    'origin',
                    this.branch
                ])
                // 对比当前分支和远程分支的差异commit
                const branchLocal = await git.branchLocal()
                const { branches } = branchLocal
                this.list = Object.keys(branches).map(key => branches[key]).filter(list => !['dev', 'test', 'master'].includes(list.name))
                console.log(this.list);
            } catch (e) {
                console.warn(e)
            }
            this.loading.getBranch = false
        },
        cancel() {
            this.isShow = false
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async submit() {
            try {
                this.loading.submit = true
                for (const branch of this.multipleSelection) {
                    await git.branch(['-D', branch.name])
                    // 删除远程分支
                    if (this.isDel) {
                        await git.raw([
                            'push',
                            'origin',
                            '--delete',
                            `${branch.name}`
                        ])
                    }
                }
                this.$message.success('操作成功')
                this.loading.submit = false
                this.isShow = false
            } catch (e) {
                console.error(e);
            }

        }
    },
};
</script>
<style lang="scss" module="s">
.tipD {
    color: #80848f;
    margin-bottom: 12px;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.operator {
    font-size: 0;

    button {
        & + button {
            margin-left: 8px;
        }
    }
}
</style>