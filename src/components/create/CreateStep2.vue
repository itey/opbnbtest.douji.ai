<template>
  <div class="create-step2">
    <div class="title">
      {{ edit ? $t("create.update_mold_2") : $t("create.create_mold_2") }}
    </div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">{{ $t("create.title") }}*</div>
        <div class="form-value">
          <div>
            <el-input
              @blur="() => (form.title = form.title.replace(/(\s*$)/g, ''))"
              v-model="form.title"
              @change="checkItem('title')"
              class="input"
              maxlength="100"
            ></el-input>
          </div>
          <div v-if="error.title" class="tip-error">{{ error.title }}</div>
          <div v-else class="tip">{{ $t("create.name") }}</div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">{{ $t("create.description") }}*</div>
        <div class="form-value">
          <div>
            <el-input
              @blur="
                () =>
                  (form.description = form.description.replace(/(\s*$)/g, ''))
              "
              v-model="form.description"
              @change="checkItem('description')"
              class="input"
              type="textarea"
              rows="3"
              maxlength="300"
            ></el-input>
          </div>
          <div v-if="error.description" class="tip-error">
            {{ error.description }}
          </div>
          <div v-else class="tip">{{ $t("create.write_detail_content") }}</div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">{{ $t("create.cover_img") }}*</div>
        <div class="form-value">
          <el-upload
            accept=".png, .jpeg, .jpg, .gif, .webp"
            :show-file-list="false"
            class="form-upload"
            :on-change="fileChange"
            :auto-upload="false"
            action="#"
          >
            <div class="form-upload-img" v-if="imageUrl">
              <img class="file-img" :src="imageUrl" />
            </div>
            <div class="form-upload-empty" v-else>
              <div class="form-upload-icon">+</div>
              <div class="form-upload-tip">
                {{ $t("create.upload_img_limit") }}
              </div>
            </div>
          </el-upload>
          <div v-if="error.image" class="tip-error">{{ error.image }}</div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">{{ $t("create.tag") }}*</div>
        <div class="form-value">
          <div>
            <el-tag
              class="tag"
              :key="tag"
              v-for="tag in tags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
              >{{ tag }}</el-tag
            >
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            ></el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
              >+ {{ $t("create.add") }}</el-button
            >
          </div>
          <div v-if="error.keyword" class="tip-error">{{ error.keyword }}</div>
          <div v-else class="tip">{{ $t("create.write_detail_content") }}</div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">
          <div>{{ $t("create.article_content") }}*</div>
          <div class="form-label-sub">
            <img
              style="width: 14px; height: 14px"
              src="@/assets/images/create/website.png"
            />
            <div class="form-label-sub-text">
              {{ $t("create.open_access") }}
            </div>
          </div>
        </div>
        <div class="form-value">
          <div style="width: 756px">
            <PubVditor :id="'1'" ref="contentPub" :pdata="form.openContent" />
          </div>
          <div v-if="error.contentUrl" class="tip-error">
            {{ error.contentUrl }}
          </div>
          <div v-else class="tip">{{ $t("create.write_detail_content") }}</div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">
          <div>{{ $t("create.article_content") }}</div>
          <div class="form-label-sub">
            <img
              style="width: 14px; height: 14px"
              src="@/assets/images/create/protect.png"
            />
            <div class="form-label-sub-text">{{ $t("create.protected") }}</div>
          </div>
        </div>
        <div class="form-value">
          <div style="width: 756px">
            <PrivateVditor
              :id="'2'"
              ref="contentPrivate"
              :pdata="form.protectedContent"
            />
          </div>
          <div class="tip">{{ $t("create.write_detail_content") }}</div>
        </div>
      </div>
      <div class="btn-container" v-if="edit">
        <el-button class="common-btn2" @click="backClick">{{
          $t("create.back")
        }}</el-button>
        <el-button class="common-btn2" @click="updateClick">{{
          $t("create.update")
        }}</el-button>
      </div>
      <div class="btn-container" v-else>
        <el-button class="common-btn2" @click="backClick">{{
          $t("create.back")
        }}</el-button>
        <el-button class="common-btn2" @click="saveClick">{{
          $t("create.save")
        }}</el-button>
        <el-button class="common-btn2" @click="nextClick">{{
          $t("create.next")
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { emptyCompare, specialCharFilter } from "@/utils/common";
import { encryptContent, uploadContent, uploadFile } from "@/utils/http";
import {
  default as PrivateVditor,
  default as PubVditor,
} from "../MarkdownVditor.vue";
export default {
  name: "create-step2",
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
  components: {
    PubVditor,
    PrivateVditor,
  },
  data() {
    return {
      imageFile: undefined,
      imageUrl: undefined,
      tags: [],
      upload: {
        action: process.env.VUE_APP_BASE_URL + "/uploadFile",
        headers: {
          token: this.$store.state.user.token,
        },
        fileType: ["png", "jpg", "jpeg", "gif", "webp"],
        fileSize: 1,
      },
      form: {
        title: undefined,
        name: undefined,
        image: undefined,
        imageFile: undefined,
        description: undefined,
        keyword: undefined,
        contentUrl: undefined,
        openContent: undefined,
        protected: undefined,
        protectedContent: undefined,
        contentType: undefined,
        category: undefined,
        prompt: undefined,
        language: undefined,
        maxSupply: undefined,
        initialQuantity: undefined,
        initialPrice: undefined,
      },
      error: {},
      inputVisible: false,
      inputValue: "",
    };
  },
  mounted() {
    if (this.metadata) {
      this.form = JSON.parse(JSON.stringify(this.metadata));
      if (this.form.image) {
        this.imageUrl = this.form.image;
      }
      if (this.form.keyword) {
        this.tags = this.form.keyword;
      }
    }
  },
  methods: {
    /** 获取markdown内容 */
    async markdownGetValue() {
      var pubContent = this.$refs.contentPub.getValue();
      if (pubContent) pubContent = pubContent.trim();
      var privateContent = this.$refs.contentPrivate.getValue();
      if (privateContent) privateContent = privateContent.trim();
      if (pubContent != null && pubContent != "Cg==" && pubContent != "") {
        if (!emptyCompare(pubContent, this.metadata.openContent)) {
          const r = await uploadContent(pubContent);
          if (r.code == 1) {
            this.form.contentUrl = r.data.url;
            this.form.openContent = pubContent;
          }
        }
      } else {
        this.form.contentUrl = undefined;
        this.form.openContent = undefined;
      }
      if (
        privateContent != null &&
        privateContent != "Cg==" &&
        privateContent != ""
      ) {
        if (!emptyCompare(privateContent, this.metadata.protectedContent)) {
          const r = await uploadContent(privateContent);
          if (r.code == 1) {
            const protectedUrl = r.data.url;
            const res = await encryptContent(protectedUrl);
            if (res.code == 1) {
              this.form.protected = res.data.encrypted;
              this.form.protectedContent = privateContent;
            }
          }
        }
      } else {
        this.form.protected = undefined;
        this.form.protectedContent = undefined;
      }
    },
    /** 图片选择 */
    fileChange(file) {
      this.clearError("image");
      const fileType = file.raw.type;
      const fileSize = file.size;
      if (fileType.indexOf("image") === -1) {
        this.$set(this.error, "image", this.$t("common.img_format_error"));
        return;
      }
      if (fileSize > this.upload.fileSize * 1024 * 1024) {
        this.$set(
          this.error,
          "image",
          this.$t("common.img_large_error", [this.upload.fileSize])
        );
        return;
      }
      this.dialogImageUrl = window.URL
        ? window.URL.createObjectURL(file.raw)
        : window.webkitURL.createObjectURL(file.raw);
      this.imageUrl = this.dialogImageUrl;
      this.imageFile = file;
    },
    /** 处理图片上传 */
    async uploadFileProcess() {
      if (this.imageFile && this.imageFile != this.metadata.imageFile) {
        const formData = new FormData();
        formData.append("file", this.imageFile.raw);
        const r = await uploadFile(formData);
        if (r.code == 1) {
          this.form.image = r.data.url;
          this.form.imageFile = this.imageFile;
        }
      }
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.form.keyword = this.tags;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (!this.form.keyword) {
        this.form.keyword = [];
      }
      let inputValue = this.inputValue.replace(/(\s*$)/g, "");
      if (inputValue && this.tags.indexOf(inputValue) < 0) {
        this.tags.push(inputValue);
        this.form.keyword = this.tags;
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    clearError(val) {
      this.$set(this.error, val, "");
    },
    setError(key, val) {
      this.$set(this.error, key, val);
    },
    /** 单项检查 */
    checkItem(key) {
      switch (key) {
        case "title":
          if (!this.form.title) {
            this.setError(key, this.$t("create.title_required"));
          } else {
            this.clearError(key);
          }
          break;
        case "description":
          if (!this.form.description) {
            this.setError(key, this.$t("create.description_required"));
          } else {
            this.clearError(key);
          }
          break;
        case "image":
          if (!this.form.image) {
            this.setError(key, this.$t("create.image_required"));
          } else {
            this.clearError(key);
          }
          break;
        case "keyword":
          if (!this.form.keyword.length) {
            this.setError(key, this.$t("create.keyword_required"));
          } else {
            this.clearError(key);
          }
          break;
        case "contentUrl":
          if (!this.form.contentUrl) {
            this.setError(key, this.$t("create.content_pub_required"));
          } else {
            this.clearError(key);
          }
          break;
        default:
          break;
      }
    },
    /** 表单检查 */
    formCheck() {
      this.error = {};
      var ifPass = true;
      if (!this.form.title) {
        this.setError("title", this.$t("create.title_required"));
        ifPass = false;
      }

      if (!this.form.description) {
        this.setError("description", this.$t("create.description_required"));
        ifPass = false;
      }

      if (!this.form.image) {
        this.setError("image", this.$t("create.image_required"));
        ifPass = false;
      }

      if (!this.form.keyword.length) {
        this.setError("keyword", this.$t("create.keyword_required"));
        ifPass = false;
      }

      if (!this.form.contentUrl) {
        this.setError("contentUrl", this.$t("create.content_pub_required"));
        ifPass = false;
      }
      return ifPass;
    },
    backClick() {
      this.$emit("backClick", 1);
    },
    async saveClick() {
      const c = await this.$store.dispatch("CheckLogin", true);
      if (!c) {
        return;
      }
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        await this.markdownGetValue();
        await this.uploadFileProcess();
      } finally {
        loadingInstance.close();
      }
      this.$emit("saveClick", this.form);
      this.$toast.success(this.$t("common.save_success"));
    },
    async nextClick() {
      const c = await this.$store.dispatch("CheckLogin", true);
      if (!c) {
        return;
      }
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        await this.markdownGetValue();
        await this.uploadFileProcess();
      } finally {
        loadingInstance.close();
      }
      this.$emit("saveClick", this.form);
      if (this.formCheck()) {
        this.$emit("nextClick", 3);
      }
    },
    async updateClick() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        await this.markdownGetValue();
        await this.uploadFileProcess();
      } finally {
        loadingInstance.close();
      }
      if (
        this.metadata.title == this.form.title &&
        this.metadata.description == this.form.description &&
        this.metadata.image == this.form.image &&
        this.metadata.keyword.join(",") == this.form.keyword.join(",") &&
        emptyCompare(this.metadata.openContent, this.form.openContent) &&
        emptyCompare(this.metadata.protectedContent, this.form.protectedContent)
      ) {
        this.$toast(this.$t("create.data_not_modified"));
        return;
      }
      if (this.formCheck()) {
        this.$emit("handleUpdate", this.form);
      }
    },
    charFilter(val) {
      return specialCharFilter(val);
    },
  },
};
</script>

