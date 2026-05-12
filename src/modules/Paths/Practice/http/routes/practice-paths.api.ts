import { Route } from '@lumiarq/framework'
import { CreatePracticePathHandler }  from '@/modules/Paths/Practice/http/handlers/create-practice-path.handler'
import { ListPracticePathsHandler }   from '@/modules/Paths/Practice/http/handlers/list-practice-paths.handler'
import { GetPracticePathHandler }     from '@/modules/Paths/Practice/http/handlers/get-practice-path.handler'
import { UpdatePracticePathHandler }  from '@/modules/Paths/Practice/http/handlers/update-practice-path.handler'
import { AbandonPracticePathHandler } from '@/modules/Paths/Practice/http/handlers/abandon-practice-path.handler'

// All routes under this module inherit requireAuth from module.ts middleware

Route.get('/api/practice-paths',          ListPracticePathsHandler)
Route.post('/api/practice-paths',         CreatePracticePathHandler)
Route.get('/api/practice-paths/:id',      GetPracticePathHandler)
Route.patch('/api/practice-paths/:id',    UpdatePracticePathHandler)
Route.post('/api/practice-paths/:id/abandon', AbandonPracticePathHandler)
