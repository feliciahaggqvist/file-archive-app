<template>
  <div class="flex flex-col justify-center items-center">
    <div
      v-if="files.length"
      class="mt-20 border border-solid border-black shadow-lg rounded-lg"
    >
      <table class="mx-10 my-5">
        <tr>
          <th class="px-2"></th>
          <th class="px-2 flex justify-center items-center">
            File name <!-- <fa icon="sort-down" class="ml-1" /> -->
          </th>
          <th class="px-2">Description</th>
          <th class="px-2">Uploaded by</th>
          <th class="px-2">Date</th>
        </tr>
        <tr v-for="file in files" :key="file.name">
          <td v-if="file.mimetype" class="mr-2">
            <span v-if="file.mimetype === 'text/xml'">
              <fa icon="file-code" style="width: 2rem; height: 2rem" />
            </span>
            <span v-if="file.mimetype === 'application/pdf'">
              <fa icon="file-pdf" style="width: 2rem; height: 2rem" />
            </span>
            <span v-if="file.mimetype === 'image/jpeg'">
              <fa icon="file-image" style="width: 2rem; height: 2rem" />
            </span>
          </td>
          <td v-if="file.name" class="truncate max-width-characters px-2">
            <a :href="file.url">{{ file.name }}</a>
          </td>
          <td class="px-2">{{ file.description }}</td>
          <td class="px-2">{{ file.uploaded_by }}</td>
          <td class="px-2">{{ file.uploaded_at }}</td>
          <td class="pl-2">
            <fa
              icon="times"
              class="
                text-black text-sm
                w-5
                h-5
                cursor-pointer
              "
              @click="deleteFile(file.name)"
            />
          </td>
        </tr>
      </table>
    </div>

    <button
      class="mt-4 bg-black text-white border rounded-full px-2 py-1"
      @click="isUploadModalVisible = true"
    >
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
            <label for="uploadedBy"
              >Updated by:
              <input
                id="uploaded_by"
                v-model="uploaded_by"
                type="text"
                name="uploaded_by"
                placeholder="Uploaded by"
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
import axios from 'axios'
export default {
  data() {
    return {
      isUploadModalVisible: false,
      name: '',
      url: '',
      description: '',
      uploaded_by: '',
      file: '',
      error: false,
      errorMessage: '',
      message: '',
      files: [],
    }
  },
  async mounted() {
    await this.getFiles()
  },
  methods: {
    async getFiles() {
      try {
        const files = await axios.get('/files')
        if (files?.data?.length) {
          this.files = files.data
        }
      } catch (err) {
        console.log(err)
      }
    },

    selectFile() {
      const file = this.$refs.file.files[0]
      const allowedTypes = ['text/xml', 'application/pdf', 'image/jpeg']
      if (allowedTypes.includes(file?.type)) {
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
      formData.append('uploaded_by', this.uploaded_by)
      try {
        if (!this.file) {
          this.error = true
          this.errorMessage = 'Please select a file to upload'
        } else {
          await axios.post('/upload', formData)
          this.message = 'File has been uploaded'
          this.isUploadModalVisible = false
          this.error = false
          this.getFiles()
        }
      } catch (error) {
        this.errorMessage = error.response.data.error
        this.error = true
      }
    },
    async deleteFile(filename) {
      try {
        const chosenFile = this.files.find((file) => file.name === filename)
        if (!chosenFile) {
          this.error = true
          this.errorMessage = 'Cannot find the file'
        } else {
          console.log('filename: ', chosenFile.name);
          await axios.delete(`/files/${chosenFile.name}`)
          this.getFiles()
        }
      } catch (error) {
        this.errorMessage = `Cannot delete the file: ${error}`
        this.error = true
      }
    },
  },
}
</script>

<style scoped lang="css">
.max-width-characters {
  max-width: 20ch;
}
</style>