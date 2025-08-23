export default class Product {
  constructor(productData) {
    this.name = productData.name
    this.description = productData.description
    this.brand = productData.brand
    this.category = productData.category
    this.subcategory = productData.subcategory
    this.price = {
      current: productData.price?.current || productData.price,
      original: productData.price?.original,
      currency: productData.price?.currency || "USD",
    }
    this.images = productData.images || []
    this.sizes = productData.sizes || []
    this.colors = productData.colors || []
    this.materials = productData.materials || []
    this.tags = productData.tags || []
    this.sku = productData.sku
    this.stock = {
      quantity: productData.stock?.quantity || 0,
      isInStock: productData.stock?.isInStock !== false,
    }
    this.ratings = {
      average: productData.ratings?.average || 0,
      count: productData.ratings?.count || 0,
    }
    this.specifications = productData.specifications || {}
    this.isActive = productData.isActive !== false
    this.createdAt = productData.createdAt || new Date()
    this.updatedAt = productData.updatedAt || new Date()
  }

  static validate(productData) {
    const errors = []

    if (!productData.name || productData.name.trim().length < 2) {
      errors.push("Product name is required")
    }

    if (!productData.category) {
      errors.push("Category is required")
    }

    if (!productData.price || productData.price <= 0) {
      errors.push("Valid price is required")
    }

    return errors
  }
}
