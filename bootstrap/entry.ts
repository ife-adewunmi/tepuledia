import { boot } from '@lumiarq/framework'
import { handleIgnitionError } from '@trazze/ignite'

import './env'
import './providers'

import '@/storage/framework/cache/routes.loader'

export default boot({
  onError: handleIgnitionError,
})
