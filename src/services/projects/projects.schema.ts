// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ProjectsService } from './projects.class'

// Main data model schema
export const projectsSchema = {
  $id: 'Projects',
  type: 'object',
  additionalProperties: false,
  required: ['_id', '_userId'],
  properties: {
    _id: ObjectIdSchema(),
    _userId: ObjectIdSchema(),
    msg: { type: 'string' }
  }
} as const
export type Projects = FromSchema<typeof projectsSchema>
export const projectsValidator = getValidator(projectsSchema, dataValidator)
export const projectsResolver = resolve<Projects, HookContext<ProjectsService>>({})

export const projectsExternalResolver = resolve<Projects, HookContext<ProjectsService>>({})

// Schema for creating new data
export const projectsDataSchema = {
  $id: 'ProjectsData',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'description', 'startDate', 'endDate'],
  properties: {
    ...projectsSchema.properties,
    name: { type: 'string' },
    description: { type: 'string' },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' }
  }
} as const
export type ProjectsData = FromSchema<typeof projectsDataSchema>
export const projectsDataValidator = getValidator(projectsDataSchema, dataValidator)
export const projectsDataResolver = resolve<ProjectsData, HookContext<ProjectsService>>({})

// Schema for updating existing data
export const projectsPatchSchema = {
  $id: 'ProjectsPatch',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'description', 'startDate', 'endDate'],
  properties: {
    ...projectsSchema.properties,
    ...projectsDataSchema.properties
  }
} as const
export type ProjectsPatch = FromSchema<typeof projectsPatchSchema>
export const projectsPatchValidator = getValidator(projectsPatchSchema, dataValidator)
export const projectsPatchResolver = resolve<ProjectsPatch, HookContext<ProjectsService>>({})

// Schema for allowed query properties
export const projectsQuerySchema = {
  $id: 'ProjectsQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(projectsSchema.properties)
  }
} as const
export type ProjectsQuery = FromSchema<typeof projectsQuerySchema>
export const projectsQueryValidator = getValidator(projectsQuerySchema, queryValidator)
export const projectsQueryResolver = resolve<ProjectsQuery, HookContext<ProjectsService>>({})
