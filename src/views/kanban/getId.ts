export function getFirmId(user: any): string {
  const firmId = typeof user.firm === 'string' ? user.firm : user.firm!.id
  return firmId
}

export function getId(obj: string | { id: string }): string {
  const id = typeof obj === 'string' ? obj : obj.id
  return id
}
