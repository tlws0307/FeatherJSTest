// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import type { Application } from '../../declarations'
import { MyservicesService, getService } from './myservices.class'
import { myservicesPath, myservicesMethods } from './myservices.shared'

export * from './myservices.class'

// A configure function that registers the service and its hooks via `app.configure`
export const myservices = (app: Application) => {
  // Register our service on the Feathers application
  app.use(myservicesPath, new MyservicesService(getService(app)), {
    // A list of all methods this service exposes externally
    methods: myservicesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(myservicesPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [myservicesPath]: MyservicesService
  }
}
