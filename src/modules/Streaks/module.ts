import { defineModule } from '@lumiarq/framework'

export const StreaksModule = defineModule({
  name:       'Streaks',
  alias:      'streaks',
  priority:   25,
  middleware: { api: ['tepuledia.auth'] },
})
