// filename: src\pages\ProductListPage.tsx
import { useState } from 'react';
//import { ProductGrid } from '../components/ProductGrid';
import { Search, Filter } from 'lucide-react';
import { ProductList } from '@/components/ProductList'; // Import the component

// Remove sample data
// const SAMPLE_PRODUCTS = [...];

function ProductListPage() {
    // Keep search and filter state if you want to implement server-side filtering later
    // For now, ProductList handles infinite scrolling fetch without filtering.
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Categories would ideally come from backend
    const categories = ['all', 'electronics', 'accessories', 'gadgets'];

    // Remove local filtering logic, as ProductList fetches from API
    // const filteredProducts = SAMPLE_PRODUCTS.filter(...)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Keep search and filter UI if desired, but they won't affect the ProductList fetching currently */}
            {/* You would need to lift state up or modify ProductList to accept search/filter params and pass them to the API call */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Use the ProductList component */}
            <ProductList />
        </div>
    );
}

export default ProductListPage;