<template>
    <el-dialog :title="type==='add'?'新增git仓库':'编辑git仓库'"
        :visible.sync="isShow"
        width="500px">
        <el-form :model="form"
            :rules="rules"
            ref="form"
            label-width="130px">
            <el-form-item label="仓库名称"
                prop="name">
                <el-input style="width:250px"
                    v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="本地仓库根路径"
                prop="path">
                <div :class="s.wrapP">
                    <el-tooltip class="item"
                        effect="dark"
                        :disabled="!form.path"
                        :content="form.path"
                        placement="top">
                        <p :class="s.path">{{form.path ||'请选择'}} </p>
                    </el-tooltip>
                    <i :class="['ewen-iconbianji',s.icon]"
                        @click="selectPath"></i>
                </div>
            </el-form-item>
            <el-form-item v-show="form.url"
                label="仓库地址"
                prop="url">
                <el-tooltip class="item"
                    effect="dark"
                    :content="form.url"
                    placement="top">
                    <p :class="s.path">{{form.url}} </p>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="备注"
                prop="remark">
                <el-input style="width:250px"
                    type="textarea"
                    v-model="form.remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer"
            class="dialog-footer">
            <el-button @click="isShow = false">取消</el-button>
            <el-button type="primary"
                @click="submit">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
const  {dialog}  = require('electron').remote
const simpleGit = require('simple-git')
export default {
    data() {
        return {
            isShow: false,
            type: 'add',
            form: {
                id: '',
                name: '',
                path: '',
                url: '',
                remark: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入仓库名称', trigger: 'blur' },
                ],
                path: [
                    { required: true, message: '请选择仓库根路径', trigger: 'change' }
                ],
            }
        };
    },
    methods: {
        open(row) {
            this.isShow = true;
            this.$nextTick(async () => {
                await this.$refs.form.clearValidate()
                await this.$refs.form.resetFields()
                if (row) {
                    this.type = 'edit'
                    console.log('编辑', row);
                    Object.assign(this.form, JSON.parse(JSON.stringify(row)))
                    this.form.id = row.id;
                    this.form.name = row.name;
                    this.form.path = row.path;
                    this.form.url = row.url;
                    this.form.remark = row.remark;
                } else {
                    this.type = 'add'
                    this.form.id = `${new Date().getTime()}`
                    console.log(this.form);
                }
            })
        },
        selectPath() {
            // 获取git根目录
            dialog.showOpenDialog({
                title: '选择文件夹',
                properties: ['openDirectory']
            }).then(result => {
                const { filePaths } = result
                if (filePaths && filePaths.length) {
                    const rootPath = filePaths[0]
                    this.form.path = rootPath
                    this.getGitRemoteV(this.form.path)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取仓库地址
        async getGitRemoteV(path) {
            const git = simpleGit(path)
            const res = await git.remote(['-v'])
            const list = res.match(/[\S]+/g)
            const url = list[1] || ''
            this.form.url = url
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    console.log(this.form);
                    this.$emit('success', {
                        type: this.type,
                        form: this.form
                    })
                    this.isShow = false
                }
            })
        },
    },
};
</script>
<style lang="scss" module="s">
.wrapP {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.path {
    max-width: 230px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.icon {
    font-size: 18px;
    color: #0bb27a;
    cursor: pointer;
    margin-left: 4px;
}
</style>