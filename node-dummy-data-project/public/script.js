document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('productList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortOption = document.getElementById('sortOption');

    let products = [];

    // Fetch products
    const fetchProducts = async (params = '') => {
        const response = await fetch(`/api/products${params}`);
        products = await response.json();
        displayProducts(products);
        updateCategoryOptions();
    };

    // Display products
    const displayProducts = (products) => {
        productList.innerHTML = products.map((product, index) => `
            <div class="product-card" style="animation-delay: ${index * 0.05}s">
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description.substring(0, 50)}...</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="rating">★ ${product.rating.toFixed(1)}</p>
            </div>
        `).join('');
    };

    // Update category filter options
    const updateCategoryOptions = () => {
        const categories = [...new Set(products.map(p => p.category))];
        categoryFilter.innerHTML = '<option value="">All Categories</option>' +
            categories.map(category => `<option value="${category}">${category}</option>`).join('');
    };

    // Event listeners
    searchInput.addEventListener('input', () => {
        const filtered = products.filter(p => 
            p.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            p.description.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        displayProducts(filtered);
    });

    categoryFilter.addEventListener('change', () => {
        fetchProducts(categoryFilter.value ? `?category=${categoryFilter.value}` : '');
    });

    sortOption.addEventListener('change', () => {
        fetchProducts(sortOption.value ? `?sort=${sortOption.value}` : '');
    });

    // Initial fetch
    fetchProducts();
});