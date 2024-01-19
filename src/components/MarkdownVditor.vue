<template>
  <div :id="id" />
</template>

<script>
import Vditor from 'vditor'

export default {
  name: 'MarkdowVditor',

  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      contentEditor: undefined,
      isLoading: true,
    }
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    pdata: {
      type: String,
      required: true,
      default: '',
    },
  },
  mounted() {
    this.initVditor()
  },
  methods: {
    initVditor() {
      this.contentEditor = new Vditor(this.id, {
        lang: this.$store.state.common.language == 'en' ? 'en_US' : 'zh_TW',
        upload: {
          max: 1048576,
          fieldName: 'file',
          multiple: false,
          accept: 'image/*',
          headers: {
            token: this.$store.state.user.token,
          },
          url: this.baseUrl + '/uploadFile',
          success: (editor, data) => {
            var jsonRes = {}
            if (data) {
              jsonRes = JSON.parse(data)
            }
            if (jsonRes.code == 1) {
              let imgMdStr = ''
              const url = jsonRes.data.url
              imgMdStr = `![${'img'}](${url})`
              this.contentEditor.insertValue(imgMdStr)
            } else {
              this.$toast.error(jsonRes.message)
            }
          },
          filename(name) {
            return name
              .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
              .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
              .replace('/\\s/g', '')
          },
          error(e) {
            this.$toast.error(e && e.message ? e.message : e)
          },
        },
        height: 360,
        toolbarConfig: {
          pin: true,
        },
        cache: {
          enable: false,
        },
        after: () => {
          this.contentEditor.setValue(this.pdata)
        },
      })
      this.$nextTick(() => {
        this.isLoading = false
      })
    },
    getValue() {
      return this.contentEditor.getValue()
    },
  },
}
</script>

<style lang="less">
@import '~vditor/src/assets/less/index';
</style>
