import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

const SearchFilter = ({ onSearch, onFilter, categories }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleFilter = () => {
    onFilter({
      category: selectedCategory,
      priceRange: priceRange
    })
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange('')
    onFilter({ category: '', priceRange: '' })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </form>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-200"
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="input-field"
              >
                <option value="">All Prices</option>
                <option value="0-25">Under $25</option>
                <option value="25-50">$25 to $50</option>
                <option value="50-100">$50 to $100</option>
                <option value="100-500">$100 to $500</option>
                <option value="500-1000">$500 to $1000</option>
                <option value="1000+">Over $1000</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleFilter}
            className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchFilter