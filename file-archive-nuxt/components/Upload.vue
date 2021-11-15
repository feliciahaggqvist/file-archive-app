<template>
  <div class="flex flex-col justify-center items-center">
    <div
      v-if="files.length"
      class="mt-20 border border-solid border-black shadow-lg rounded-lg"
    >
      <table class="mx-10 my-5">
        <tr>
          <th class="px-4"></th>
          <th class="px-4 text-left flex">
            Filename
            <fa
              :icon="iconSort"
              :class="ascSort ? 'self-end' : 'items-center'"
              class="ml-2"
              @click="toggleSort()"
            />
          </th>
          <th class="px-4 text-left">Description</th>
          <th class="px-4 text-left">Uploaded by</th>
          <th class="px-4 text-left">Date</th>
        </tr>
        <tr v-for="file in files" :key="file.filename">
          <td v-if="file.mimetype" class="mr-4">
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
          <td v-if="file.filename" class="truncate max-width-characters p-4">
            <a :href="file.url">{{ file.filename }}</a>
          </td>
          <td class="p-4">{{ file.description }}</td>
          <td class="p-4">{{ file.uploaded_by }}</td>
          <td class="p-4">{{ file.uploaded_at }}</td>
          <td class="pl-4">
            <fa
              icon="times"
              class="text-black text-sm w-5 h-5 cursor-pointer"
              @click="deleteFile(file.filename)"
            />
          </td>
        </tr>
      </table>
    </div>

    <button
      class="mt-10 bg-black text-white border rounded-full pl-2 pr-6 py-1"
      @click="isUploadModalVisible = true"
    >
      <fa icon="angle-down" style="width: 30px" />Upload file
    </button>

    <UploadModal
      v-show="isUploadModalVisible"
      @close="isUploadModalVisible = false"
    >
      <template #header>
        <div class="flex justify-center items-center">
          <h1 class="font-bold text-xl">Upload file</h1>
        </div>
      </template>
      <template #body>
        <form
          enctype="multipart/form-data"
          class="flex flex-col justfiy-center items-center p-6"
          @submit.prevent="uploadFile"
        >
          <div
            class="
              flex flex-col
              justify-center
              items-center
              space-y-2
              text-sm
              font-semibold
            "
          >
            <label for="description" class="flex flex-col w-full"
              >File description
              <input
                id="description"
                v-model="description"
                type="text"
                name="description"
                class="py-0.5 border border-solid border-black rounded-lg"
              />
            </label>
            <label for="uploadedBy" class="flex flex-col w-full"
              >Uploaded by
              <input
                id="uploaded_by"
                v-model="uploaded_by"
                type="text"
                name="uploaded_by"
                class="py-0.5 border border-solid border-black rounded-lg"
              />
            </label>
            <label for="file" class="flex flex-col"
              >Select File
              <input
                ref="file"
                type="file"
                class="border border-solid border-black rounded-lg"
                @change="selectFile"
            /></label>
            <span v-if="error" class="mt-4 text-red-500">{{
              errorMessage
            }}</span>
          </div>

          <button
            class="mt-12 bg-black text-white border rounded-full px-4 py-1"
          >
            Upload File
          </button>
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
      uploaded_by: '',
      description: '',
      ascSort: false,
      file: '',
      error: false,
      errorMessage: '',
      message: '',
      files: [],
    }
  },
  computed: {
    iconSort() {
      return this.ascSort ? 'sort-up' : 'sort-down'
    },
  },
  async mounted() {
    await this.getFiles()
  },
  methods: {
    async getFiles() {
      try {
        const files = await axios.get('/files')
        this.files = files.data
        this.files.sort(this.sortDesc)
        this.ascSort = false
      } catch (error) {
        this.errorMessage = `Cannot get files: ${error}`
        this.error = true
      }
    },

    toggleSort() {
      this.ascSort = !this.ascSort
      this.ascSort
        ? this.files.sort(this.sortAsc)
        : this.files.sort(this.sortDesc)
    },

    sortAsc(a, b) {
      if (a.filename < b.filename) {
        return -1
      }
      if (a.filename > b.filename) {
        return 1
      }
      return 0
    },

    sortDesc(a, b) {
      if (a.filename > b.filename) {
        return -1
      }
      if (a.filename < b.filename) {
        return 1
      }
      return 0
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

    async uploadFile() {
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
          this.description = ''
          this.uploaded_by = ''
          this.file = ''
          this.error = false
          this.getFiles()
        }
      } catch (error) {
        this.errorMessage = `Cannot upload file: ${error}`
        this.error = true
      }
    },
    async deleteFile(filename) {
      try {
        const chosenFile = this.files.find((file) => file.filename === filename)
        if (!chosenFile) {
          this.error = true
          this.errorMessage = 'Cannot find the file'
        } else {
          await axios.delete(`/files/${chosenFile.filename}`)
        }
        this.getFiles()
      } catch (error) {
        this.errorMessage = `Cannot delete file: ${error}`
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