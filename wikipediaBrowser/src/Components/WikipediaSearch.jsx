import React, { useState } from 'react';
import { Search } from 'lucide-react';

const WikipediaSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      // Step 1: Get search results - increased limit to 10
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTerm)}&limit=10&namespace=0&format=json&origin=*`;
      const searchResponse = await fetch(searchUrl);
      const [term, titles, descriptions, links] = await searchResponse.json();

      // Step 2: Get images for each article
      const titlesString = titles.join('|');
      const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titlesString)}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
      const imageResponse = await fetch(imageUrl);
      const imageData = await imageResponse.json();
      
      const pages = imageData.query?.pages || {};
      
      // Combine all data
      const results = titles.map((title, index) => {
        const page = Object.values(pages).find(p => p.title === title);
        return {
          id: index,
          title: title,
          description: descriptions[index],
          link: links[index],
          image: page?.thumbnail?.source || '/api/placeholder/400/300'
        };
      });

      setArticles(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      setArticles([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Search Section */}
        <div className="flex flex-col items-center justify-center mb-12 pt-20">
          <h1 className="text-4xl font-bold text-purple-800 mb-8">Wikipedia Search</h1>
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Wikipedia..."
                className="w-full px-6 py-3 rounded-l-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500 text-lg"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-r-lg flex items-center transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-purple-900 mb-2 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 line-clamp-3">
                  {article.description}
                </p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-medium"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {articles.length === 0 && searchTerm && !isLoading && (
          <div className="text-center text-gray-600 mt-8 mb-12">
            No results found. Try a different search term.
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-purple-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Wiki Search</h3>
              <p className="text-purple-200">
                A simple and elegant way to search and explore Wikipedia articles. 
                Built with React and powered by the Wikipedia API.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.wikipedia.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-200 hover:text-white transition-colors"
                  >
                    Wikipedia Home
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.wikipedia.org/wiki/Wikipedia:About" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-200 hover:text-white transition-colors"
                  >
                    About Wikipedia
                  </a>
                </li>
                <li>
                  <a 
                    href="https://donate.wikimedia.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-200 hover:text-white transition-colors"
                  >
                    Donate to Wikipedia
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Disclaimer</h3>
              <p className="text-purple-200">
                This website is not affiliated with Wikipedia or the Wikimedia Foundation. 
                All content is sourced from the Wikipedia API for educational purposes.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-purple-700 text-center text-purple-200">
            <p>© {new Date().getFullYear()} Wiki Search. Made with ❤️ for learning.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WikipediaSearch;