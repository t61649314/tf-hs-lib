<template>
    <div class="vicioussyndicate">
        <page-header title="Vicioussyndicate"></page-header>
        <div class="list">
            <router-link class="item" v-for="(value ,key) in dirs" :key="key" :to="{path:'/VicioussyndicateList', query:{parent:key}}">{{key}}
            </router-link>
        </div>
    </div>
</template>

<script>
    import PageHeader from '../components/PageHeader.vue'
    import dirs from '../../static/storage/vicioussyndicate/dir.json'

    export default {
        name: 'Vicioussyndicate',
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
