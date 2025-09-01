import type { FieldHook, Where } from 'payload'
import { ValidationError } from 'payload'
export const ensureUniqueUsername: FieldHook = async ({ data, originalDoc, req, value }) => {
  // if value is unchanged, skip validation
  if (originalDoc.username === value) {
    return value
  }

  const constraints: Where[] = [
    {
      username: {
        equals: value,
      },
    },
  ]


  const findDuplicateUsers = await req.payload.find({
    collection: 'users',
    where: {
      and: constraints,
    },
  })

  if (findDuplicateUsers.docs.length > 0 && req.user) {

    // if the user is an admin or has access to more than 1 tenant
    // provide a more specific error message
    if (req.user.roles?.includes('super-admin')) {
      throw new ValidationError({
        errors: [
          {
            message: `A user with the username ${value} already exists. Usernames must be unique per tenant.`,
            path: 'username',
          },
        ],
      })
    }
      throw new ValidationError({
        errors: [
          {
            message: `The tenant already has a user with the username "${value}". Usernames must be unique per tenant.`,
            path: 'username',
          },
        ],
      })
  }

  return value
}