<template>
  <el-dialog
    custom-class="set-sale-dialog"
    top="0vh"
    :visible.sync="show"
    @open="onOpen"
    width="800px"
  >
    <div class="set-sale-header text-color" slot="title">
      {{ $t('create.set_promotion') }}
    </div>
    <div class="set-sale-top">
      <el-form ref="form" :rules="rules" :model="form" label-position="top">
        <el-form-item>
          <div class="label text-color">
            {{ $t('create.allow_nfts') }}
          </div>
          <el-switch v-model="form.isOpen"></el-switch>
        </el-form-item>
        <div class="set-sale-form">
          <div class="set-sale-title">{{ $t('create.licensed_info') }}</div>
          <el-form-item>
            <div class="set-sale-label text-color">
              {{ $t('create.bsc_standard') }}
            </div>
            <div class="set-sale-value">
              <div
                class="type-item"
                :class="{ light: item.value == form.sptType }"
                v-for="item in typeList"
                :key="item.value"
                @click="form.sptType = item.value"
              >
                {{ item.label }}
              </div>
            </div>
          </el-form-item>
          <div class="set-sale-label text-color">
            {{ $t('create.bsc_contract') }}
          </div>
          <el-form-item class="set-sale-value" prop="cAddress">
            <el-input
              v-model="form.cAddress"
              class="input"
              placeholder
              style="width: 80%"
            ></el-input>
            <!-- <i class="el-icon-circle-check" style="color: #00F9E5;margin-left: 4px;" v-if="isVerify"></i> -->
            <!-- <i class="el-icon-delete" @click="clearContract" style="color: #87A2B7;margin-left: 12px;" v-if="form.contract"></i> -->
            <!-- <div class="verify">Verify</div> -->
            <div class="set-sale-tip">
              {{ $t('create.allow_support') }}
              <span class="text-color">
                {{ $t('create.bep_standards') }}
              </span>
            </div>
          </el-form-item>
          <template v-if="form.sptType == 2">
            <div class="set-sale-label text-color">
              {{ $t('create.token_id') }}
            </div>
            <el-form-item class="set-sale-value" prop="tokenId">
              <el-input
                v-model="form.tokenId"
                class="input"
                placeholder
                style="width: 376px"
              ></el-input>
            </el-form-item>
          </template>
          <div class="set-sale-label text-color">
            {{ $t('create.how_many_token') }}
          </div>
          <el-form-item class="set-sale-value" prop="discounts">
            <el-input
              v-model="form.discounts"
              class="input"
              placeholder
              style="width: 271px"
            ></el-input>
          </el-form-item>
          <div class="set-sale-label text-color">
            {{ $t('create.discounts_nft') }}
          </div>
          <el-form-item class="set-sale-value" prop="discountsFee">
            <el-input
              v-model="form.discountsFee"
              @blur="handleInputFee"
              class="input"
              placeholder
              style="width: 150px; float: left"
            ></el-input>
            <div class="set-sale-unit" style="float: left">%</div>
          </el-form-item>
        </div>
      </el-form>
      <div class="btn-container">
        <el-button class="common-border-btn" plain @click="show = false">{{
          $t('create.cancel')
        }}</el-button>
        <el-button
          @click="handleSubmit()"
          class="common-btn2"
          style="margin-left: 82px"
          >{{ $t('create.apply') }}</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { startSetNsp } from '@/utils/web3/nft'
