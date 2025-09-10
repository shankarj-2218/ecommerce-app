import { useState, useEffect } from 'react'
import { productsAPI } from '../lib/api'
import ProductCard from '../components/product/ProductCard'
import SearchFilter from '../components/product/SearchFilter'
import Pagination from '../components/product/Pagination'
import { Loader2 } from 'lucide-react'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState([])

  const pageSize = 12

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [currentPage, searchTerm, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        pageNumber: currentPage,
        keyword: searchTerm,
        ...filters
      }
      
      const response = await productsAPI.getAll(params)
      setProducts(response.data.products)
      setTotalPages(response.data.pages)
    } catch (err) {
      setError('Failed to fetch products. Please try again later.')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Extract unique categories from products
      const allProducts = await productsAPI.getAll({ pageSize: 1000 })
      const uniqueCategories = [...new Set(allProducts.data.products.map(p => p.category))]
      setCategories(uniqueCategories.sort())
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <SearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        categories={categories}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}

export default Products