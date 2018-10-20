<template>
    <div class="home">
        <page-header title="Home" noBack="true"></page-header>
        <div class="list">
            <router-link class="item" to="/Vicioussyndicate">vicioussyndicate</router-link>
            <!--<router-link class="item" to="/Flex">Flex</router-link>-->
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
</style>
