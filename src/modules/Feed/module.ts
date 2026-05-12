import { defineModule } from '@lumiarq/framework'

export const FeedModule = defineModule({
  name: 'Feed',
  alias: 'feed',
  priority: 35,
  middleware: { api: ['tepuledia.auth'] },
})
