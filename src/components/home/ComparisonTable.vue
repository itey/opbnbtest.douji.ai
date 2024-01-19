<template>
  <div class="comparison-content theme-background-color">
    <el-table
      class="comparison-table"
      :header-row-class-name="'table-header'"
      :data="tableData"
      border
      style="width: 1396px"
    >
      <el-table-column
        prop="column0"
        :label="$t('home.feature')"
        width="296px"
      ></el-table-column>
      <el-table-column
        prop="column1"
        :label="$t('home.web2_creator_platform')"
        width="374px"
      ></el-table-column>
      <el-table-column
        prop="column2"
        :label="$t('home.regular_web3_platform')"
        width="380px"
      ></el-table-column>
      <el-table-column
        prop="column3"
        :label="$t('home.douji_ai')"
        width="338px"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'comparison-tab',
  watch: {
    '$store.state.common.language': function (val, od) {
      if (val != od) {
        this.init()
      }
    },
  },
  created() {
    this.init()
  },
  data() {
    return {
      tableData: [],
    }
  },
  methods: {
    init() {
      this.tableData = [
        {
          column0: this.$t('home.tab_creation_threshold'),
          column1: this.$t('home.tab_low'),
          column2: this.$t('home.tab_higher'),
          column3: this.$t('home.tab_low'),
        },
        {
          column0: this.$t('home.tab_data_ship'),
          column1: this.$t('home.tab_none'),
          column2: this.$t('home.tab_owned'),
          column3: this.$t('home.tab_owned'),
        },
        {
          column0: this.$t('home.tab_user_data_ownership'),
          column1: this.$t('home.tab_none'),
          column2: this.$t('home.tab_none'),
          column3: this.$t('home.tab_owned_customizable'),
        },
        {
          column0: this.$t('home.tab_revenue_rights'),
          column1: this.$t('home.tab_none_distribution'),
          column2: this.$t('home.tab_none_distribution'),
          column3: this.$t('home.tab_owned_controlled'),
        },
        {
          column0: this.$t('home.tab_revenue_model'),
          column1: this.$t('home.tab_mainly_sponsorship'),
          column2: this.$t('home.tab_limited'),
          column3: this.$t('home.tab_diversified_models'),
        },
        {
          column0: this.$t('home.tab_co_creation'),
          column1: this.$t('home.tab_uncontrollable'),
          column2: this.$t('home.tab_none'),
          column3: this.$t('home.tab_owned_customizable'),
        },
        {
          column0: this.$t('home.tab_content_sharing'),
          column1: this.$t('home.tab_none'),
          column2: this.$t('home.tab_none'),
          column3: this.$t('home.tab_owned_customizable'),
        },
        {
          column0: this.$t('home.tab_dao_gov'),
          column1: this.$t('home.tab_none'),
          column2: this.$t('home.tab_none'),
          column3: this.$t('home.tab_owned'),
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.comparison-content {
  width: 1440px;
  padding: 24px 23px 21px 21px;
  border-radius: 8px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;

  .comparison-table {
    display: inline-block;
  }

  .el-table {
    background-color: transparent;
  }

  .table-header {
    color: #ffffff;
  }

  .el-table .el-table__cell {
    height: 62px;
    font-size: 16px;
    font-family: Arial;
    font-weight: bold;
    padding: 0 0;
    text-align: center;
  }

  .el-table .table-header .el-table__cell {
    height: 45px;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: transparent;
  }

  .el-table th.el-table__cell.is-leaf {
    border-right: 0px solid #1f262e;
  }

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: initial;
  }

  .el-table th.el-table__cell:first-child {
    background: #5ba0fb;
    border-top-left-radius: 8px;
  }

  .el-table th.el-table__cell:nth-child(2n) {
    background: #7191f3;
  }

  .el-table th.el-table__cell:nth-child(3n) {
    background: #6e69d0;
  }

  .el-table th.el-table__cell:nth-child(4n) {
    background: #1ddbdb;
    border-top-right-radius: 8px;
  }

  .el-table td.el-table__cell:nth-child(2n) {
    color: #8799a9;
  }

  .el-table td.el-table__cell:nth-child(3n) {
    color: #8799a9;
  }

  .el-table td.el-table__cell:nth-child(4n) {
    color: #00f9e5;
  }
}
</style>
