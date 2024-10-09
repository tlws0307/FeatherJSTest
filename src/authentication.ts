// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import type { Application } from './declarations'
import type { User } from './services/users/users.schema'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('authentication', authentication)
}

// export class CustomAuthenticationService extends AuthenticationService {
//   constructor(app: Application) {
//     super(app)
//   }

//   async create(data: any, params: any) {
//     const result = await super.create(data, params)

//     // Customize the JWT payload
//     if (result.accessToken) {
//       const user: User = await this.app.service('users').get(result.user.id)
      
//       console.log(user);
//       // Add custom claims to the accessToken
//       const payload = {
//         userId: user._id
//       }

//       // Create a new token with the custom payload
//       result.accessToken =  this.app.get('authentication').jwt.sign(payload)
//     }

//     return result
//   }
// }
