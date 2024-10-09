// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TasksService } from './tasks.class'

// Main data model schema
export const tasksSchema = {
  $id: 'Tasks',
  type: 'object',
  additionalProperties: false,
  required: ['_id', '_userId', '_projectId'],
  properties: {
    _id: ObjectIdSchema(),
    _userId: ObjectIdSchema(),
    _projectId: ObjectIdSchema(),
    msg: { type: 'string' }
  }
} as const
export type Tasks = FromSchema<typeof tasksSchema>
export const tasksValidator = getValidator(tasksSchema, dataValidator)
export const tasksResolver = resolve<Tasks, HookContext<TasksService>>({})

export const tasksExternalResolver = resolve<Tasks, HookContext<TasksService>>({})

// Schema for creating new data
export const tasksDataSchema = {
  $id: 'TasksData',
  type: 'object',
  additionalProperties: false,
  required: ['_projectId', 'title', 'description', 'dueDate', 'status'],
  properties: {
    ...tasksSchema.properties,
    title: { type: 'string' },
    description: { type: 'string' },
    dueDate: { type: 'string', format: 'date-time' },
    status: { type: 'number' }
  }
} as const
export type TasksData = FromSchema<typeof tasksDataSchema>
export const tasksDataValidator = getValidator(tasksDataSchema, dataValidator)
export const tasksDataResolver = resolve<TasksData, HookContext<TasksService>>({})

// Schema for updating existing data
export const tasksPatchSchema = {
  $id: 'TasksPatch',
  type: 'object',
  additionalProperties: false,
  required: ['_projectId', 'title', 'description', 'dueDate', 'status'],
  properties: {
    ...tasksSchema.properties,
    ...tasksDataSchema.properties
  }
} as const
export type TasksPatch = FromSchema<typeof tasksPatchSchema>
export const tasksPatchValidator = getValidator(tasksPatchSchema, dataValidator)
export const tasksPatchResolver = resolve<TasksPatch, HookContext<TasksService>>({})

// Schema for allowed query properties
export const tasksQuerySchema = {
  $id: 'TasksQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(tasksSchema.properties)
  }
} as const
export type TasksQuery = FromSchema<typeof tasksQuerySchema>
export const tasksQueryValidator = getValidator(tasksQuerySchema, queryValidator)
export const tasksQueryResolver = resolve<TasksQuery, HookContext<TasksService>>({})
