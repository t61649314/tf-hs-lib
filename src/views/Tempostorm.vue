<template>
    <div class="tempostorm">
        <page-header title="Tempostorm"></page-header>
        <div class="list">
            <router-link class="item" v-for="(item) in Object.keys(dirs).reverse()" :key="item" :to="{path:'/TempostormList', query:{parent:item}}">{{item}}
            </router-link>
        </div>
    </div>
</template>

<script>
    import PageHeader from '../components/PageHeader.vue'
    import dirs from '../../storage/tempo-storm/dir.json'

    export default {
        name: 'Tempostorm',
        components: {
            PageHeader
        },
        data() {
            return {
                dirs: dirs
            }
        },
        mounted: function () {
            this.init();
        },
        methods: {
            init: function () {
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
