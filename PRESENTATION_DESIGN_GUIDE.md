# Sunghyun.kim 프레젠테이션 디자인 가이드

이 문서는 hellosunghyun.com 웹사이트의 디자인 시스템을 기반으로 한 프레젠테이션 제작 가이드입니다.

---

## 1. 브랜드 색상

### Primary Colors

| 색상명 | HEX | RGB | 용도 |
|--------|-----|-----|------|
| **Brand Red** | `#881E1E` | `rgb(136, 30, 30)` | 강조, CTA, 하이라이트 |
| **Black** | `#0E0E11` | `rgb(14, 14, 17)` | 다크 배경, 주요 텍스트 |
| **White** | `#FFFFFF` | `rgb(255, 255, 255)` | 라이트 배경 |

### Neutral Scale (Zinc)

| 색상명 | HEX | 용도 |
|--------|-----|------|
| zinc-50 | `#FAFAFA` | 서브 배경 |
| zinc-100 | `#F4F4F5` | 카드 배경, 구분선 |
| zinc-200 | `#E4E4E7` | 테두리, 구분선 |
| zinc-300 | `#D4D4D8` | 비활성 요소 |
| zinc-500 | `#71717A` | 보조 텍스트 |
| zinc-600 | `#52525B` | 본문 텍스트 |
| zinc-800 | `#27272A` | 다크모드 카드 |
| zinc-900 | `#18181B` | 헤드라인 텍스트 |

### 색상 조합 규칙

```
라이트 모드:
- 배경: #FFFFFF
- 주요 텍스트: zinc-900
- 보조 텍스트: zinc-500 ~ zinc-600
- 강조: #881E1E

다크 모드:
- 배경: #0E0E11 또는 #1A1A1A
- 주요 텍스트: #FAFAFA
- 보조 텍스트: zinc-400 ~ zinc-500
- 강조: #881E1E
```

---

## 2. 타이포그래피

### 폰트 패밀리

| 용도 | 폰트 | 대체 폰트 |
|------|------|-----------|
| **본문** | Geist Sans | -apple-system, system-ui |
| **코드/라벨** | Geist Mono | SF Mono, Consolas |

### 텍스트 스타일

#### 헤드라인 (H1 - 슬라이드 타이틀)
```css
font-size: 72px ~ 144px (6xl ~ 9xl)
font-weight: 900 (black)
letter-spacing: -0.05em (tighter)
line-height: 0.95
color: zinc-900
```

#### 서브헤드라인 (H2)
```css
font-size: 48px ~ 72px (4xl ~ 6xl)
font-weight: 700 (bold)
letter-spacing: -0.025em (tight)
color: zinc-900
```

#### 본문
```css
font-size: 20px ~ 24px (xl ~ 2xl)
font-weight: 500 (medium)
line-height: 1.75 (relaxed)
color: zinc-600
```

#### 라벨/배지
```css
font-family: Geist Mono (monospace)
font-size: 12px ~ 14px (xs ~ sm)
font-weight: 700 (bold)
letter-spacing: 0.1em (widest)
text-transform: uppercase
```

### 텍스트 강조 패턴

```
일반 강조: #881E1E 색상 적용
굵은 강조: font-weight: 700 + zinc-900
인용/설명: border-left 4px #881E1E + padding-left
```

---

## 3. 레이아웃 시스템

### 슬라이드 규격

| 비율 | 권장 해상도 | 용도 |
|------|-------------|------|
| 16:9 | 1920 x 1080 | 표준 프레젠테이션 |
| 16:10 | 1920 x 1200 | 맥북 호환 |

### 여백 및 간격

```
외부 여백 (Margin): 64px ~ 96px
콘텐츠 최대 너비: 1400px (센터 정렬)
섹션 간격: 64px ~ 128px
요소 간격: 16px ~ 32px
```

### 그리드 시스템

```
기본: 12컬럼 그리드
거터: 24px ~ 32px
컬럼 조합: 1, 2, 3, 4, 6, 12
```

---

## 4. 슬라이드 템플릿

### 4.1 타이틀 슬라이드

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ■ SUBTITLE / 카테고리                                    │
│                                                             │
│    메인 타이틀                                               │
│    강조 텍스트                       [선택: 원형 이미지]     │
│                                                             │
│    │ 설명 텍스트 1~2줄                                      │
│                                                             │
│    [Primary CTA]  [Secondary CTA]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**구성 요소:**
- 서브타이틀: 작은 정사각형(■) + 대문자 + monospace
- 메인 타이틀: font-black, 2줄 권장
- 강조 단어: #881E1E 색상
- 설명: 왼쪽 빨간 보더 라인

