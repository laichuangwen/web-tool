<template>
    <page>
        <div :class="s.pickList" v-loading="branchLoading">
            <div :class="s.top">
                <div :class="s.group">
                    <el-radio-group v-model="type"
                        style="margin-right: 12px;"
                        @change="radioChange">
                        <el-radio-button label="strict">严格</el-radio-button>
                        <el-radio-button label="remote">远程</el-radio-button>
                        <el-radio-button label="local">本地</el-radio-button>
                    </el-radio-group>
                    <el-tooltip content="复制选中的commit的hash"
                        placement="left">
                        <el-button type="primary"
                            :disabled="!selections.length"
                            @click="copy">
                            复制
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="选中的commit执行cherry-pick并push到远程"
                        placement="left">
                        <el-button type="primary"
                            :disabled="!selections.length"
                            @click="submit">
                            cherry-pick
                        </el-button>
                    </el-tooltip>
                </div>
                <div
                    :class="s.condition">
                    <section>
                        <label style="margin-right: 12px;">源分支&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <el-select v-model="sourceBranch"
                            filterable
                            @change="sourceBranchChange"
                            style="margin-right: 12px;">
                            <el-option v-for="(item,index) in sourceBranchList"
                                :key="index"
                                :disabled="item.disabled"
                                :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </section>
                    <section>
                        <label style="margin-right: 12px;">目标分支&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <el-select v-model="targetBranch"
                            filterable
                            @change="targetBranchChange"
                            style="margin-right: 12px;">
                            <el-option v-for="(item,index) in targetBranchList"
                                :key="index"
                                :disabled="item.disabled"
                                :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </section>
                    <section>
                        <label style="margin-right: 12px;">关键字&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <el-input style="width:200px;margin-right: 12px;"
                            v-model="Keyword"
                            clearable
                            placeholder="关键字">
                        </el-input>
                    </section>
                    <el-button :disabled="!(sourceBranch&&targetBranch)"
                        @click="getList">
                        查询
                    </el-button>
                </div>
            </div>
            <el-table ref="table"
                :data="list"
                @selection-change="handleSelectionChange"
                v-loading="loading"
                :class="s.table"
                border>
                <el-table-column type="selection"
                    width="55">
                </el-table-column>

                <el-table-column prop="author_name"
                    label="作者"
                    width="100">
                </el-table-column>
                <el-table-column prop="type"
                    width="80"
                    :filters="[{ text: '文档', value: 'doc' }, { text: '任务', value: 'task' }]"
                    :formatter="(row)=>row.type==='doc'?'文档':'任务'"
                    filter-placement="bottom-end"
                    :filter-method="(value, row)=>row.type === value"
                    label="类型">
                </el-table-column>
                <el-table-column label="提交时间"
                    :formatter="formatterDate"
                    prop="date"
                    width="160">
                </el-table-column>
                <!-- <el-table-column prop="hash"
                label="hash"
                min-width="140">
            </el-table-column> -->
                <el-table-column prop="message"
                    min-width="200"
                    show-overflow-tooltip
                    label="message">
                </el-table-column>
            </el-table>
        </div>
    </page>
</template>

