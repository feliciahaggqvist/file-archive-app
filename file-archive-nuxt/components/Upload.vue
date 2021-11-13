<template>
  <div>
    <button @click="isUploadModalVisible = true">
      <fa icon="angle-down" style="width: 30px" />Upload file
    </button>
    <UploadModal
      v-show="isUploadModalVisible"
      @close="isUploadModalVisible = false"
    >
      <template #header>
        <div>
          <h1>Upload file</h1>
        </div>
      </template>
      <template #body>
        <form enctype="multipart/form-data" @submit.prevent="sendFile">
          <div>
            <label for="description"
              >File description
              <input
                id="description"
                v-model="description"
                type="text"
                name="description"
                placeholder="File Description"
              />
            </label>
            <label for="file"
              >Select File <input ref="file" type="file" @change="selectFile"
            /></label>
            <span v-if="error">{{ errorMessage }}</span>
          </div>

          <button>Upload File</button>
        </form>
      </template>
    </UploadModal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      isUploadModalVisible: false,
      description: '',
      file: '',
      error: false,
      errorMessage: '',
      message: '',
    }
  },
  methods: {
    selectFile() {
      const file = this.$refs.file.files[0]
      const allowedTypes = ['text/xml', 'application/pdf', 'image/jpeg']
      if (allowedTypes.includes(file.type)) {
        this.file = file
        this.error = false
        this.message = ''
        this.errorMessage = ''
      } else {
        this.error = true
        this.errorMessage = 'Allowed file types are: xml, pdf and jpeg'
      }
    },

    async sendFile() {
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('description', this.description)
      try {
        await axios.post('/file-archive-api/upload', formData)
        this.message = 'File has been uploaded'
        this.file = ''
        this.description = ''
        this.error = false
      } catch (error) {
        this.errorMessage = error.response.data.error
        this.error = true
      }
    },
  }, 
}
</script>

<style>
</style>