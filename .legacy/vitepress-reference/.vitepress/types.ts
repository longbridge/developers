export interface ParameterRow {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'string[]'
  required: string
  description?: string
}

export interface ParametersTable {
  title: string
  parameters: ParameterRow[]
}

export interface HttpInfo {
  method: string
  url: string
  description?: string
}

export interface OpenApiInfo extends HttpInfo {
  parameters: ParameterRow[]
}
