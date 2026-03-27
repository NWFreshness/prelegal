import catalogData from '../../catalog.json'

export interface CatalogEntry {
  name: string
  description: string
  filename: string
}

export const catalog: CatalogEntry[] = catalogData
