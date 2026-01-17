import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/keywords', label: '키워드 분석', icon: '🔍' },
  { path: '/comments', label: '댓글 분석', icon: '💬' },
];

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm" role="banner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <NavLink
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="홈으로 이동"
          >
            <span className="text-xl sm:text-2xl font-bold text-slate-900">Zettel</span>
            <span className="hidden sm:inline text-sm text-slate-500">YouTube 분석</span>
          </NavLink>

          {/* 네비게이션 */}
          <nav role="navigation" aria-label="주요 탐색">
            <ul className="flex gap-1 sm:gap-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 min-h-[44px] ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                      }`
                    }
                    aria-label={item.label}
                  >
                    <span className="text-lg sm:hidden" aria-hidden="true">{item.icon}</span>
                    <span className="text-sm sm:text-base">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
