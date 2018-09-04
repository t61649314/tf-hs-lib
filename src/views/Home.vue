<template>
    <div class="home">
        <page-header title="Home" noBack="true"></page-header>
        <div class="list">
            <router-link class="item" to="/vicioussyndicate">vicioussyndicate</router-link>
        </div>
    </div>
</template>

<script>
    import PageHeader from '../components/PageHeader.vue'

    export default {
        name: 'Home',
        components: {
            PageHeader
        },
        data() {
            return {}
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .home {
        .list {
            .item {
                display: block;
                border-bottom: 1px solid #ddd;
                border-top: 1px solid #ddd;
                margin-bottom: -1px;
                padding: 16px;
                color: initial;
                text-decoration: initial;
                &:after{
                    display: inline-block;
                    position: absolute;
                    right: 16px;
                    content: "\E600";
                    font-family: "mintui" !important;
                    font-size: 16px;
                    font-style: normal;
                    -webkit-font-smoothing: antialiased;
                    -webkit-text-stroke-width: 0.2px;
                    -moz-osx-font-smoothing: grayscale;
                    transform:scaleX(-1);
                }
            }
        }
    }
</style>
