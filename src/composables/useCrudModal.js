import {
  reactive,
  ref
} from 'vue'
import {
  message
} from 'ant-design-vue'

export default function useCrudModal({
  api,
  initForm,
  // getById
}) {
  const formRef = ref()
  const state = reactive({
    editingId: undefined,
    loading: false,
    open: false,
    formState: {}
  })

  const openCreate = () => {
    state.editingId = undefined
    state.formState = initForm()
    state.open = true
  }

  const openEdit = async (record) => {
    state.editingId = record.id
    state.open = true
    // const res = await getById(record.id)
    const data = JSON.parse(JSON.stringify(record))
    const target = {}
    for (const key in initForm()) {
      target[key] = data[key]
    }
    console.log(target)
    state.formState = target
  }

  const close = () => {
    formRef.value?.clearValidate()
    state.open = false
  }

  const submit = async () => {
    await formRef.value.validate()
    state.loading = true

    const apiMethod = state.editingId ?
      api.updateById :
      api.save

    const res = await apiMethod({
      ...state.formState,
      id: state.editingId,
    })

    if (res.success) {
      message.success(state.editingId ? '更新成功' : '创建成功')
      close()
    }

    state.loading = false
    return res.success
  }

  return {
    formRef,
    state,
    openCreate,
    openEdit,
    close,
    submit,
  }
}