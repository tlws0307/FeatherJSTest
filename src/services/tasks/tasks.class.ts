// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Tasks, TasksData, TasksPatch, TasksQuery } from './tasks.schema'
export type { Tasks, TasksData, TasksPatch, TasksQuery }

export interface TasksParams extends Params<TasksQuery> {}
// This is a skeleton for a custom service class. Remove or add the methods you need here
export class TasksService<ServiceParams extends TasksParams = TasksParams>
  implements ServiceInterface<Tasks, TasksData, ServiceParams, TasksPatch>
{
  constructor(
    public taskService: MongoDBService,
    public projectService: MongoDBService
  ) {}

  async find(_params?: ServiceParams): Promise<any> {
    const ObjectId = require('mongodb').ObjectId

    const query = {
      _userId: _params?.user?._id,
      _projectId: new ObjectId(_params?.query?.projectId),
      $skip: _params?.query?.$skip,
      $limit: _params?.query?.$limit,
      ...(_params?.query?.status ? { status: Number(_params?.query?.status) } : {}),
      ...(_params?.query?.filterOverdue && _params?.query?.filterOverdue === 'true'
        ? { dueDate: { $lt: new Date() } }
        : {})
    }
    console.log(_params?.query?.filterOverdue)
    // console.log(query)
    const result = await this.taskService.find({ query })

    return result
  }

  async get(id: Id, _params?: ServiceParams): Promise<Tasks> {
    const result = await this.taskService.find({
      query: { _id: id, _userId: _params?.user?._id },
      pipeline: [
        {
          $lookup: {
            from: 'users',
            localField: '_userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' }
      ],
      paginate: false
    })

    return result[0] ?? { msg: 'task not found' }
  }

  async create(data: TasksData, _params?: ServiceParams): Promise<Tasks> {
    try {
      const foundProjects = await this.projectService.find({
        query: { _userId: _params?.user?._id, _id: data._projectId }
      })
      if (foundProjects.data.length == 0)
        return { _id: '', _userId: '', _projectId: '', msg: 'project not found' }

      const dta = {
        _userId: _params?.user?._id,
        _projectId: data._projectId,
        title: data.title,
        status: data.status,
        dueDate: new Date(data.dueDate),
        createdDate: new Date(),
        description: data.description
      }
      const result = await this.taskService.create(dta)
      return { _id: result._id, _userId: result._userId, _projectId: result._projectId }
    } catch {
      return { _id: '', _userId: '', _projectId: '', msg: 'error' }
    }
  }

  // // This method has to be added to the 'methods' option to make it available to clients
  // async update(id: NullableId, data: TasksData, _params?: ServiceParams): Promise<Tasks> {
  //   return {
  //     id: 0,
  //     ...data
  //   }
  // }

  async patch(id: NullableId, data: TasksPatch, _params?: ServiceParams): Promise<Tasks> {
    const query = {
      _userId: _params?.user?._id,
      _projectId: data._projectId,
      _id: id
    }
    const dta = {
      title: data.title,
      status: data.status,
      dueDate: new Date(data.dueDate),
      description: data.description
    }

    const result = await this.taskService.patch(null, dta, { query })
    return result.length == 0 ? { msg: 'task not found' } : result[0]
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Tasks> {
    const query = {
      _userId: _params?.user?._id,
      _id: id
    }

    const result = await this.taskService.remove(null, { query })
    return result.length == 0 ? { msg: 'task not found' } : result[0]
  }
}

export const getTasksService = (app: Application): MongoDBService => {
  return new MongoDBService({
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('tasks')),
    multi: ['patch', 'remove']
  } as MongoDBAdapterOptions)
}

export const getProjectsService = (app: Application): MongoDBService => {
  return new MongoDBService({
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('projects')),
    multi: ['patch', 'remove']
  } as MongoDBAdapterOptions)
}
