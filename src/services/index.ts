import { tasks } from './tasks/tasks'
import { projects } from './projects/projects'
import { myservices } from './myservices/myservices'

import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(tasks)
  app.configure(projects)
  app.configure(myservices)
  app.configure(user)
  // All services will be registered here
}
