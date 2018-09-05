<template>
    <div class="vicioussyndicate">
        <page-header title="Vicioussyndicate"></page-header>
        <div class="list">
            <div class="deck-item" v-for="(value ,key) in obj" :key="key">
                <img :src="require(`../../static/storage/vicioussyndicate/${gParent}/${parent}/${value.name}.png`)">
                <button class="btn clipboard-btn" :data-clipboard-text="value.code">复制卡组</button>
            </div>
        </div>
    </div>
</template>
2
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
                gParent: this.$route.query.gParent,
                parent: this.$route.query.parent,
                obj: dirs[this.$route.query.gParent][this.$route.query.parent],
            }
        },
        methods: {}
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .deck-item {
        padding: 25px 0;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
    }
</style>