### 4.2 섹션 구분 슬라이드

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                  ■ SECTION 01                              │
│                                                             │
│               섹션 타이틀                                    │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**스타일:**
- 중앙 정렬
- 배경: 흰색 또는 #1A1A1A
- 넘버링: 01, 02, 03 형식

### 4.3 콘텐츠 슬라이드 (Bento Grid)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ■ SECTION TITLE                                         │
│    헤드라인                                                  │
│                                                             │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│    │ [Icon]       │  │ [Icon]       │  │ [Icon]       │    │
│    │ 카드 타이틀  │  │ 카드 타이틀  │  │ 카드 타이틀  │    │
│    │ 설명 텍스트  │  │ 설명 텍스트  │  │ 설명 텍스트  │    │
│    │              │  │              │  │              │    │
│    └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**카드 스타일:**
- 배경: #FFFFFF (라이트) / #1A1A1A (다크)
- 테두리: 1px zinc-200 (라이트) / zinc-800 (다크)
- 패딩: 32px
- 아이콘: 우측 상단 배경에 120px, opacity 10~20%

### 4.4 데이터/통계 슬라이드

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ■ METRICS                                               │
│    주요 지표                                                 │
│                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│    │   150+   │  │   50+    │  │   99%    │  │   24/7   │  │
│    │  프로젝트 │  │   고객   │  │  만족도  │  │   지원   │  │
│    └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**통계 스타일:**
- 숫자: font-black, 48~72px, zinc-900
- 라벨: monospace, 14px, zinc-500
- 구분: 세로선 또는 카드 형태

### 4.5 인용/하이라이트 슬라이드

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ┌─────────────────────────────────────────────────────┐ │
│    │                                                     │ │
│    │     "인용문 또는 핵심 메시지가                       │ │
│    │      여기에 들어갑니다."                            │ │
│    │                                                     │ │
│    │                    — 출처 또는 화자                 │ │
│    │                                                     │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**스타일:**
- 배경: #881E1E 또는 #1A1A1A
- 텍스트: 흰색, 36~48px
- 출처: monospace, opacity 70%

### 4.6 CTA/마무리 슬라이드

```
┌─────────────────────────────────────────────────────────────┐
│                         (중앙 정렬)                         │
│                                                             │
│                    [LET'S WORK]                            │
│                                                             │
│                  함께 시작해요                               │
│                 TOGETHER                                    │
│                                                             │
│         프로젝트 문의: hello@sunghyun.kim ↗                 │
│                                                             │
│        ─────────────────────────────────────                │
│                  © 2025 Sunghyun Kim                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. 컴포넌트 스타일

### 버튼

#### Primary Button
```css
background: #881E1E;
color: #FFFFFF;
padding: 16px 32px;
font-weight: 700;
font-size: 18px;
border-radius: 0px; /* 직각 */
box-shadow: 0 10px 25px rgba(136, 30, 30, 0.3);
```

#### Secondary Button
```css
background: #FFFFFF;
border: 1px solid zinc-300;
color: zinc-900;
padding: 16px 32px;
font-weight: 700;
```

### 배지/태그

#### Brand Badge
```css
background: rgba(136, 30, 30, 0.1);
color: #881E1E;
border: 1px solid rgba(136, 30, 30, 0.2);
padding: 8px 16px;
border-radius: 9999px;
font-family: monospace;
font-weight: 700;
```

#### Tech Badge
```css
background: zinc-100;
color: zinc-600;
border: 1px solid zinc-200;
padding: 4px 12px;
border-radius: 4px;
font-family: monospace;
font-size: 14px;
```

### 카드

```css
background: #FFFFFF;
border: 1px solid zinc-200;
padding: 32px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);

/* 호버 시 */
box-shadow: 0 20px 25px rgba(0,0,0,0.15);
transition: all 0.5s;
```

### 구분선

```css
/* 수평선 */
border-top: 1px solid zinc-200;
margin: 64px 0;

/* 왼쪽 강조선 */
border-left: 4px solid #881E1E;
padding-left: 24px;
```

---

## 6. 아이콘 & 그래픽

### 아이콘 스타일

- **스타일**: Lucide Icons (선형)
- **굵기**: stroke-width 1.5 ~ 2
- **크기**: 20px (인라인), 24px (버튼), 120px (데코레이션)
- **색상**: 현재 텍스트 색상 상속 또는 #881E1E

### 장식 요소

```
원형 대시 테두리:
- border: 1px dashed #881E1E
- opacity: 20%
- animation: spin 60s linear infinite

