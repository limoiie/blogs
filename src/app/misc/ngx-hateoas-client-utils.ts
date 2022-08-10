import {RequestOption, Resource} from '@lagoshny/ngx-hateoas-client'

/**
 * Try to get projectionName from resource type and set it to options. If resourceType has not projectionName then return options as is.
 *
 * @param resourceType from get projectionName
 * @param options to set projectionName
 */
export function fillProjectionNameFromResourceType<T extends Resource>(resourceType: new () => T, options?: RequestOption) {
  if (!resourceType) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const projectionName = resourceType['__projectionName__']
  if (projectionName) {
    options = options ? options : {params: {}}
    options = {
      ...options,
      params: {
        ...options.params,
        projection: projectionName
      }
    }
  }
  return options
}
