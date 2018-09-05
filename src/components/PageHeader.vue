<template>
    <div class="page-header">
        <i v-if="!noBack" class="mintui mintui-back" @click="goBack"></i>
        <h1>{{ title }}</h1>
    </div>
</template>

<script>
    export default {
        name: 'PageHeader',
        props: ['title', 'noBack'],
        data() {
            return {}
        },
        methods: {
            goBack() {
                window.history.length > 1
                    ? this.$router.go(-1)
                    : this.$router.push('/')
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .page-header {
        height: 60px;
        z-index: 1;
        background-color: #fff;
        h1 {
            font-size: 20px;
            line-height: 60px;
            margin: 0;
        }
        .mintui-back {
            display: inline-block;
            top: 10px;
            left: 10px;
            position: absolute;
            width: 40px;
            height: 40px;
            font-size: 24px;
            line-height: 40px;
            text-align: center;
        }
    }
</style>
