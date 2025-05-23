import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-1 text-gray-600">
        <li>
          <Link to="/dashboard" className="hover:underline text-sm font-medium text-blue-600">
            Home
          </Link>
        </li>

        {pathnames.map((segment, idx) => {
          const href = `/${pathnames.slice(0, idx + 1).join("/")}`;
          const isLast = idx === pathnames.length - 1;

          return (
            <li key={idx} className="flex items-center">
              <ChevronRight size={14} className="mx-1" />
              {isLast ? (
                <span className="text-sm font-medium text-gray-500 capitalize">
                  {decodeURIComponent(segment)}
                </span>
              ) : (
                <Link
                  to={href}
                  className="hover:underline text-sm font-medium text-blue-600 capitalize"
                >
                  {decodeURIComponent(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
