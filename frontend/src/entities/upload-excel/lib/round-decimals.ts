/** Деньги и итоги после суммирования — без «хвоста» float. */
export function roundMoney(value: number): number {
  return Number.parseFloat(value.toFixed(2));
}
