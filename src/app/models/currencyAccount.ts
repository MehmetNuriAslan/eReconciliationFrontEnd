export interface CurrencyAccount {
  Id: number,
  companyId: number
  code: string
  name: string
  address: string
  taxDepartment: string
  taxIdNumber: string
  identityNumber: string
  email: string
  authorized: string
  addedAt: Date
  isActive: boolean
}
