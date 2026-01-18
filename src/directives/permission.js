import {
  checkPermission
} from '@/utils/permission'

function applyPermission(el, binding) {

  const required = binding.value

  if (checkPermission(required)) return

  el.parentNode?.removeChild(el)
}

export default function setupPermissionDirective(app) {
  app.directive('permission', {
    mounted: applyPermission,
    // updated: applyPermission,
  })
}