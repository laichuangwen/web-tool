<template>
    <div :class="s.content"
        v-loading="loading"
        ref="content">
    </div>

</template>

<script>
export default {
    data() {
        return {
            url: '',
            loading: true
        };
    },
    mounted() {
        this.url = this.$ctx.eStore.get('docUrl') || '';
        const iframe = document.createElement("iframe");
        iframe.src = this.url;
        iframe.width = '100%'
        iframe.height = '100%'
        iframe.className = this.s.iframe
        iframe.onload = () => {
            this.loading = false
        };
        this.$refs.content.appendChild(iframe)

    },
};
</script>

<style lang="scss" module="s">
.content {
    width: 100%;
    height: 100%;
    .iframe {
        border-width: 0;
    }
}
</style>
