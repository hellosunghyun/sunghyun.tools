"use client";

import React from 'react';
import { useTheme } from 'next-themes';

const tools = [
  { id: 'twitter-high-quality-upload', name: '트위터 이미지 고화질로 업로드', description: 'PNG 투명 픽셀 주입으로 압축 우회', emoji: '🐦', icon: '/icons/twitter-high-quality-upload.png', category: 'media', tags: ['Twitter', 'PNG', '압축 우회'], color: 'bg-secondary text-foreground' },
  { id: 'twitter-image-to-video', name: '트위터용 동영상 변환기', description: '이미지를 2초 길이의 MP4로 변환', emoji: '🎬', icon: '/icons/twitter-image-to-video.png', category: 'media', tags: ['Twitter', 'Video', 'MP4'], color: 'bg-secondary text-foreground' },
  { id: 'image-audio-mixer', name: '이미지 오디오 합치기', description: '이미지와 오디오를 합쳐 나만의 동영상 제작', emoji: '🎵', icon: '/icons/image-audio-mixer.png', category: 'media', tags: ['Music', 'Video', 'Waveform'], color: 'bg-secondary text-foreground' },
];

const categories: Record<string, string> = {
  media: '미디어',
  document: '문서',
  dev: '개발자 도구',
  utility: '유틸리티',
};

function ToolItem({ tool }: { tool: typeof tools[0] & { icon?: string } }) {
  return (
    <a
      href={`/${tool.id}`}
      className="flex items-center gap-4 py-4 px-2 -mx-2 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 rounded-[24px] transition-all duration-200 group"
    >
      <div className={`w-12 h-12 ${tool.color} rounded-[20px] flex items-center justify-center text-2xl shrink-0 overflow-hidden`}>
        {tool.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tool.icon} alt={tool.name} className="w-[75%] h-[75%] object-cover" />
        ) : (
          tool.emoji
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-foreground font-bold text-[17px] leading-snug">{tool.name}</span>
        <span className="text-muted-foreground text-[14px] font-medium leading-snug mt-0.5">{tool.description}</span>
      </div>
      <div className="text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </div>
    </a>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-foreground font-bold text-[22px]">
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
      <button className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-accent rounded-full transition-colors">
        <span className="sr-only">Toggle theme</span>
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-accent rounded-full transition-colors"
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
                  className="w-full bg-white dark:bg-[#20202c] text-foreground px-4 py-2 rounded-xl border-none outline-none ring-2 ring-transparent focus:ring-[var(--primary)] transition-all"
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
              action={<span className="text-[14px] font-medium text-muted-foreground">가나다순</span>}
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
