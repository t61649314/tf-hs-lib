<template>
    <div class="vicioussyndicate">
        <page-header title="Vicioussyndicate"></page-header>
        <div class="list">
            <router-link class="item" v-for="(value ,key) in obj" :key="key"
                         :to="{path:'/VicioussyndicateDetails', query:{key:key,parentKey:parentKey}}">{{key}}
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
                parentKey: this.$route.query.key,
                obj: dirs[this.$route.query.key]
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
