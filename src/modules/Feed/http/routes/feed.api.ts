import { Route }          from '@lumiarq/framework'
import { GetFeedHandler } from '@/modules/Feed/http/handlers/get-feed.handler'

Route.get('/api/feed', GetFeedHandler)
