export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export class ApiError extends Error {
  constructor(code: number, message: string) {
    super(message)
  }
}

export function toError(response: ApiResponse): ApiError | null {
  if (response.code == 0) return null
  return new ApiError(response.code, response.message)
}

export function extractData<T>(response: ApiResponse<T>): T {
  if (response.code != 0) {
    throw toError(response)
  }
  return response.data
}