import { checkIfContract } from '@/utils/web3/open'
export default {
  name: 'set-sale-dialog',
  props: {
    tokenId: {
      type: String,
      default: '',
    },
    tokenInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    var reg = /^\+?[1-9][0-9]*$/
    var validateTokenId = (rule, value, callback) => {
      if (this.form.sptType == 2 && !value) {
        callback(new Error('Please enter the token ID'))
      }
      callback()
    }
    var validateContractAddress = (rule, value, callback) => {
      if (value) {
        if (value.indexOf('0x') != 0 || value.length != 42) {
          callback(new Error('Contract address is invalid'))
        }
        checkIfContract(value).then((r) => {
          if (!r) {
            callback(new Error('Address is not contract'))
          } else {
            callback()
          }
        })
      } else {
        callback(new Error('Please enter the contract address'))
      }
    }
    var validateNumber = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error('Please enter a integer'))
      }
      if (value <= 0) {
        callback(new Error('Must be greater than 0'))
      }
      callback()
    }
    var validateDecimal = (rule, value, callback) => {
      if (isNaN(Number(value)) || Number(value) < 0) {
        callback(new Error('Input value invalid'))
      }
      callback()
    }
    return {
      show: false,
      typeList: [
        {
          label: 'BEP-20',
          value: 0,
        },
        {
          label: 'BEP-721',
          value: 1,
        },
        {
          label: 'BEP-1155',
          value: 2,
        },
      ],
      isVerify: false,
      form: {
        isOpen: true,
        sptType: 0,
        cAddress: undefined,
        tokenId: undefined,
        discounts: undefined,
        discountsFee: undefined,
      },
      rules: {
        cAddress: [
          {
            required: true,
            message: 'Please enter the contract address',
            trigger: 'blur',
          },
          { min: 42, max: 42, message: 'Length should be 42', trigger: 'blur' },
          {
            validator: validateContractAddress,
            trigger: 'blur',
          },
        ],
        tokenId: [{ validator: validateTokenId, trigger: 'blur' }],
        discounts: [
          {
            required: true,
            message: 'Please enter the discounts',
            trigger: 'blur',
          },
          { validator: validateNumber, trigger: 'blur' },
        ],
        discountsFee: [
          {
            required: true,
            message: 'Please enter the discountsFee',
            trigger: 'blur',
          },
          {
            validator: validateDecimal,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    onOpen() {
      const { cAddress, discounts, discountsFee, isOpen, sptType, tokenId } =
        this.tokenInfo.nsp
      this.form = {
        cAddress,
        discounts,
        discountsFee,
        isOpen,
        sptType,
        tokenId,
      }
      if (this.form.discountsFee) {
        this.form.discountsFee = (this.form.discountsFee / 100).toFixed(2)
      }
    },
    /** 表单提交 */
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var loadingInstance = this.$loading({
            background: 'rgba(0, 0, 0, 0.8)',
          })
          startSetNsp(this.tokenId, this.form)
            .then(() => {
              this.$toast.success(this.$t('news-detail.submit_success'))
              this.$emit('handleReload')
              this.show = false
            })
            .catch((e) => {
              this.$toast.error(e && e.message ? e.message : e)
            })
            .finally(() => {
              loadingInstance.close()
            })
        }
      })
    },
    handleInputFee(e) {
      this.form.discountsFee =
        e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null
    },
    /** 清理地址 */
    clearContract() {
      this.form.cAddress = ''
      this.isVerify = false
    },
    showDialog() {
      this.show = true
    },
  },
}
</script>

<style lang="scss">
.set-sale-dialog {
  background: #1a2027;
  border: 1px solid #2c3638;
  border-radius: 12px 6px 6px 6px;

  .set-sale-header {
    text-align: left;
    font-size: 24px;
    font-family: Arial;
    font-weight: bold;
  }

  .set-sale-top {
    border: 1px solid #1f272f;
    padding: 33px 46px 0 46px;
    text-align: left;

    .label {
      font-size: 18px;
      font-family: Arial;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 20px;
    }
  }

  .set-sale-form {
    background: #212831;
    border-radius: 11px;
    margin: 30px 0 84px 0;
    padding: 38px 0 44px 0;

    .set-sale-title {
      font-size: 20px;
      font-family: Arial;
      font-weight: bold;
      color: #9faec0;
      margin: 0 35px;
    }

    .set-sale-label {
      font-size: 18px;
      font-family: Arial;
      font-weight: bold;
      margin: 42px 36px 0 36px;
    }

    .set-sale-value {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 20px 36px 0 36px;

      .el-icon-delete {
        cursor: pointer;
      }

      .type-item {
        min-width: 160px;
        height: 48px;
        line-height: 48px;
        background: #0e161d;
        border: 1px solid #313838;
        border-radius: 8px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        margin-right: 9px;
        text-align: center;
        cursor: pointer;

        &.light {
          background: #18252f;
          border: 1px solid #2fc9bd;
          border-radius: 8px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #00fbe6;
        }
      }

      .set-sale-unit {
        margin-left: 6px;
        font-size: 14px;
        font-family: Arial;
        font-weight: bold;
        color: #00f9e5;
        flex: 1;
      }

      .verify {
        width: 100px;
        height: 48px;
        line-height: 48px;
        background: #31cad7;
        border: 1px solid #313838;
        border-radius: 8px;
        font-size: 12px;
        font-family: Arial;
        font-weight: bold;
        color: #212831;
        text-align: center;
        margin-left: 4px;
        margin-top: 8px;
        cursor: pointer;
      }
    }

    .set-sale-tip {
      font-size: 12px;
      font-family: Arial;
      font-weight: 400;
      color: #747c7c;
      text-align: left;
    }
  }

  .btn-container {
    margin-top: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 36px;

    .common-border-btn,
    .common-btn2 {
      width: 135px;
    }

    .common-border-btn {
      border: 1px solid #26beef;
      border-radius: 7px;
      font-size: 12px;
      font-family: Arial;
      font-weight: bold;
      color: #14daeb;
      background: transparent;
    }
  }

  .el-dialog {
    background: #1a2027;
    border: 1px solid #2c3638;
    border-radius: 12px 6px 6px 6px;
  }

  .el-dialog__body {
    padding: 0 0;
  }

  .el-switch.is-checked .el-switch__core {
    border-color: #00f9e5;
    background-color: #00f9e5;
  }
}
</style>