배경 아이콘:
- 우측 상단 배치
- opacity: 10~20%
- hover 시 opacity: 20~30%
```

---

## 7. 애니메이션

### 진입 애니메이션

| 이름 | 효과 | 지속시간 |
|------|------|----------|
| fadeIn | opacity 0 → 1 | 0.5s |
| fadeInUp | opacity + translateY(20px → 0) | 0.6s |
| zoom | scale(0.95 → 1) + opacity | 0.4s |
| slideFromLeft | translateX(-8px → 0) | 0.3s |
| slideFromBottom | translateY(8px → 0) | 0.3s |

### 이징 커브

```css
기본: cubic-bezier(0.46, 0.03, 0.52, 0.96)
부드러운: cubic-bezier(0.65, 0.05, 0.36, 1)
바운스: cubic-bezier(0.68, -0.55, 0.27, 1.55)
```

### 딜레이 패턴

```
첫 번째 요소: 0s
두 번째 요소: 0.2s
세 번째 요소: 0.4s
...
```

---

## 8. 다크/라이트 모드

### 라이트 모드 (기본)

```
배경: #FFFFFF
카드 배경: #FFFFFF
텍스트: zinc-900
보조 텍스트: zinc-500
테두리: zinc-200
강조: #881E1E
```

### 다크 모드

```
배경: #0E0E11
카드 배경: #1A1A1A (rgb(26,26,26))
텍스트: #FAFAFA
보조 텍스트: zinc-400
테두리: zinc-800
강조: #881E1E
```

---

## 9. 이미지 가이드

### 프로필/인물 이미지

- **형태**: 원형 마스크
- **크기**: 350px ~ 600px (반응형)
- **효과**: 장식용 대시 원형 테두리
- **투명도**: 60~90% (배경과 자연스럽게)

### 프로젝트 이미지

- **비율**: 16:9 또는 4:3
- **라운드**: 0px (직각) 또는 8px
- **테두리**: 1px zinc-200

### 아이콘/로고

- **배경**: 투명 PNG 또는 SVG
- **크기**: 일관된 높이 유지 (24px, 32px, 48px)

---

## 10. 베스트 프랙티스

### DO ✓

- 한 슬라이드에 하나의 핵심 메시지
- 충분한 여백 확보 (최소 64px)
- 텍스트 계층 구조 명확히 (타이틀 → 서브타이틀 → 본문)
- #881E1E 색상은 강조점에만 사용
- monospace 폰트로 라벨/메타 정보 구분
- 애니메이션은 순차적 딜레이로 자연스럽게

### DON'T ✗

- 슬라이드에 텍스트 과다 배치
- 3가지 이상 색상 동시 사용
- 작은 폰트 사이즈 (최소 14px)
- 복잡한 그라데이션 또는 패턴
- 과도한 애니메이션 효과
- 정렬되지 않은 요소 배치

---

## 11. 파일 포맷

### 프레젠테이션 내보내기

| 용도 | 포맷 | 설정 |
|------|------|------|
| 화면 발표 | PDF | 고품질, RGB |
| 인쇄 | PDF | 300dpi, CMYK |
| 웹 공유 | HTML/PPTX | 최적화 이미지 |

### 이미지 에셋

| 용도 | 포맷 | 품질 |
|------|------|------|
| 사진 | WebP/AVIF | 65~85% |
| 아이콘 | SVG | 벡터 |
| 스크린샷 | PNG | 무손실 |

---

## 부록: 빠른 참조

### 색상 코드

```
Primary:     #881E1E
Black:       #0E0E11
White:       #FFFFFF
Gray-900:    #18181B
Gray-600:    #52525B
Gray-500:    #71717A
Gray-200:    #E4E4E7
Gray-100:    #F4F4F5
```

### 폰트 스택

```css
--font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Geist Mono', 'SF Mono', 'Monaco', 'Consolas', monospace;
```

### 자주 쓰는 클래스 조합

```
타이틀: text-6xl md:text-8xl font-black tracking-tighter
서브타이틀: font-mono text-sm font-bold uppercase tracking-widest text-[#881E1E]
본문: text-xl text-zinc-600 leading-relaxed
강조 텍스트: text-[#881E1E] font-bold
카드: bg-white border border-zinc-200 p-8 shadow-sm hover:shadow-xl transition-all
버튼: px-8 py-4 bg-[#881E1E] text-white font-bold
```

---

*이 가이드는 hellosunghyun.com 웹사이트의 디자인 시스템을 기반으로 작성되었습니다.*
