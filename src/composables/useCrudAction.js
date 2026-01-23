import {
  Modal,
  message
} from 'ant-design-vue'

export default function useCrudAction({
  api,
  title,
  reload
}) {
  const del = (record, options = {}) => {
    Modal.confirm({
      title: options.confirmTitle || '确认删除？',
      centered: true,
      content: options.confirmContent || `确定要删除 ${title}「${record.name || record.id}」吗？`,
      onOk: async () => {
        const res = await api.delete(record.id)
        if (res.success) {
          message.success(options.successText || '删除成功')
          reload()
        }
      },
    })
  }

  return {
    delete: del,
  }
}