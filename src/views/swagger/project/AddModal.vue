<template>
    <el-dialog :title="type==='add'?'新增':'编辑'"
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
          <el-form-item label="url"
                prop="url">
                <el-input style="width:250px"
                    v-model="form.url"></el-input>
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
export default {
    data() {
        return {
            isShow: false,
            type: 'add',
            form: {
                id: '',
                name: '',
                url: '',
                remark: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                url: [
                    { required: true, message: '请输入url', trigger: 'blur' }
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
                    Object.assign(this.form, JSON.parse(JSON.stringify(row)))
                    this.form.id = row.id;
                    this.form.name = row.name;
                    this.form.url = row.url;
                    this.form.remark = row.remark;
                } else {
                    this.type = 'add'
                    this.form.id = `${new Date().getTime()}`
                }
            })
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
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