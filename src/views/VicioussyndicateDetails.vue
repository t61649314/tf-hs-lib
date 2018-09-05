<template>
    <div class="vicioussyndicate">
        <page-header title="Vicioussyndicate"></page-header>
        <div class="deck-list">
            <div class="deck-item" v-for="(item, index)  in deckNameList" :key="index">
                <img :src="require(`../../static/storage/vicioussyndicate/${parentKey}/${key}/${item}`)">
                <div class="btn">复制卡组</div>
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
                parentKey: this.$route.query.parentKey,
                key: this.$route.query.key,
                deckNameList: dirs[this.$route.query.parentKey][this.$route.query.key],
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
    .deck-item {
        padding: 25px 0 ;
        border: 1px solid #ddd;
        background-color: #fff;
    }
</style>
