export default function Breadcrumb({ items, baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guptafurniture.com' }) {
  // Generate BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual Breadcrumb (optional - can be hidden with display: none) */}
      <nav aria-label="Breadcrumb" className="breadcrumb-nav" style={{ display: 'none' }}>
        <ol style={{ 
          display: 'flex', 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}>
          {items.map((item, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {index > 0 && <span style={{ color: 'var(--text-light)' }}>/</span>}
              {index === items.length - 1 ? (
                <span style={{ color: 'var(--text-medium)' }}>{item.name}</span>
              ) : (
                <a 
                  href={item.url} 
                  style={{ 
                    color: 'var(--text-light)', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  className="breadcrumb-link"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
