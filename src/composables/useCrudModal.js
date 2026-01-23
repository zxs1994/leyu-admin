import {
  reactive,
  ref,
  watch
} from 'vue'
import {
  message
} from 'ant-design-vue'

export default function useCrudModal({
  api,
  initForm,
  reload
}) {
  const formRef = ref()
  const state = reactive({
    updateId: undefined,
    loading: false,
    open: false,
    formState: {},
    record: {},
  })

  watch(
    () => state.open,
    (newVal) => {
      if (newVal === false) {
        formRef.value?.resetFields()
      }
    },
  )

  const openAdd = () => {
    state.updateId = undefined
    state.record = {}
    state.formState = initForm()
    state.open = true
  }

  const openUpdate = async (record) => {
    state.updateId = record.id
    state.open = true
    state.record = record
    // const res = await getById(record.id)
    // const data = JSON.parse(JSON.stringify(record))
    const target = {}
    for (const key in initForm()) {
      target[key] = record[key]
    }
    console.log(target)
    state.formState = JSON.parse(JSON.stringify(target))
  }

  const close = () => {
    state.open = false
  }

  const submit = async () => {
    await formRef.value.validate()
    state.loading = true

    const apiMethod = state.updateId ? api.update : api.add

    const res = await apiMethod({
      ...state.formState,
      id: state.updateId,
    })

    if (res.success) {
      message.success(state.updateId ? '更新成功' : '创建成功')
      close()
      reload()
    }

    state.loading = false
    return res.success
  }

  return {
    formRef,
    state,
    openAdd,
    openUpdate,
    close,
    submit,
  }
}