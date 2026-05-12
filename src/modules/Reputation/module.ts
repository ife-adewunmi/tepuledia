import { defineModule } from '@lumiarq/framework'

export const ReputationModule = defineModule({
  name: 'Reputation',
  alias: 'reputation',
  priority: 40,
  middleware: { api: ['tepuledia.auth'] },
})
