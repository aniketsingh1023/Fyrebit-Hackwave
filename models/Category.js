export default class Category {
  constructor(categoryData) {
    this.name = categoryData.name
    this.slug = categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, "-")
    this.description = categoryData.description
    this.image = categoryData.image
    this.parentCategory = categoryData.parentCategory
    this.subcategories = categoryData.subcategories || []
    this.isActive = categoryData.isActive !== false
    this.sortOrder = categoryData.sortOrder || 0
    this.createdAt = categoryData.createdAt || new Date()
    this.updatedAt = categoryData.updatedAt || new Date()
  }

  static validate(categoryData) {
    const errors = []

    if (!categoryData.name || categoryData.name.trim().length < 2) {
      errors.push("Category name is required")
    }

    return errors
  }
}
