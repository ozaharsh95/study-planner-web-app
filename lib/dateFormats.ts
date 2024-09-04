export function formatDateFxn(str:Date|string){
  const date = (str instanceof Date) ? str : new Date(str);
  return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
}