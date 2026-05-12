import { Route }             from '@lumiarq/framework'
import { SubmitProofHandler } from '@/modules/Proofs/http/handlers/submit-proof.handler'
import { ListProofsHandler }  from '@/modules/Proofs/http/handlers/list-proofs.handler'

Route.post('/api/proofs',                                     SubmitProofHandler)
Route.get('/api/practice-paths/:practicePathId/proofs',       ListProofsHandler)
