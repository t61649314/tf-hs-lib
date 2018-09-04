<template>
    <div class="vicioussyndicate">
        <page-header title="Vicioussyndicate"></page-header>
        <img :src="a.imgUrl"/>
        {{b}}
    </div>
</template>

<script>
    import PageHeader from '../components/PageHeader.vue'
    import a from '../../static/storage/vicioussyndicate/wild-vs-data-reaper-report-1/Druid/Innervate Egg Druid.json'

    export default {
        name: 'Vicioussyndicate',
        components: {
            PageHeader
        },
        data() {
            return {
                a:a,
                b:b
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

<style scoped>
</style>
