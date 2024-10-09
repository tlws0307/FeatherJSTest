// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import { MongoDBAdapterParams, MongoDBAdapterOptions, MongoDBService } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'

type Myservices = any
type MyservicesData = any
type MyservicesPatch = any
type MyservicesQuery = any

export type { Myservices, MyservicesData, MyservicesPatch, MyservicesQuery }

export interface MyservicesServiceOptions {
  app: Application
}

export interface MyservicesParams extends Params<MyservicesQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class MyservicesService<ServiceParams extends MyservicesParams = MyservicesParams>
  implements ServiceInterface<Myservices, MyservicesData, ServiceParams, MyservicesPatch>
{
  constructor(public options: MongoDBService) {}

  async find(_params?: ServiceParams): Promise<Myservices[]> {
    this.options.find()
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Myservices> {
    return {
      id: 0,
      text: `A new message with ID: ${_params?.user?._id}`
    }
  }

  async create(data: MyservicesData, params?: ServiceParams): Promise<Myservices>
  async create(data: MyservicesData[], params?: ServiceParams): Promise<Myservices[]>
  async create(
    data: MyservicesData | MyservicesData[],
    params?: ServiceParams
  ): Promise<Myservices | Myservices[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: MyservicesData, _params?: ServiceParams): Promise<Myservices> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: MyservicesPatch, _params?: ServiceParams): Promise<Myservices> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Myservices> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getService = (app: Application) : MongoDBService => {
  return new MongoDBService({
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('projects'))
  } as MongoDBAdapterOptions);
}
