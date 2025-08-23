export default class PriceAlert {
  constructor(alertData) {
    this.userId = alertData.userId
    this.productId = alertData.productId
    this.targetPrice = alertData.targetPrice
    this.currentPrice = alertData.currentPrice
    this.isActive = alertData.isActive !== false
    this.notificationSent = alertData.notificationSent || false
    this.createdAt = alertData.createdAt || new Date()
    this.updatedAt = alertData.updatedAt || new Date()
  }

  static validate(alertData) {
    const errors = []

    if (!alertData.userId) {
      errors.push("User ID is required")
    }

    if (!alertData.productId) {
      errors.push("Product ID is required")
    }

    if (!alertData.targetPrice || alertData.targetPrice <= 0) {
      errors.push("Valid target price is required")
    }

    return errors
  }
}
