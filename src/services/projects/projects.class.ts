// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import { MongoDBAdapterParams, MongoDBAdapterOptions, MongoDBService } from '@feathersjs/mongodb'
import type { Application } from '../../declarations'
import type { Projects, ProjectsData, ProjectsPatch, ProjectsQuery } from './projects.schema'
export type { Projects, ProjectsData, ProjectsPatch, ProjectsQuery }

export interface ProjectsServiceOptions {
  app: Application
}

export interface ProjectsParams extends Params<ProjectsQuery> {}
// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ProjectsService<ServiceParams extends ProjectsParams = ProjectsParams>
  implements ServiceInterface<Projects, ProjectsData, ServiceParams, ProjectsPatch>
{
  constructor(public projectsService: MongoDBService, public tasksService: MongoDBService) {}

  async find(_params?: ServiceParams): Promise<any> {
    const query = {
      _userId: _params?.user?._id,
      $skip: _params?.query?.$skip,
      $limit: _params?.query?.$limit
    }

    const result = await this.projectsService.find({ query })

    return result
  }

  async get(id: Id, _params?: ServiceParams): Promise<Projects> {
    const result = await this.projectsService.find({
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

    return result[0] ?? { msg: 'project not found' }
  }

  async create(data: ProjectsData, _params?: ServiceParams): Promise<Projects> {
    try {
      const dta = {
        _userId: _params?.user?._id,
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        createdDate: new Date()
      }

      const result = await this.projectsService.create(dta)

      return { _id: result._id, _userId: result._userId }
    } catch {
      return { _id: '', _userId: '', msg: 'error' }
    }
  }

  // // This method has to be added to the 'methods' option to make it available to clients
  // async update(id: NullableId, data: ProjectsData, _params?: ServiceParams): Promise<Projects> {
  //   return {
  //     id: 0,
  //     ...data
  //   }
  // }

  async patch(id: NullableId, data: ProjectsPatch, _params?: ServiceParams): Promise<Projects[]> {
    const query = {
      _userId: _params?.user?._id,
      _id: id
    }

    const dta = {
      name: data.name,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    }

    const result = await this.projectsService.patch(null, dta, { query })
    return result.length == 0 ? { msg: 'project not found' } : result[0]
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<any> {
    const ObjectId = require('mongodb').ObjectId

    const foundTasks = await this.tasksService.find({
      query: { _userId: _params?.user?._id, _projectId: new ObjectId(id) }
    })
    console.log({ _userId: _params?.user?._id, _projectId: id });
    console.log(foundTasks);
    if (foundTasks.data.length > 0)
      return { msg: 'unable to remove project. tasks found' }
    
    const query = {
      _userId: _params?.user?._id,
      _id: id
    }

    const result = await this.projectsService.remove(null, { query })
    return result.length == 0 ? { msg: 'project not found' } : result[0]
  }
}

export const getProjectsService = (app: Application): MongoDBService => {
  return new MongoDBService({
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('projects')),
    multi: ['patch', 'remove']
  } as MongoDBAdapterOptions)
}

export const getTasksService = (app: Application): MongoDBService => {
  return new MongoDBService({
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('tasks')),
    multi: ['patch', 'remove']
  } as MongoDBAdapterOptions)
}
