const Pagination = ({ pagination, onPageChange, totalCompanies }) => (
  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <p className="text-sm text-gray-700">
        Showing{' '}
        <span className="font-medium">{pagination.current_page * 10 - 9}</span>{' '}
        to
        <span className="font-medium">
          {' '}
          {Math.min(pagination.current_page * 10, totalCompanies)}
        </span>{' '}
        of
        <span className="font-medium"> {totalCompanies} </span> results
      </p>
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        {pagination.links.map((link, index) => (
          <button
            key={index}
            onClick={() => link.url && onPageChange(link.url)}
            disabled={!link.url || link.active}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
              link.active
                ? 'z-10 bg-blue-50 border-(--primary-600) text-(--primary-600) cursor-default'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            } ${index === 0 ? 'rounded-l-md' : ''} ${index === pagination.links.length - 1 ? 'rounded-r-md' : ''}`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </nav>
    </div>
  </div>
);
export default Pagination;
