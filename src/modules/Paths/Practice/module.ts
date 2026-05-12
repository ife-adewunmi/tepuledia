import { defineModule } from '@lumiarq/framework'

export default defineModule({
  name:       'PracticePaths',
  alias:      'practice-paths',
  priority:   20,
  middleware: { api: ['tepuledia.auth'] },
})
