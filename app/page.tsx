"use client";

import React from 'react';
import { useTheme } from 'next-themes';

const tools = [
  { id: 'video-converter', name: '동영상 변환', description: 'MP4, WebM 등 다양한 포맷 지원', emoji: '🎬', category: 'media', tags: ['MP4', 'WebM'], color: 'bg-red-500/10 text-red-500' },
  { id: 'image-compress', name: '이미지 압축', description: 'PNG, JPG 용량 줄이기', emoji: '🖼️', category: 'media', tags: ['PNG', 'JPG'], color: 'bg-green-500/10 text-green-500' },
  { id: 'image-resize', name: '이미지 리사이즈', description: '원하는 크기로 조절', emoji: '📐', category: 'media', tags: ['크기 조절'], color: 'bg-blue-500/10 text-blue-500' },
  { id: 'gif-converter', name: 'GIF 변환', description: '동영상을 GIF로 만들기', emoji: '🎞️', category: 'media', tags: ['GIF', '동영상'], color: 'bg-purple-500/10 text-purple-500' },
  { id: 'pdf-converter', name: 'PDF 변환', description: '문서를 PDF로 변환', emoji: '📄', category: 'document', tags: ['PDF', '문서'], color: 'bg-orange-500/10 text-orange-500' },
  { id: 'qr-generator', name: 'QR 코드 생성', description: '링크를 QR 코드로', emoji: '📱', category: 'dev', tags: ['QR', '바코드'], color: 'bg-cyan-500/10 text-cyan-500' },
  { id: 'json-formatter', name: 'JSON 포매터', description: '복잡한 JSON을 보기 좋게', emoji: '🔧', category: 'dev', tags: ['JSON', '정렬'], color: 'bg-yellow-500/10 text-yellow-500' },
  { id: 'base64-encoder', name: 'Base64 인코더', description: '텍스트를 Base64로 변환', emoji: '🔐', category: 'dev', tags: ['인코딩'], color: 'bg-pink-500/10 text-pink-500' },
  { id: 'color-converter', name: '색상 변환기', description: 'HEX, RGB 변환', emoji: '🎨', category: 'utility', tags: ['HEX', 'RGB'], color: 'bg-indigo-500/10 text-indigo-500' },
  { id: 'unit-converter', name: '단위 변환기', description: '길이, 무게 등 단위 변환', emoji: '📏', category: 'utility', tags: ['길이', '무게'], color: 'bg-teal-500/10 text-teal-500' },
];

const categories: Record<string, string> = {
  media: '미디어',
  document: '문서',
  dev: '개발자 도구',
  utility: '유틸리티',
};

function ToolItem({ tool }: { tool: typeof tools[0] }) {
  return (
    <a
      href={`/tools/${tool.id}`}
      className="flex items-center gap-4 py-4 px-2 -mx-2 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 rounded-[24px] transition-all duration-200 group"
    >
      <div className={`w-12 h-12 ${tool.color} rounded-[20px] flex items-center justify-center text-2xl shrink-0`}>
        {tool.emoji}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-[#191f28] dark:text-white font-bold text-[17px] leading-snug">{tool.name}</span>
        <span className="text-[#8b95a1] dark:text-[#b0b8c1] text-[14px] font-medium leading-snug mt-0.5">{tool.description}</span>
      </div>
      <div className="text-[#b0b8c1] dark:text-[#6b7684]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </div>
    </a>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-[#191f28] dark:text-white font-bold text-[22px]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 flex items-center justify-center text-[#b0b8c1] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
        <span className="sr-only">Toggle theme</span>
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 flex items-center justify-center text-[#333d4b] dark:text-[#b0b8c1] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      )}
    </button>
  );
}

import { getChoseong, disassemble } from 'es-hangul';

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    getChoseong(tool.name).includes(searchQuery) ||
    getChoseong(tool.description).includes(searchQuery) ||
    disassemble(tool.name).includes(disassemble(searchQuery)) ||
    disassemble(tool.description).includes(disassemble(searchQuery))
  );

  const recentTools = tools.slice(0, 3);
  const recommendedTools = tools.slice(3, 7);
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <div className="min-h-screen bg-[#f2f4f6] dark:bg-[#101012] transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-[#f2f4f6]/80 dark:bg-[#101012]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between h-[60px]">
          {isSearchOpen ? (
            <div className="flex-1 flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="도구 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#20202c] text-[#191f28] dark:text-white px-4 py-2 rounded-xl border-none outline-none ring-2 ring-transparent focus:ring-[#3182f6] transition-all"
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-[#333d4b] dark:text-[#b0b8c1] font-medium text-sm whitespace-nowrap px-2"
              >
                취소
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 flex items-center animate-in fade-in slide-in-from-left-4 duration-200">
                <span className="text-lg font-bold text-[#191f28] dark:text-white tracking-tight">SUNGHYUN.TOOLS</span>
              </div>
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 flex items-center justify-center text-[#333d4b] dark:text-[#b0b8c1] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </button>
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {isSearchOpen && searchQuery ? (
          <Section title="검색 결과">
            <div className="flex flex-col gap-1">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <ToolItem key={tool.id} tool={tool} />
                ))
              ) : (
                <div className="py-8 text-center text-[#8b95a1] dark:text-[#6b7684]">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </Section>
        ) : (
          <>
            {/* Recent and Recommended sections are commented out */}
            {/* <Section title="최근"> ... </Section> */}
            {/* <Section title="추천"> ... </Section> */}

            <Section
              title="모든 서비스"
              action={<span className="text-[14px] font-medium text-[#3182f6]">가나다순</span>}
            >
              {Object.entries(groupedTools).map(([category, categoryTools]) => (
                <div key={category} className="mb-8 last:mb-0">
                  <div className="flex flex-col gap-1">
                    {categoryTools.map((tool, idx) => (
                      <ToolItem key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          </>
        )}
      </main>
    </div>
  );
}
