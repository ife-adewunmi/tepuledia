import { BaseRepository } from '@lumiarq/framework'
import { eq }             from 'drizzle-orm'
import type { UserProfile } from '@/modules/User/contracts/models/user.model'
import { userProfiles, type UserProfileRow } from '../schemas/user.schema'

function toModel(row: UserProfileRow): UserProfile {
  return {
    id:             row.id,
    identityId:     row.identityId,
    username:       row.username,
    displayName:    row.displayName,
    bio:            row.bio,
    avatarUrl:      row.avatarUrl,
    reputationScore: row.reputationScore,
    createdAt:      row.createdAt,
    updatedAt:      row.updatedAt,
  }
}

export class UserRepository extends BaseRepository<UserProfile, Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>> {
  async findByIdentityId(identityId: string): Promise<UserProfile | null> {
    const [row] = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.identityId, identityId))
      .limit(1)
    return row ? toModel(row) : null
  }

  async findByUsername(username: string): Promise<UserProfile | null> {
    const [row] = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.username, username))
      .limit(1)
    return row ? toModel(row) : null
  }

  async create(data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const now = new Date()
    const [row] = await this.db
      .insert(userProfiles)
      .values({ id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now })
      .returning()
    return toModel(row!)
  }

  async update(id: string, data: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'avatarUrl'>>): Promise<UserProfile> {
    const [row] = await this.db
      .update(userProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProfiles.id, id))
      .returning()
    return toModel(row!)
  }

  async incrementReputation(identityId: string, points: number): Promise<void> {
    const profile = await this.findByIdentityId(identityId)
    if (!profile) return
    await this.db
      .update(userProfiles)
      .set({ reputationScore: profile.reputationScore + points, updatedAt: new Date() })
      .where(eq(userProfiles.id, profile.id))
  }

  async findAll(opts?: { limit?: number; offset?: number }): Promise<UserProfile[]> {
    const rows = await this.db
      .select()
      .from(userProfiles)
      .limit(opts?.limit ?? 50)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(userProfiles).where(eq(userProfiles.id, id))
  }

  async findById(id: string): Promise<UserProfile | null> {
    const [row] = await this.db.select().from(userProfiles).where(eq(userProfiles.id, id)).limit(1)
    return row ? toModel(row) : null
  }
}
