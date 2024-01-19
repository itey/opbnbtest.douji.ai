<template>
  <div class="profile-container">
    <div class="profile-title text-color">{{ $t("user.profile") }}</div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">{{ $t("user.co_im") }}</div>
        <div class="form-value">
          <el-upload
            accept=".png, .jpeg, .jpg, .gif"
            :show-file-list="false"
            class="form-upload"
            :on-change="fileChange"
            :auto-upload="false"
            action="#"
          >
            <div class="form-upload-img" v-if="imageUrl">
              <img class="file-img" :src="imageUrl" />
              <img
                class="file-img-icon"
                src="@/assets/images/user/camera.png"
              />
            </div>
            <div class="form-upload-empty" v-else>
              <div class="form-upload-icon">+</div>
            </div>
          </el-upload>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">{{ $t("user.alias") }}</div>
        <div class="form-value">
          <el-input
            @blur="
              () =>
                (userInfo.nickname = userInfo.nickname.replace(/(\s*$)/g, ''))
            "
            v-model="userInfo.nickname"
          ></el-input>
          <div class="form-tip">
            {{ $t("user.alias_tip") }}
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">{{ $t("user.short_desc") }}</div>
        <div class="form-value">
          <el-input
            @blur="
              () =>
                (userInfo.short_description =
                  userInfo.short_description.replace(/(\s*$)/g, ''))
            "
            v-model="userInfo.short_description"
          ></el-input>
          <div class="form-tip">
            {{ $t("user.short_tip") }}
          </div>
        </div>
      </div>
    </div>
    <div class="profile-sub-title text-color">{{ $t("user.social") }}</div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">{{ $t("user.loc") }}</div>
        <div class="form-value">
          <el-input
            @blur="
              () =>
                (userInfo.location = userInfo.location.replace(/(\s*$)/g, ''))
            "
            v-model="userInfo.location"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">Website</div>
        <div class="form-value">
          <el-input
            @input="(val) => (userInfo.website = val.replace(/\s/g, ''))"
            v-model="userInfo.website"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">Twitter</div>
        <div class="form-value">
          <el-input
            @input="(val) => (userInfo.twitter = val.replace(/\s/g, ''))"
            v-model="userInfo.twitter"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">Telegram</div>
        <div class="form-value">
          <el-input
            @input="(val) => (userInfo.telegram = val.replace(/\s/g, ''))"
            v-model="userInfo.telegram"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">Facebook</div>
        <div class="form-value">
          <el-input
            @input="(val) => (userInfo.facebook = val.replace(/\s/g, ''))"
            v-model="userInfo.facebook"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">Tiktok</div>
        <div class="form-value">
          <el-input
            @input="(val) => (userInfo.tiktok = val.replace(/\s/g, ''))"
            v-model="userInfo.tiktok"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">Instagram</div>
        <div class="form-value">
          <el-input
            @input="(val) => (userInfo.instagram = val.replace(/\s/g, ''))"
            v-model="userInfo.instagram"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">Youtube</div>
        <div class="form-value">
          <el-input
            @input="(val) => (userInfo.youtube = val.replace(/\s/g, ''))"
            v-model="userInfo.youtube"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">Github</div>
        <div class="form-value">
          <el-input
            @input="(val) => (userInfo.github = val.replace(/\s/g, ''))"
            v-model="userInfo.github"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="btn-container">
      <el-button @click="handleSave()" class="common-btn2">Save</el-button>
    </div>
  </div>
</template>

<script>
import { getUserInfo, updateUserInfo, uploadFile } from "@/utils/http";
export default {
  name: "profile-view",
  data() {
    return {
      imageFile: undefined,
      imageUrl: undefined,
      error: {},
      userInfo: {
        nickname: "",
        head_img: "",
        short_description: "",
        location: "",
        twitter: "",
        telegram: "",
        facebook: "",
        tiktok: "",
        linkedin: "",
        medium: "",
        whatsapp: "",
        website: "",
        instagram: "",
        youtube: "",
        github: "",
        wechat: "",
        discord: "",
        line: "",
        bilibili: "",
      },
    };
  },
  mounted() {
    this.loadUserInfo();
  },
  methods: {
    fileChange(file) {
      const fileType = file.raw.type;
      const fileSize = file.size;
      if (fileType.indexOf("image") === -1) {
        this.$toast.error(this.$t("common.img_format_error"));
        return;
      }
      if (fileSize > 1 * 1024 * 1024) {
        this.$toast.error(this.$t("common.img_large_error", 1));
        return;
      }
      this.dialogImageUrl = window.URL
        ? window.URL.createObjectURL(file.raw)
        : window.webkitURL.createObjectURL(file.raw);
      this.imageUrl = this.dialogImageUrl;
      this.imageFile = file;
    },
    /** 保存用户资料 */
    async handleSave() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        await this.saveHeadImg();
      } catch (e) {
        this.$toast.error(this.$t("common.img_upload_error"));
        loadingInstance.close();
        return;
      }
      await this.saveBaseInfo();
      this.$toast.success(this.$t("user.profile_save_success"));
      loadingInstance.close();
      this.loadUserInfo();
    },
    /** 保存基本数据 */
    saveBaseInfo() {
      return new Promise((resolve, reject) => {
        updateUserInfo(this.userInfo)
          .then(() => {
            return resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    /** 保存头像文件 */
    async saveHeadImg() {
      if (!this.imageFile) {
        return;
      }
      const formData = new FormData();
      formData.append("file", this.imageFile.raw);
      const r = await uploadFile(formData);
      this.userInfo.head_img = r.data.url;
    },
    /** 获取用户信息 */
    loadUserInfo() {
      var loadingInstance = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
      });
      getUserInfo()
        .then((res) => {
          this.userInfo = res.data;
          this.imageUrl = this.userInfo.head_img;
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
  },
};
</script>
<style lang="scss">
.profile-container {
  text-align: left;

  .profile-title {
    margin: 44px 31px;
    font-size: 32px;
    font-family: Source Han Sans CN;
    font-weight: bold;
  }

  .profile-sub-title {
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    margin-left: 32px;
    margin-top: 69px;
  }

  .form-container {
    .form-item {
      margin-top: 56px;
      display: flex;
      flex-direction: row;

      .form-label {
        line-height: 48px;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #9faec0;
        width: 172px;
        padding-left: 46px;
      }

      .form-value {
        .form-tip {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #707d8c;
          margin-top: 16px;
        }

        .form-upload {
          width: 300px;
          height: 182px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;

          .form-upload-img {
            position: relative;

            .file-img {
              width: 300px;
              height: 182px;
              border-radius: 8px;
            }

            .file-img-icon {
              position: absolute;
              top: 64px;
              left: 118px;
              width: 64px;
              height: 54px;
            }
          }

          .form-upload-icon {
            font-size: 48px;
            font-weight: 400;
            color: #707d8c;
          }
        }
      }
    }
  }

  .btn-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    padding: 57px 75px 65px 0;
  }
}

.form-value .el-input__inner {
  width: 729px;
}
</style>
