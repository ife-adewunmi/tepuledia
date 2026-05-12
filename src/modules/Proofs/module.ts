import { defineModule } from '@lumiarq/framework'

export const ProofsModule = defineModule({
  name:       'Proofs',
  alias:      'proofs',
  priority:   30,
  middleware: { api: ['tepuledia.auth'] },
})
