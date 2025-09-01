import type { Collection, Endpoint, Where } from 'payload'
import { headersWithCors } from '@payloadcms/next/utilities' // Assuming @payloadcms/next is installed
import { APIError, generatePayloadCookie } from 'payload'

// A custom endpoint that can be reached by POST request
// at: /api/users/external-users/login
export const externalUsersLogin: Endpoint = {
  handler: async (req) => {
    let data: { [key: string]: string } = {}

    try {
      // Check if req.json is a function before calling it
      if (typeof req.json === 'function') {
        data = await req.json()
      } else {
        // Handle cases where body might be parsed differently or empty
        console.warn('Request body could not be parsed as JSON for externalUsersLogin.');
      }
    } catch (error) {
      req.payload.logger.error(`Error parsing JSON body for externalUsersLogin: ${error}`);
      // Optionally throw an error or return a specific response
      throw new APIError('Invalid request body.', 400, null, true)
    }
    const { password, tenantSlug, tenantDomain, username } = data

    if (!username || !password) {
      throw new APIError('Username and Password are required for login.', 400, null, true)
    }


    // Find user matching username/email within that tenant
    const foundUser = await req.payload.find({
      collection: 'users',
      where: {
        or: [
          {
            and: [
              { email: { equals: username } },
            ],
          },
          {
            and: [
              { username: { equals: username } }, // Check username field too
            ],
          },
        ],
      },
      limit: 1,
      depth: 0, // Don't need user relations for login check
    })

    if (foundUser.totalDocs > 0) {
      try {
        const loginAttempt = await req.payload.login({
          collection: 'users',
          data: {
            // Use the found user's email for login
            email: foundUser.docs[0].email,
            password,
          },
          req,
        })

        if (loginAttempt?.token) {
          const collection: Collection = (req.payload.collections as { [key: string]: Collection })['users']
          const cookie = generatePayloadCookie({
            collectionAuthConfig: collection.config.auth,
            // Use correct cookie prefix if defined
            cookiePrefix: req.payload.config.cookiePrefix || 'payload',
            token: loginAttempt.token,
          })

          return Response.json(loginAttempt, {
            headers: headersWithCors({
              headers: new Headers({
                'Set-Cookie': cookie,
              }),
              req,
            }),
            status: 200,
          })
        }
        // If login didn't return a token for some reason
        throw new APIError('Login failed after user verification.', 500, null, true)

      } catch (e: any) {
         req.payload.logger.error(`Login attempt failed for user ${username}: ${e.message || e}`);
        throw new APIError('Unable to login with the provided username and password.', 401, null, true)
      }
    }

    // User not found within the specified tenant
    throw new APIError('Unable to login with the provided username and password.', 401, null, true)
  },
  method: 'post',
  path: '/external-users/login',
} 