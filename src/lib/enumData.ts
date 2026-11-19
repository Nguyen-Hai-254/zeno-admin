/**
 * Các mã enum dùng ở giao diện quản trị và POS.
 *
 * `zeno-api` là nguồn chuẩn cho giá trị nghiệp vụ. Khi hợp đồng API thay đổi,
 * cần đồng bộ các mã ở file này và `zeno-client/src/lib/enumData.ts`.
 */

export const SALES_CHANNEL = {
  ONLINE: 'ONLINE',
  POS: 'POS'
} as const

export type SalesChannel = (typeof SALES_CHANNEL)[keyof typeof SALES_CHANNEL]

export const PAYMENT_METHOD = {
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  ONLINE_GATEWAY: 'ONLINE_GATEWAY'
} as const

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export const FULFILLMENT_METHOD = {
  HOME_DELIVERY: 'HOME_DELIVERY',
  STORE_PICKUP: 'STORE_PICKUP'
} as const

export type FulfillmentMethod =
  (typeof FULFILLMENT_METHOD)[keyof typeof FULFILLMENT_METHOD]

export const INVENTORY_TRACKING_MODE = {
  QUANTITY: 'QUANTITY',
  SERIAL_IMEI: 'SERIAL_IMEI'
} as const

export type InventoryTrackingMode =
  (typeof INVENTORY_TRACKING_MODE)[keyof typeof INVENTORY_TRACKING_MODE]

/** Nhãn tiếng Việt để hiển thị; mã enum ở trên được giữ ổn định cho API. */
export const SALES_CHANNEL_LABEL = {
  [SALES_CHANNEL.ONLINE]: 'Bán trực tuyến',
  [SALES_CHANNEL.POS]: 'Bán tại cửa hàng (POS)'
} as const satisfies Record<SalesChannel, string>

export const PAYMENT_METHOD_LABEL = {
  [PAYMENT_METHOD.CASH_ON_DELIVERY]: 'Thanh toán khi nhận hàng (COD)',
  [PAYMENT_METHOD.CASH]: 'Tiền mặt tại cửa hàng',
  [PAYMENT_METHOD.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
  [PAYMENT_METHOD.ONLINE_GATEWAY]: 'Thanh toán qua cổng trực tuyến'
} as const satisfies Record<PaymentMethod, string>

export const FULFILLMENT_METHOD_LABEL = {
  [FULFILLMENT_METHOD.HOME_DELIVERY]: 'Giao hàng tại nhà',
  [FULFILLMENT_METHOD.STORE_PICKUP]: 'Nhận tại cửa hàng'
} as const satisfies Record<FulfillmentMethod, string>

export const INVENTORY_TRACKING_MODE_LABEL = {
  [INVENTORY_TRACKING_MODE.QUANTITY]: 'Theo số lượng',
  [INVENTORY_TRACKING_MODE.SERIAL_IMEI]: 'Theo serial/IMEI từng thiết bị'
} as const satisfies Record<InventoryTrackingMode, string>
