import { shallowMount, createLocalVue } from '@vue/test-utils'
import Upload from '@/components/Upload.vue'
import axios from 'axios'

const localVue = createLocalVue();

const mockUploadedFiles = [
    {
      filename: "cake-1636911777243.jpg",
      url: "http://localhost:8081/files/cake-1636911777243.jpg",
      mimetype: "image/jpeg",
      description: "this is a jpg file",
      uploaded_by: "Felicia",
      uploaded_at: "14/11/2021",
    },
    {
      filename: "pdf-sample-1636911816661.pdf",
      url: "http://localhost:8081/files/pdf-sample-1636911816661.pdf",
      mimetype: "application/pdf",
      description: "this is a pdf",
      uploaded_by: "Felicia",
      uploaded_at: "14/11/2021",
    },
    {
      filename: "test-1636911753512.xml",
      url: "http://localhost:8081/files/test-1636911753512.xml",
      mimetype: "text/xml",
      description: "this is an xml file",
      uploaded_by: "Felicia",
      uploaded_at: "14/11/2021",
    },
  ];

  jest.mock('axios', () => ({
      get: jest.fn(() => mockUploadedFiles),
  }))
  

  const stubs = {
      UploadModal: true,
      fa: true,
  }

describe('Upload', () => {
    const wrapper = shallowMount(Upload, {
        localVue,
        stubs,
        files: [],
    });
    
    test('when files do not exist, component is rendered correctly', async () => {        
        expect(wrapper.element).toMatchSnapshot();
    }) 

    test('when files exist, component is rendered correctly', async () => {
        await wrapper.setData({
            files: mockUploadedFiles
        });
        
        expect(wrapper.element).toMatchSnapshot();
      })
      
      test('when getFiles is successful, files data prop is set correctly', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve(mockUploadedFiles))
        
        await wrapper.vm.getFiles;
        
        expect(axios.get).toHaveBeenCalled()
        expect(axios.get).toHaveBeenCalledWith('/files')
        expect(wrapper.vm.files).toEqual(mockUploadedFiles)
    })
})
