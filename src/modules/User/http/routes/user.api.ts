import { Route } from '@lumiarq/framework'
import { GetPublicProfileHandler } from '@/modules/User/http/handlers/get-public-profile.handler'

// Public profile lookup by username
Route.get('/api/users/:username', GetPublicProfileHandler)
