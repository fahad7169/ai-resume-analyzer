import { Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-8">
      <Link to="/" className="text-[#4F75FF] hover:text-[#667EFF] transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-[color:var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {item.href && !item.current ? (
            <Link to={item.href} className="text-[#4F75FF] hover:text-[#667EFF] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? "text-[color:var(--color-text-primary)] font-medium" : "text-[color:var(--color-text-secondary)]"}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb; 