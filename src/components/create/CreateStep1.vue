<template>
  <div class="create-step1">
    <div class="title">
      {{ edit ? $t("create.update_mold_1") : $t("create.create_mold_1") }}
    </div>
    <div class="form-container">
      <div class="label">{{ $t("create.type") }}*</div>
      <div class="type-container" v-for="(arr, index) in typeList" :key="index">
        <div
          v-for="(item, i) in arr"
          :key="i"
          class="item"
          :class="{
            light: form.contentType == item.e_name,
          }"
          @click="choseType(item.e_name)"
        >
          <div>{{ $i18n.locale == "en" ? item.e_name : item.c_name }}</div>
        </div>
      </div>
      <template v-if="categoryList.length">
        <div class="label">{{ $t("create.category") }}*</div>
        <div class="category-container">
          <div
            class="item"
            :class="{
              light: form.category == item.e_name,
            }"
            v-for="item in categoryList"
            :key="item.id"
            @click="choseCategory(item)"
          >
            {{ $i18n.locale == "en" ? item.e_name : item.c_name }}
          </div>
        </div>
      </template>
      <div v-if="error.category" class="tip-error">{{ error.category }}</div>
      <div v-else class="tip">{{ $t("create.not_allow_change") }}</div>

      <template v-if="platformList.length">
        <div class="label">{{ $t("create.platform") }}</div>
        <div class="category-container">
          <div
            class="item"
            :class="{
              light: form.prompt == item.e_name,
            }"
            v-for="(item, index) in platformList"
            :key="index"
            @click="chosePlatform(item)"
          >
            {{ $i18n.locale == "en" ? item.e_name : item.c_name }}
          </div>
        </div>
        <div class="tip">{{ $t("create.not_allow_change") }}</div>
      </template>

      <div class="label">{{ $t("create.language") }}</div>
      <div class="category-container">
        <div
          class="item"
          :class="{
            light: form.language == item.english,
          }"
          v-for="(item, index) in languageList"
          :key="index"
          @click="choseLanguage(item)"
        >
          {{ $i18n.locale == "en" ? item.english : item.chinese }}
        </div>
      </div>
      <div class="tip">{{ $t("create.not_allow_change") }}</div>
      <div class="label">NFT Max Supply*</div>
      <div class="input-container">
        <el-input
          :disabled="edit"
          @change="checkItem('maxSupply')"
          v-model="form.maxSupply"
          class="input"
        ></el-input>
      </div>
      <div v-if="error.maxSupply" class="tip-error">{{ error.maxSupply }}</div>
      <div class="tip" v-if="form.maxSupply">
        {{ $t("create.not_allow_change") }}{{ $t("create.defines_level") }}
        <span class="text-color">{{ $t("create.legendary") }}</span>
      </div>
      <template v-if="edit">
        <div class="label">{{ $t("create.available_supply") }}*</div>
        <div class="input-container">
          <el-input
            @change="checkItem('availableSupply')"
            v-model="form.availableSupply"
            class="input"
          ></el-input>
        </div>
        <div v-if="error.availableSupply" class="tip-error">
          {{ error.availableSupply }}
        </div>
        <div v-else class="tip">
          {{ $t("create.max_available") }}
          <span class="text-color">{{ currentAvailableSupply }}</span>
        </div>
      </template>
      <template v-if="!edit">
        <div class="label">{{ $t("create.initial_quantity") }}*</div>
        <div class="input-container">
          <el-input
            :disabled="edit"
            @change="checkItem('initialQuantity')"
            v-model="form.initialQuantity"
            class="input"
          ></el-input>
        </div>
        <div v-if="error.initialQuantity" class="tip-error">
          {{ error.initialQuantity }}
        </div>
        <div v-else class="tip">
          {{ $t("create.not_allow_change") }}{{ $t("create.max_initial") }}
          <span class="text-color">{{ availableInitialQuantity }}</span>
        </div>
      </template>
      <div class="label">{{ $t("create.mint_price") }}*</div>
      <div class="input-container">
        <el-input
          @change="checkItem('initialPrice')"
          v-model="form.initialPrice"
          class="input"
        ></el-input>
        <div class="unit">
          MBD
          <span v-if="form.initialPrice && form.initialPrice > 0"
            >≈${{
              ($store.state.chain.mbdPrice * form.initialPrice) | decimalPlace8
            }}</span
          >
        </div>
      </div>
      <div v-if="error.initialPrice" class="tip-error">
        {{ error.initialPrice }}
      </div>
      <div v-else class="tip">{{ $t("create.allowed_content") }}</div>
      <div class="btn-container" v-if="edit">
        <el-button class="common-btn2" @click="backClick()">{{
          $t("create.back")
        }}</el-button>
        <el-button
          class="common-btn2"
          :disabled="!ifUpdate"
          @click="updateClick()"
          >{{ $t("create.update") }}</el-button
        >
      </div>
      <div class="btn-container" v-else>
        <el-button class="common-btn2" @click="backClick()">{{
          $t("create.back")
        }}</el-button>
        <el-button class="common-btn2" @click="saveClick()">{{
          $t("create.save")
        }}</el-button>
        <el-button class="common-btn2" @click="nextClick()">{{
          $t("create.next")
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getNftCategoriesByType,
  getNftLanguage,
  getNftPlatformsByType,
  getNftTypes,
} from "@/utils/http";
export default {
  name: "create-step1",
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      typeList: [],
      categoryList: [],
      platformList: [],
      languageList: [],
      currentAvailableSupply: undefined,
      form: {
        contentType: undefined,
        category: undefined,
        prompt: undefined,
        language: undefined,
        keyword: [],
        maxSupply: undefined,
        initialQuantity: undefined,
        initialPrice: undefined,
      },
      error: {},
    };
  },
  computed: {
    availableInitialQuantity() {
      if (!this.form.maxSupply) {
        return 0;
      }
      return Math.floor(this.form.maxSupply * 0.2);
    },
    ifUpdate() {
      if (!this.edit) {
        return false;
      }
      if (
        this.metadata.availableSupply == this.form.availableSupply &&
        this.metadata.initialPrice == this.form.initialPrice
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    /** 选择大类 */
    choseType(e_name) {
      this.form.contentType = e_name;
      this.loadCategoryList();
      this.loadPlatformList();
    },
    /** 选择分类 */
    choseCategory(val) {
      this.$set(this.form, "category", val.e_name);
    },
    /** 选择平台 */
    chosePlatform(val) {
      this.$set(this.form, "prompt", val.e_name);
    },
    /** 选择语言 */
    choseLanguage(val) {
      this.$set(this.form, "language", val.english);
    },
    /** 获取大类 */
    loadTypeList() {
      getNftTypes().then((r) => {
        const arr = r.data.list;
        if (arr) {
          this.typeList = this._.chunk(arr, 3);
        }
      });
    },
    /** 获取分类 */
    loadCategoryList() {
      if (this.form.contentType) {
        getNftCategoriesByType(this.form.contentType).then((r) => {
          this.categoryList = r.data.list;
        });
      }
    },
    /** 获取Language */
    loadLanguageList() {
      getNftLanguage().then((r) => {
        this.languageList = r.data.list;
      });
    },
    /** 获取平台 */
    loadPlatformList() {
      getNftPlatformsByType(this.form.contentType).then((r) => {
        this.platformList = r.data.list;
      });
    },
    clearError(val) {
      this.$set(this.error, val, "");
    },
    setError(key, val) {
      this.$set(this.error, key, val);
    },
    /** 单项检查 */
    checkItem(key) {
      var reg = /^\+?[1-9][0-9]*$/;
      switch (key) {
        case "category":
          if (!this.form.category) {
            this.setError(key, this.$t("create.category_required"));
          } else {
            this.clearError(key);
          }
          break;
        case "maxSupply":
          if (!this.form.maxSupply) {
            this.setError(key, this.$t("create.maxSupply_required"));
          } else {
            if (!reg.test(this.form.maxSupply)) {
              this.setError(key, this.$t("create.maxSupply_invalid"));
            } else {
              this.clearError(key);
            }
          }
          break;
        case "availableSupply":
          if (!this.form.availableSupply && this.edit) {
            this.setError(key, this.$t("create.availableSupply_required"));
          } else {
            if (!reg.test(this.form.availableSupply)) {
              this.setError(key, this.$t("create.availableSupply_invalid"));
            } else if (
              this.form.availableSupply > this.currentAvailableSupply
            ) {
              this.setError(
                key,
                this.$t("create.availableSupply_more_than_available")
              );
            } else {
              this.clearError(key);
            }
          }
          break;
        case "initialQuantity":
          if (!this.form.initialQuantity) {
            this.setError(key, this.$t("create.initialQuantity_required"));
          } else if (
            this.form.initialQuantity > this.availableInitialQuantity
          ) {
            this.setError(key, this.$t("create.initialQuantity_more_than"));
          } else {
            if (!reg.test(this.form.initialQuantity)) {
              this.setError(key, this.$t("create.initialQuantity_invalid"));
            } else {
              this.clearError(key);
            }
          }
          break;
        case "initialPrice":
          if (!this.form.initialPrice) {
            this.setError(key, this.$t("create.initialPrice_required"));
          } else {
            if (
              isNaN(Number(this.form.initialPrice)) ||
              Number(this.form.initialPrice) < 0
            ) {
              this.setError(key, this.$t("create.initialPrice_invalid"));
            } else {
              this.clearError(key);
            }
          }
          break;
        default:
          break;
      }
    },
    /** 表单检查 */
    formCheck() {
      this.error = {};
      var reg = /^[0-9]+.?[0-9]*$/;
      var ifPass = true;
      if (!this.form.category) {
        this.setError("category", this.$t("create.category_required"));
        ifPass = false;
      }

      if (!this.form.maxSupply) {
        this.setError("maxSupply", this.$t("create.maxSupply_required"));
        ifPass = false;
      } else {
        if (!reg.test(this.form.maxSupply) || this.form.maxSupply <= 0) {
          this.setError("maxSupply", this.$t("create.maxSupply_invalid"));
          ifPass = false;
        }
      }
      if (this.edit) {
        if (!this.form.availableSupply) {
          this.setError(
            "availableSupply",
            this.$t("create.availableSupply_required")
          );
          ifPass = false;
        } else {
          if (!reg.test(this.form.availableSupply)) {
            this.setError(
              "availableSupply",
              this.$t("create.availableSupply_invalid")
            );
            ifPass = false;
          } else if (this.form.availableSupply > this.currentAvailableSupply) {
            this.setError(
              "availableSupply",
              this.$t("create.availableSupply_more_than_available")
            );
            ifPass = false;
          }
        }
      }

      if (!this.form.initialQuantity) {
        this.setError(
          "initialQuantity",
          this.$t("create.initialQuantity_required")
        );
        ifPass = false;
      } else if (
        this.form.initialQuantity > this.availableInitialQuantity &&
        !this.edit
      ) {
        this.setError(
          "initialQuantity",
          this.$t("create.initialQuantity_more_than")
        );
        ifPass = false;
      } else {
        if (!reg.test(this.form.initialQuantity)) {
          this.setError(
            "initialQuantity",
            this.$t("create.initialQuantity_invalid")
          );
          ifPass = false;
        }
      }
      if (!this.form.initialPrice) {
        this.setError("initialPrice", this.$t("create.initialPrice_required"));
        ifPass = false;
      } else {
        if (
          isNaN(Number(this.form.initialPrice)) ||
          Number(this.form.initialPrice) < 0
        ) {
          this.setError("initialPrice", this.$t("create.initialPrice_invalid"));
          ifPass = false;
        }
      }
      return ifPass;
    },
    backClick() {
      this.$emit("backClick", 0);
    },
    saveClick() {
      if (!this.form.step) {
        this.form.step = 1;
      }
      if (this.form.prompt != "Prompt") {
        this.form.prompt = null;
      }
      this.$emit("saveClick", this.form);
      this.$toast.success(this.$t("common.save_success"));
    },
    nextClick() {
      this.$emit("saveClick", this.form);
      if (this.formCheck()) {
        this.$emit("nextClick", 2);
      } else {
        console.log(this.error);
      }
    },
    updateClick() {
      if (
        this.metadata.availableSupply == this.form.availableSupply &&
        this.metadata.initialPrice == this.form.initialPrice
      ) {
        this.$toast(this.$t("create.data_not_modified"));
        return;
      }
      if (this.formCheck()) {
        this.$emit("handleUpdate", this.form);
      } else {
        console.log(this.error);
      }
    },
  },
  mounted() {
    this.loadTypeList();
    if (this.metadata) {
      this.form = JSON.parse(JSON.stringify(this.metadata));
    }
    this.choseType(this.metadata.contentType);
    this.loadLanguageList();
    if (this.form.availableSupply) {
      this.currentAvailableSupply = this.form.availableSupply;
    }
  },
};
</script>

<style lang="scss" scoped>
.create-step1 {
  .title {
    margin-top: 63px;
    margin-bottom: 12px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    text-align: left;
  }

  .form-container {
    border-radius: 6px;
    padding: 15px 0 55px 97px;

    .label {
      text-align: left;
      margin-top: 40px;
      font-size: 13px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #9faec0;
      margin-bottom: 12px;
    }

    .type-container {
      display: flex;
      flex-direction: row;

      .item {
        width: 268px;
        height: 66px;
        background: #0e161d;
        border: 1px solid #313838;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        margin-bottom: 10px;

        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #fff;
        cursor: pointer;

        img {
          margin-right: 6px;
        }

        &.light {
          background: #18252f;
          border: 1px solid #2fc9bd;

          font-family: Arial;
          color: #00f9e5;
        }
      }
    }

    .category-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .item {
        padding-top: 5px;
        width: 131px;
        height: 30px;
        line-height: 27px;
        background: #0e161d;
        border: 1px solid #313838;
        border-radius: 4px;
        margin: 0 9px 10px 0;
        color: #fff;
        cursor: pointer;

        font-size: 12px;
        font-family: Arial;
        font-weight: bold;

        &.light {
          background: #18252f;
          border: 1px solid #2fc9bd;

          font-family: Arial;
          color: #00f9e5;
        }
      }
    }

    .tip {
      margin-top: 13px;
      font-size: 12px;
      font-family: Arial;
      font-weight: 400;
      color: #707d8c;
      text-align: left;
    }

    .tip-error {
      margin-top: 13px;
      font-size: 12px;
      font-family: Arial;
      font-weight: 400;
      color: #a50507;
      text-align: left;
    }

    .input-container {
      display: flex;
      align-items: center;

      .input {
        width: 271px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #ffffff;
        line-height: 25px;

        &:focus {
          background: #0e161d;
          border: 1px solid #00f9e5;
          border-radius: 6px;
        }
      }

      .unit {
        font-size: 13px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #00f9e5;
        margin-left: 5px;
      }
    }

    .btn-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 73px;
      padding-right: 98px;
      .common-btn2 {
        margin-right: 59px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
