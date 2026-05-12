import { BaseRepository }      from '@lumiarq/framework'
import { eq }                  from 'drizzle-orm'
import type {
  IIdentityRepository,
  Identity,
  CreateIdentityData,
} from '@lumiarq/framework/auth'
import { identities, type IdentityRow } from '../schemas/identity.schema'

function toModel(row: IdentityRow): Identity {
  return {
    id:           row.id,
    email:        row.email,
    passwordHash: row.passwordHash,
    createdAt:    row.createdAt,
    updatedAt:    row.updatedAt,
  }
}

export class IdentityRepository
  extends BaseRepository<Identity, CreateIdentityData>
  implements IIdentityRepository
{
  async findByEmail(email: string): Promise<Identity | null> {
    const [row] = await this.db
      .select()
      .from(identities)
      .where(eq(identities.email, email))
      .limit(1)
    return row ? toModel(row) : null
  }

  async findById(id: string): Promise<Identity | null> {
    const [row] = await this.db
      .select()
      .from(identities)
      .where(eq(identities.id, id))
      .limit(1)
    return row ? toModel(row) : null
  }

  async create(data: CreateIdentityData): Promise<Identity> {
    const now = new Date()
    const [row] = await this.db
      .insert(identities)
      .values({
        id:           crypto.randomUUID(),
        email:        data.email,
        passwordHash: data.passwordHash,
        createdAt:    now,
        updatedAt:    now,
      })
      .returning()
    return toModel(row!)
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.db
      .update(identities)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(identities.id, id))
  }

  async findAll(opts?: { limit?: number; offset?: number }): Promise<Identity[]> {
    const rows = await this.db
      .select()
      .from(identities)
      .limit(opts?.limit ?? 50)
      .offset(opts?.offset ?? 0)
    return rows.map(toModel)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(identities).where(eq(identities.id, id))
  }

  async update(id: string, data: Partial<CreateIdentityData>): Promise<Identity> {
    const [row] = await this.db
      .update(identities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(identities.id, id))
      .returning()
    return toModel(row!)
  }
}
