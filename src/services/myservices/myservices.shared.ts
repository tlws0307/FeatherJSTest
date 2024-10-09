// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Myservices,
  MyservicesData,
  MyservicesPatch,
  MyservicesQuery,
  MyservicesService
} from './myservices.class'

export type { Myservices, MyservicesData, MyservicesPatch, MyservicesQuery }

export type MyservicesClientService = Pick<
  MyservicesService<Params<MyservicesQuery>>,
  (typeof myservicesMethods)[number]
>

export const myservicesPath = 'myservices'

export const myservicesMethods: Array<keyof MyservicesService> = ['find', 'get', 'create', 'patch', 'remove']

export const myservicesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(myservicesPath, connection.service(myservicesPath), {
    methods: myservicesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [myservicesPath]: MyservicesClientService
  }
}