<style lang="scss">
.create-step2 {
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
    padding: 58px 0 58px 227px;

    .form-item {
      display: flex;
      flex-direction: row;
      margin-top: 41px;

      .form-label {
        width: 129px;
        line-height: 35px;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #9faec0;
        text-align: left;
      }

      .form-label-sub {
        display: flex;
        flex-direction: row;
        align-items: center;

        .form-label-sub-text {
          margin-left: 8px;
          font-size: 14px;
          font-family: Arial;
          font-weight: 400;
          color: #00f9e5;
        }
      }

      .form-value {
        text-align: left;

        .form-upload {
          width: 502px;
          height: 182px;
          background: #0e161d;
          border: 1px solid #313838;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;

          .form-upload-img {
            position: relative;

            .file-img {
              width: 502px;
              height: 182px;
              border-radius: 6px;
            }

            .file-img-delete {
              position: absolute;
              top: 66px;
              left: 104px;
            }
          }

          .form-upload-icon {
            font-size: 35px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #707d8c;
          }

          .form-upload-tip {
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #707d8c;
            margin-top: 16px;
          }
        }

        .tip {
          margin-top: 16px;
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #707d8c;
        }

        .tip-error {
          margin-top: 16px;
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #a50507;
        }

        .input {
          width: 765px;
        }

        .el-tag + .el-tag {
          margin-left: 10px;
        }

        .button-new-tag {
          margin-left: 10px;
          height: 32px;
          line-height: 30px;
          padding-top: 0;
          padding-bottom: 0;
        }

        .input-new-tag {
          width: 90px;
          margin-left: 10px;
          vertical-align: bottom;
        }
      }
    }

    .btn-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 104px;
      padding-right: 227px;

      .common-btn2 {
        margin-right: 82px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
