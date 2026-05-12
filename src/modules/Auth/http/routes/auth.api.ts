import { Route } from '@lumiarq/framework'
import { LoginHandler }           from '@/modules/Auth/http/handlers/login.handler'
import { RegisterHandler }        from '@/modules/Auth/http/handlers/register.handler'
import { LogoutHandler }          from '@/modules/Auth/http/handlers/logout.handler'
import { ForgotPasswordHandler }  from '@/modules/Auth/http/handlers/forgot-password.handler'
import { ResetPasswordHandler }   from '@/modules/Auth/http/handlers/reset-password.handler'

// Public auth endpoints
Route.post('/auth/login',           LoginHandler)
Route.post('/auth/register',        RegisterHandler)
Route.post('/auth/forgot-password', ForgotPasswordHandler)
Route.post('/auth/reset-password',  ResetPasswordHandler)

// Authenticated endpoint
Route.post('/auth/logout', LogoutHandler, { middleware: ['lumiarq.auth'] })