<script>
import Page from '../../Page.vue';
import Git from '../git.js';
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'
let git
export default {
    components: {
        Page
    },
    data() {
        return {
            type: 'strict',
            branch: {
                all: [],
                branches: {},
                current: '',
                local: [],
                remotes: [],
            },
            targetBranch: '',
            sourceBranch: '',
            branchLoading: false,
            loading: false,
            diffStep: '',
            list: [],
            selections: [],
            Keyword: '',
            modal: {
                logs: false,
                submit: false
            },
            logs: []
        };
    },
    computed: {
        brancheList() {
            if (!this.branch.remotes.length) return []
            if (this.type === 'strict') return this.branch.remotes.filter(item => ['dev', 'test', 'master'].includes(item.replace('remotes/origin/', '')))
            if (this.type === 'remote') return this.branch.remotes
            return this.branch.local
        },
        sourceBranchList() {
            if (this.type === 'strict') {
                return this.brancheList.map(item => {
                    return {
                        value: item,
                        label: item,
                        disabled: item === 'remotes/origin/master'
                    }
                })
            }
            return this.brancheList.map(item => {
                return {
                    value: item,
                    label: item
                }
            })
        },
        targetBranchList() {
            if (this.type === 'strict') {
                return this.brancheList.map(item => {
                    return {
                        value: item,
                        label: item,
                        disabled: item === 'remotes/origin/dev'
                    }
                })
            }
            return this.brancheList.map(item => {
                return {
                    value: item,
                    label: item
                }
            })
        },

    },
    created() {
        this.init()
    },
    methods: {
        async init() {
            if (!this.$route.query.path) return
            git = Git(this, this.$route.query.path)
            this.branchLoading = true
            // 拉取最新
            await git.fetch([
                'origin'
            ])
            // 获取分支
            this.branch = await git.branch()
            this.branch.local = this.branch.all.filter(item => !item.startsWith('remotes'))
            this.branch.remotes = this.branch.all.filter(item => item.startsWith('remotes'))
            console.log('分支信息', this.branch)
            // 默认选择
            this.radioChange()
            this.branchLoading = false
        },
        radioChange() {
            if (this.type === 'strict') {
                this.sourceBranch = 'remotes/origin/dev'
                this.targetBranch = 'remotes/origin/test'
                // 查询
                this.getList()
            } else {
                this.sourceBranch = ''
                this.targetBranch = ''
                this.list = []
            }
        },
        sourceBranchChange() {
            if (this.type === 'strict') {
                if (this.sourceBranch === 'remotes/origin/dev') {
                    this.targetBranch = 'remotes/origin/test';
                }
                if (this.sourceBranch === 'remotes/origin/test') {
                    this.targetBranch = 'remotes/origin/master';
                }
                // 查询
                this.getList()
            }
        },
        targetBranchChange() {
            if (this.type === 'strict') {
                if (this.targetBranch === 'remotes/origin/test') {
                    this.sourceBranch = 'remotes/origin/dev';
                }
                if (this.targetBranch === 'remotes/origin/master') {
                    this.sourceBranch = 'remotes/origin/test';
                }
                // 查询
                this.getList()
            }
        },
        formatterDate(row) {
            return this.$ctx.util.moment(row.date).format('YYYY-MM-DD hh:mm:ss')
        },
        // 获取树
        async getList() {
            if (!this.sourceBranch || !this.targetBranch) return this.$message.warning('请选择对比分支');
            this.loading = true
            const commits = await this.getDiffCommits();
            console.log('不同commits', commits);
            this.list = commits.filter(item => item.message.includes(this.Keyword) || item.author_name.includes(this.Keyword))
            this.loading = false
        },
        // 获取两个分支差异
        async getDiffCommits() {
            // 获取最新远程代码
            const step1 = '获取远程最新代码'
            this.diffStep = step1
            console.time(step1)
            const source = this.sourceBranch.replace('remotes/origin/', '')
            const current = this.targetBranch.replace('remotes/origin/', '')
            await git.fetch([
                'origin',
                source,
                current
            ])
            console.timeEnd(step1)
            const step2 = 'diff commits'
            this.diffStep = step2
            console.time(step2)
            console.log('当前对比', `${this.sourceBranch}...${this.targetBranch}`);
            const res = await git.log([
                '--cherry-pick',
                '--left-only',
                '--no-merges',
                `${this.sourceBranch}...${this.targetBranch}`
            ])
            const { all: commits } = res;
            console.log('commits',commits);
            // 取出时间最小值
            const date = Math.min(...commits.map(item => new Date(item.date).getTime()));
            console.log(date);
            // 取出目标分支log 最小时间以后
            const targetCommit = await git.log([
                `--since=${new Date(date)}`,
                `${this.targetBranch}`
            ]);
            console.log('targetCommit',targetCommit);
            const filterCommit = commits.filter(item => !targetCommit.all.map(list => `${list.message}-${list.date}`).includes(`${item.message}-${item.date}`))
            const gensortCommit = filterCommit.map((item, index) => ({ ...item, index: index }))
            const parseCommits = gensortCommit.map(item => {
                const { message } = item
                return {
                    ...item,
                    type: (/^(doc)/gui).test(message) ? 'doc' : 'task', // 是文档commit
                }
            })
            return parseCommits
        },
        async submit(automator) {
            const checkCommitsList = this.selections;
            if (!checkCommitsList.length) {
                this.$message.warning('请选择commit')
                return
            }
            // 按提交时间排序，越早越前面
            checkCommitsList.sort((x, y) => new Date(x.date).getTime() - new Date(y.date).getTime()).map(s => s.hash).join(' ');
            const commits = checkCommitsList.map(commit => commit.hash);
            console.log('commits', commits);
            // 当前分支用于操作完了切换回当前
            const curBranch = await git.getCurBranch()
            console.log('获取当前分支', curBranch);
            const handler = async () => {
                if (await git.cleanConfirm()) {
                    try {
                        const current = this.targetBranch.replace('remotes/origin/', '')
                        // 切换目标分支
                        await git.checkout(current)
                        await git.reset([
                            '--hard',
                            `origin/${current}`
                        ])
                        this.modal.logs = true
                        await new Promise((resolve, reject) => {
                            // 将commit写入文件 解决windows下命令行长度限制
                            const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pentakill-cherry-pick-list'))
                            const file = path.join(dir, 'commits')
                            fs.writeFileSync(file, commits.join('\n'))
                            const cat = process.platform === 'win32' ? 'type' : 'cat'
                            const command = `${cat} ${file} | git cherry-pick --stdin`
                            console.log(command)
                            this.logs = [command]
                            const p = exec(command, {
                                cwd: this.$route.query.path,
                                maxBuffer: Infinity
                            })
                            p.stdout.on('data', log => {
                                console.log('stdout', log);
                                this.logs.push(log)
                            })
                            p.stderr.on('data', log => {
                                if (log.includes('error')) {
                                    this.modal.logs = false
                                    reject(log)
                                } else {
                                    console.warn(log)
                                }
                            })
                            p.on('close', code => {
                                console.log('close', code)
                                resolve()
                            })
                        })
                        this.modal.logs = false

                        if (automator) {
                            await git.push()
                        } else {
                            // 本地pick就返回上一页
                            this.$router.back();
                        }
                        this.$message.success('操作成功')
                    } catch (e) {
                        console.warn(e)
                        await git.raw([
                            'cherry-pick',
                            '--abort'
                        ])
                        this.$notify.error({
                            title: 'git报错，请自行解决',
                            message: e.toString(),
                            duration: 3000
                        })
                    }
                }
            }
            // 合并
            this.$confirm('即将执行cherry-pick、push连贯操作，Are you ready？')
                .then(async () => {
                    await handler()
                    // 切换回当前
                    console.log('切换回当前分支', curBranch);
                    await git.checkout(curBranch)
                    // 获取列表
                    this.getList()
                })
        },
        copy() {
            const commits = this.selections;
            // 按提交时间排序，越早越前面
            commits.sort((x, y) => new Date(x.date).getTime() - new Date(y.date).getTime()).map(s => s.hash).join(' ');
            const message = `${commits.map(commit => commit.hash).join(' ')}`
            console.log(message);
            this.$ctx.util.copy(message)
            this.$message.success('成功复制到粘贴板');
        },
        handleSelectionChange(val) {
            this.selections = val;
        }
    }
};
</script>

<style lang="scss" module="s">
.pickList {
    .top {
        .group {
            margin-bottom: 16px;
        }
        .condition {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
        }
    }
    .table {
        margin-top: 16px;
    }
}
</style>
