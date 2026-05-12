import { eventBus }               from '@lumiarq/framework'
import { ProofSubmitted }         from '@/modules/Proofs/events/definitions/proof-submitted.event'
import { AwardReputationAction }  from '@/modules/Reputation/logic/actions/award-reputation.action'

eventBus.listen(ProofSubmitted, async (payload) => {
  if (payload.isPublic) {
    await AwardReputationAction({
      userId: payload.userId,
      reason: 'PUBLIC_PROOF_SUBMITTED',
    })
  }
})
