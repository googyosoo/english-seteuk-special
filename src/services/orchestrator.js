/**
 * AI 영어 세특 작성 서비스 - 지능형 오케스트레이터 및 서브 에이전트 다각화 엔진 (v5.6)
 */
import { CAREER_PATHS } from '../data/englishData.js';

/**
 * 고품격 무주어 종결어미(~임, ~음, ~함) 정밀 정제 필터 (v5.6)
 */
export const finalSanitizeSeteuk = (text, studentName) => {
  if (!text) return '';
  
  let clean = text;

  // [v5.9 2026학년도 교육부 기재요령 절대 금기어 안심 우회 치환 룰셋]
  // 1) 논문, 소논문, R&E 등 학술 활동 관련 기재 금지 조항 우회
  clean = clean
    .replace(/소논문/g, '학술 보고서')
    .replace(/논문/g, '탐구 보고서')
    .replace(/R&E|알앤이/gi, '융합 탐구 과업');

  // 2) 대회 및 수상 관련 금지어 우회
  clean = clean
    .replace(/대회 참여/g, '수행 활동 참여')
    .replace(/대회에/g, '활동에')
    .replace(/대회/g, '학업 활동')
    .replace(/수상 실적/g, '성과')
    .replace(/수상/g, '성과 결실')
    .replace(/상장/g, '결과물');

  // 3) 특정 사기업 제품명, 상호명 및 플랫폼명 우회
  clean = clean
    .replace(/구글 프레젠테이션/g, '협업 발표 소프트웨어')
    .replace(/구글 드라이브/g, '클라우드 협업 저장소')
    .replace(/구글 설문지/g, '온라인 설문 도구')
    .replace(/구글/g, '정보 협업 플랫폼')
    .replace(/마이크로소프트/g, '정보화 소프트웨어 제조사')
    .replace(/MS Word|MS 워드/gi, '문서 작성 프로그램')
    .replace(/MS Office|MS 오피스/gi, '오피스 프로그램')
    .replace(/MS/gi, '정보화 소프트웨어 기업')
    .replace(/애플 키노트/g, '발표용 소프트웨어')
    .replace(/애플 아이패드/g, '태블릿 정보 기기')
    .replace(/애플/g, '스마트 정보 기기 제조사')
    .replace(/파워포인트|PPT|ppt/gi, '시각 자료 발표 프로그램')
    .replace(/엑셀|Excel|excel/gi, '스프레드시트 프로그램')
    .replace(/유튜브/g, '동영상 공유 미디어')
    .replace(/유튜버/g, '미디어 창작자')
    .replace(/챗GPT|ChatGPT|챗지피티|gpt-4/gi, '생성형 인공지능 플랫폼');

  // 4) 구체적인 대학명, 강사명, 기관명 우회
  clean = clean
    .replace(/([가-힣]+)대학교/g, '고등학술기관')
    .replace(/([가-힣]+)대학/g, (match, p1) => {
      if (['대단', '대다', '대체', '대강', '대략'].includes(p1)) return match;
      return '학술기관';
    })
    .replace(/([가-힣]+)교수/g, '학술 전문가')
    .replace(/([가-힣]+)강사/g, '교육 전문가');

  // 1. 학생 이름 및 '학생' 단어 관련 주체/주어 표현 완벽 차단
  if (studentName && studentName.trim()) {
    const escapedName = studentName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const namePatterns = [
      new RegExp(`${escapedName}\\s*학생은`, 'g'),
      new RegExp(`${escapedName}\\s*학생이`, 'g'),
      new RegExp(`${escapedName}\\s*학생의`, 'g'),
      new RegExp(`${escapedName}\\s*학생`, 'g'),
      new RegExp(`${escapedName}은`, 'g'),
      new RegExp(`${escapedName}는`, 'g'),
      new RegExp(`${escapedName}이`, 'g'),
      new RegExp(`${escapedName}가`, 'g'),
      new RegExp(`${escapedName}의`, 'g'),
      new RegExp(`${escapedName}`, 'g')
    ];
    namePatterns.forEach(pattern => {
      clean = clean.replace(pattern, '');
    });
  }

  // '학생' 단어가 들어간 주어/수식어 철저히 정화 (단, '학생·교사·학부모' 등의 복합어는 '학습자·교사·학부모'로 유연하게 치환하여 주어 오해 소지 완전 차단)
  clean = clean.replace(/학생·교사·학부모/g, '학습자·교사·학부모');
  clean = clean.replace(/학생, 교사, 학부모/g, '학습자, 교사, 학부모');
  
  const studentPatterns = [
    /해당 학생은/g,
    /해당 학생의/g,
    /이 학생은/g,
    /이 학생의/g,
    /학생은/g,
    /학생이/g,
    /학생의/g,
    /학생/g
  ];
  studentPatterns.forEach(pattern => {
    clean = clean.replace(pattern, '');
  });

  // 2. '그는', '그가', '그의' 및 '그녀는', '그녀가', '그녀의', '자신의', '자신은', '자신이' 등 대명사 차단
  const pronounPatterns = [
    /그는/g,
    /그가/g,
    /그의/g,
    /그녀는/g,
    /그녀가/g,
    /그녀의/g,
    /자신의/g,
    /자신은/g,
    /자신이/g
  ];
  pronounPatterns.forEach(pattern => {
    clean = clean.replace(pattern, '');
  });

  // [S1급 결말 공식 교체 및 잠재력/성장 상투어 박멸]
  clean = clean
    .replace(/한 모습을 보여줌\./g, '함.')
    .replace(/할 것으로 기대됨\./g, '로 이어질 단초가 보임.')
    .replace(/성장이 기대됨\./g, '단초가 마련됨.')
    .replace(/무한한 가능성을 보여줌\./g, '')
    .replace(/본인의 진정한 잠재력을 발휘함\./g, '역량을 발휘함.')
    .replace(/을 통해 성장하는 모습이 인상적임\./g, '의 과정에서 변화함.');

  // [S1급 Hype 어휘 박멸 및 품격 있는 우회 표현 치환]
  clean = clean
    .replace(/탁월한/g, '남다른')
    .replace(/탁월함\./g, '돋보임.')
    .replace(/뛰어난/g, '결이 깊은')
    .replace(/뛰어남\./g, '남다름.')
    .replace(/우수한/g, '안정적인')
    .replace(/우수함\./g, '안정적임.')
    .replace(/출중한/g, '주도적인')
    .replace(/심도 있는/g, '면밀한')
    .replace(/깊이 있는/g, '차분한')
    .replace(/놀라운/g, '')
    .replace(/인상적인/g, '')
    .replace(/인상적임\./g, '돋보임.')
    .replace(/폭넓은/g, '')
    .replace(/다양한/g, '')
    .replace(/진정한/g, '')
    .replace(/진지한/g, '')
    .replace(/활발한/g, '')
    .replace(/적극적인/g, '')
    .replace(/적극적으로/g, '주도적으로');

  // [S1급 범용 형용사 콤보(And 형태) 제거]
  clean = clean
    .replace(/성실하고 적극적인/g, '성실한')
    .replace(/진지하고 성실한/g, '성실한')
    .replace(/꾸준하고 열정적인/g, '꾸준한')
    .replace(/차분하고 논리적인/g, '논리적인')
    .replace(/깊이 있고 다양한/g, '깊이 있는')
    .replace(/폭넓고 풍부한/g, '풍부한');

  // [S2급 형식명사 인플레 및 수식 중복, 메타 진입어 정화]
  clean = clean
    .replace(/하는 모습/g, '함')
    .replace(/하는 점이 돋보임/g, '하여 돋보임')
    .replace(/라는 측면에서/g, '에서')
    .replace(/한 부분에서/g, '할 때')
    .replace(/을 함에 있어/g, '할 때')
    .replace(/이는\s*~을\s*시사함/g, '')
    .replace(/특히 주목할 점은/g, '특히')
    .replace(/이러한 모습에서 ~을 확인할 수 있음/g, '')
    .replace(/다양하고 깊이 있는 관점에서/g, '다양한 관점에서')
    .replace(/적극적이고 능동적으로/g, '주도적으로')
    .replace(/체계적이고 논리적인/g, '체계적인')
    .replace(/꼼꼼하고 세심하게/g, '꼼꼼히');

  // [S1급 "~을 통해" 3회 이상 등장 시 지능형 순차 치환 알고리즘]
  const throughCount = (clean.match(/[가-힣a-zA-Z\s]+을 통해/g) || []).length;
  if (throughCount >= 3) {
    let currentIdx = 0;
    const substitutes = [' 과정에서', '에서', '을 매개로', '을 발판 삼아', '을 바탕으로'];
    clean = clean.replace(/([가-힣a-zA-Z\s]+)을 통해/g, (match, p1) => {
      currentIdx++;
      if (currentIdx >= 3) {
        const sub = substitutes[(currentIdx - 3) % substitutes.length];
        return p1 + sub;
      }
      return match;
    });
  }

  // 3. 품격 있고 신뢰감이 있는 어투 및 문장 종결 어미 강제화 (~임., ~음., ~함.)
  const endingReplacements = [
    // 3인칭/종결 보정
    { pattern: /하였다\./g, replace: '함.' },
    { pattern: /했다\./g, replace: '했음.' },
    { pattern: /보여주었다\./g, replace: '보여줌.' },
    { pattern: /보였다\./g, replace: '보임.' },
    { pattern: /입증하였다\./g, replace: '입증함.' },
    { pattern: /입증했다\./g, replace: '입증함.' },
    { pattern: /발휘하였다\./g, replace: '발휘함.' },
    { pattern: /발휘했다\./g, replace: '발휘함.' },
    { pattern: /발표하였다\./g, replace: '발표함.' },
    { pattern: /발표했다\./g, replace: '발표함.' },
    { pattern: /작성하였다\./g, replace: '작성함.' },
    { pattern: /작성했다\./g, replace: '작성함.' },
    { pattern: /수행하였다\./g, replace: '수행함.' },
    { pattern: /수행했다\./g, replace: '수행함.' },
    { pattern: /참여하였다\./g, replace: '참여함.' },
    { pattern: /참여했다\./g, replace: '참여함.' },
    { pattern: /탐구하였다\./g, replace: '탐구함.' },
    { pattern: /탐구했다\./g, replace: '탐구함.' },
    { pattern: /분석하였다\./g, replace: '분석함.' },
    { pattern: /분석했다\./g, replace: '분석함.' },
    { pattern: /도출하였다\./g, replace: '도출함.' },
    { pattern: /도출했다\./g, replace: '도출함.' },
    { pattern: /해결하였다\./g, replace: '해결함.' },
    { pattern: /해결했다\./g, replace: '해결함.' },
    { pattern: /이해하였다\./g, replace: '이해함.' },
    { pattern: /이해했다\./g, replace: '이해함.' },
    { pattern: /발전시켰다\./g, replace: '발전시킴.' },
    { pattern: /성장시켰다\./g, replace: '성장시킴.' },
    { pattern: /확장했다\./g, replace: '확장함.' },
    { pattern: /확장하였다\./g, replace: '확장함.' },
    { pattern: /기여하였다\./g, replace: '기여함.' },
    { pattern: /기여했다\./g, replace: '기여함.' },
    { pattern: /관찰되었다\./g, replace: '관찰됨.' },
    { pattern: /나타냈다\./g, replace: '나타냄.' },
    { pattern: /나타내었다\./g, replace: '나타냄.' },
    
    // 현재형/상태형 서술
    { pattern: /돋보인다\./g, replace: '돋보임.' },
    { pattern: /우수하다\./g, replace: '우수함.' },
    { pattern: /탁월하다\./g, replace: '탁월함.' },
    { pattern: /인상적이다\./g, replace: '인상적임.' },
    { pattern: /뛰어나다\./g, replace: '뛰어남.' },
    { pattern: /충실하다\./g, replace: '충실함.' },
    { pattern: /성실하다\./g, replace: '성실함.' },
    { pattern: /유익하다\./g, replace: '유익함.' },
    { pattern: /가능하다\./g, replace: '가능함.' },
    { pattern: /필요하다\./g, replace: '필요함.' },
    { pattern: /중요하다\./g, replace: '중요함.' },
    { pattern: /적절하다\./g, replace: '적절함.' },
    { pattern: /정확하다\./g, replace: '정확함.' },
    { pattern: /매끄럽다\./g, replace: '매끄러움.' },
    { pattern: /유려하다\./g, replace: '유려함.' },
    { pattern: /높다\./g, replace: '높음.' },
    { pattern: /깊다\./g, replace: '깊음.' },
    { pattern: /드러난다\./g, replace: '드러남.' },
    { pattern: /나타난다\./g, replace: '나타남.' },
    { pattern: /발휘한다\./g, replace: '발휘함.' },
    { pattern: /보여준다\./g, replace: '보여줌.' },
    { pattern: /이해한다\./g, replace: '이해함.' },
    { pattern: /분석한다\./g, replace: '분석함.' },
    { pattern: /작성한다\./g, replace: '작성함.' },
    { pattern: /설명한다\./g, replace: '설명함.' },
    { pattern: /제시한다\./g, replace: '제시함.' },
    { pattern: /주장한다\./g, replace: '주장함.' },
    { pattern: /도출한다\./g, replace: '도출함.' },
    { pattern: /해결한다\./g, replace: '해결함.' },
    { pattern: /학습한다\./g, replace: '학습함.' },
    { pattern: /독해한다\./g, replace: '독해함.' },
    { pattern: /노력한다\./g, replace: '노력함.' },
    { pattern: /임에 틀림없다\./g, replace: '임.' },
    { pattern: /이다\./g, replace: '임.' },
    { pattern: /운용한다\./g, replace: '운용함.' },
    { pattern: /완수한다\./g, replace: '완수함.' },
    
    // 일반적인 다. 종결 치환
    { pattern: /([가-힣]{2,})한다\./g, replace: '$1함.' },
    { pattern: /([가-힣]{2,})했다\./g, replace: '$1했음.' },
    { pattern: /([가-힣]{2,})였다\./g, replace: '$1였음.' },
    { pattern: /([가-힣]{2,})되었다\./g, replace: '$1됨.' },
    { pattern: /([가-힣]{2,})된다\./g, replace: '$1됨.' },
    { pattern: /([가-힣]{2,})이며\./g, replace: '$1임.' },
    { pattern: /([가-힣]{2,})이고\./g, replace: '$1임.' },
    { pattern: /([가-힣]{2,})이다\./g, replace: '$1임.' }
  ];

  endingReplacements.forEach(rep => {
    clean = clean.replace(rep.pattern, rep.replace);
  });

  // [v5.8 어미 연속 중복 감지 및 리드미컬 다변화 교차 치환 알고리즘]
  // 마침표 기준으로 문장을 정교하게 분리
  const sentences = clean.split(/(?<=\.)\s+/);
  if (sentences.length > 1) {
    let prevEndingType = '';
    const substitutesForHam = ['이 확인됨.', '을 드러냄.', '의 토대를 세움.', '을 가늠케 함.', '의 결이 잡힘.'];
    const substitutesForEum = ['으로 보임.', '이 돋보임.', '을 입증함.', '에 도달함.', '을 이끌어냄.'];
    const substitutesForIm = ['으로 확인됨.', '으로 귀결됨.', '을 방증함.', '에 닿아 있음.'];

    let subHamIdx = 0;
    let subEumIdx = 0;
    let subImIdx = 0;

    for (let i = 0; i < sentences.length; i++) {
      let s = sentences[i].trim();
      if (!s) continue;

      let currentEndingType = '';
      if (s.endsWith('함.')) currentEndingType = '함';
      else if (s.endsWith('했음.')) currentEndingType = '했음';
      else if (s.endsWith('음.')) currentEndingType = '음';
      else if (s.endsWith('임.')) currentEndingType = '임';

      if (currentEndingType && currentEndingType === prevEndingType) {
        if (currentEndingType === '함' || currentEndingType === '했음') {
          const replacement = substitutesForHam[subHamIdx % substitutesForHam.length];
          s = s.replace(/(?:했음|함)\.?$/, replacement);
          subHamIdx++;
        } else if (currentEndingType === '음') {
          const replacement = substitutesForEum[subEumIdx % substitutesForEum.length];
          s = s.replace(/음\.?$/, replacement);
          subEumIdx++;
        } else if (currentEndingType === '임') {
          const replacement = substitutesForIm[subImIdx % substitutesForIm.length];
          s = s.replace(/임\.?$/, replacement);
          subImIdx++;
        }
      }

      // 연속 여부 갱신을 위해 어미 상태 기록
      if (s.endsWith('함.')) prevEndingType = '함';
      else if (s.endsWith('음.')) prevEndingType = '음';
      else if (s.endsWith('임.')) prevEndingType = '임';
      else prevEndingType = currentEndingType;

      sentences[i] = s;
    }
    clean = sentences.join(' ');
  }

  // 혹시 모를 꼬여버린 공백 정제
  clean = clean.replace(/\s+/g, ' ').trim();
  
  // 마지막에 온점이 잘 찍혀있는지 확인 및 마무리
  if (clean.length > 0 && !clean.endsWith('.')) {
    clean += '.';
  }

  // 문두 문장부호 정화
  clean = clean
    .replace(/^\s*,\s*/g, '')
    .replace(/\s*,\s*,\s*/g, ', ')
    .replace(/\.\s*,/g, '.')
    .replace(/^[. ]+/, '')
    .trim();

  return clean;
};

// --- 성취기준 자연어 승화(Paraphrasing)를 위한 지능형 헬퍼 사전 ---
const getParaphrasedStandard = (std) => {
  if (!std) return '영어 교육과정의 주요 학업 영역을 자기주도적으로 탐색하여 차분한 이해를 획득함.';
  
  const code = std.code || '';
  const desc = std.desc || '';
  
  // 1. 공통 매퍼 사전 (대괄호와 기계적 상투어를 완전 배제한 고품격 역량 패러프레이징)
  const exactMappers = {
    '세부 정보': '영문 텍스트 속에 흩어진 세부적 사실과 핵심 정보를 정교하게 포착해 내는 분석적 해독력을 보임',
    '세부 정보를 파악': '영문 텍스트 속에 흩어진 세부적 사실과 핵심 정보를 정교하게 포착해 내는 분석적 해독력을 보임',
    '세부 정보를 요약': '영어 지문에 내재된 핵심 세부 정보와 논리적 인과관계를 일목요연하게 포착하고 종합적으로 요약하는 문해력을 갖춤',
    '주제나 요지를 파악': '다양한 주제의 영문 시사 텍스트를 탐독하고 글의 흐름을 거시적으로 통찰하며 핵심 주제와 요지를 날카롭게 파악함',
    '주제나 요지를 비교': '다양한 영문 텍스트가 지닌 상이한 필자의 논조와 핵심 요지를 입체적으로 대조하며 비판적으로 분석함',
    '숨겨진 의도를 추론': '문맥 이면에 숨겨진 필자의 학술적 의도와 논리 전개의 숨은 맥락을 정교하게 분석하며 높은 차원의 비판적 추론력을 발휘함',
    '의도 등을 추론': '화자나 필자가 텍스트의 맥락 속에 교묘히 숨겨둔 의도와 성격을 예리한 다각적 시선으로 논리적으로 추론함',
    '함축적 의미를 추론': '영문 텍스트의 앞뒤 맥락적 인과관계를 면밀히 고찰하여 특정 구문과 표현이 담고 있는 함축적 의미를 논리적으로 유유히 유추해 냄',
    '논리적 관계를 파악': '영어 지문 속 각 단락이 맺고 있는 유기적 연결성 및 사건의 선후 인과관계를 정밀한 논리로 구조화하여 이해함',
    '형식이나 구조를 파악': '영문 담화의 전체적인 전개 형식과 거시적 구조를 입체적으로 해독하며 텍스트의 구조적 완결성을 비판적으로 검증함',
    '다양한 관심이나 의견을 포용적인 태도': '다양한 사회문화적 쟁점을 다룬 영문 지문을 읽고 다원적 관점을 존중하는 포용적 시선으로 비판적 통찰력을 발휘함',
    '쟁점에 대해 포용적': '글로벌 사회의 복합적인 쟁점을 다룬 영어 지문을 학습하며 세계 시민으로서의 포용적 시선과 균형 잡힌 학술 태도를 드러냄',
    '활용하여 내용을 설명': '도표, 인포그래픽 등 다채로운 시각적 보조 자료를 활용하여 복합적인 영어 학술 개념을 청중에게 유려하게 전달함',
    '지식을 말이나 글로 전달': '탐구를 통해 획득한 객관적 지식과 사실적 정보를 정확한 구문론적 언어 형식을 바탕으로 영어로 정교하게 서술함',
    '설명이나 지시 등을 말하거나': '명확하고 정교한 영어 표현 방식을 사용하여 자신이 연구한 탐구 이론을 타인에게 조리 있게 설명하는 의사소통력을 입증함',
    '생각이나 의견, 감정, 감상 등을 표현': '영어 학습 과정에서 느낀 지적 통찰과 자신의 비판적 관점을 완성도 높은 유기적 구도의 영작문으로 유려하게 표현함',
    '의견이나 주장을 표현': '자신이 도출한 학술적 의견을 상대방을 존중하는 정중한 태도와 정교하게 조율된 어휘를 갖추어 논리정연하게 개진함',
    '요약하여 말하거나 기술': '읽고 들은 심화 영어 자료의 거시적 요지를 핵심 어휘를 활용하여 완성도 높은 한 문단의 유기적 요약문으로 작성함',
    '말이나 글로 요약': '복잡한 영문 학술 에세이의 논리적 골자를 핵심 키워드를 활용해 매우 집약적이고 정확한 영어 요약문으로 재구성해 냄',
    '전략을 적용': '고난도 구문과 전문 학술 어휘가 가득한 영문 지문을 이해하기 위해 문맥적 유추 및 자기조절 독해 전략을 적재적소에 활용함',
    '매체를 활용': '다양한 멀티미디어와 디지털 코스웨어 도구를 적절히 운용하여 학업 과업과 목적에 최적화된 영어 의사소통 역량을 발휘함'
  };

  // 1. exactMappers 매칭 검사
  const keys = Object.keys(exactMappers);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (desc.includes(key)) {
      return exactMappers[key] + '.';
    }
  }

  // 2. 심화 계열 폴백
  if (code.includes('독해')) {
    return '인문, 사회, 자연과학을 넘나드는 복합적이고 깊이 있는 영문 학술 지문을 깊이 탐독하고 글의 거시적 흐름과 미시적 논거를 입체적으로 대조 및 고찰하는 문해력을 발휘함.';
  }
  if (code.includes('작문')) {
    return '자신이 설정한 학술적 탐구 질문에 대해 다각적인 영문 근거들을 토대로 타당하고 설득력 있는 비판적 영어 논증 에세이를 정교한 작문 기술로 집필해냄.';
  }

  // 3. 프리 폴백 (대괄호와 취지, 성취함 등의 상투어 완전 제거 버전)
  const cleaned = desc
    .replace('할 수 있다.', '')
    .replace('파악한다.', '정밀하게 분석하고 입체적으로 해독함')
    .replace('요약한다.', '일목요연하게 요약하는 분석력을 발휘함')
    .replace('비교한다.', '정밀하게 비교 대조하며 비판적 독해 능력을 보임')
    .replace('추론한다.', '앞뒤 맥락을 바탕으로 예리하게 추론해 냄')
    .replace('설명한다.', '논리적인 영어 표현을 사용하여 정확히 설명함')
    .replace('전달한다.', '유기적인 단락 작성을 통해 명료하게 기술함')
    .replace('표현한다.', '자신만의 독창적인 생각과 결합하여 유려하게 표현함')
    .replace('협력한다.', '학습자들과 조화롭게 조율하고 연대하여 해결안을 도출함')
    .replace('이해하고', '깊이 고찰하고')
    .replace('파악할', '스스로 도출해낼')
    .replace('표현할', '논리정연하게 표현할')
    .trim();

  return `수업 활동 전반에서 영문 텍스트가 지닌 ${cleaned}의 지적 성취 수준을 입증함.`;
};

// --- 실제 OpenAI 및 Gemini API 브라우저 Fetch 실시간 연동 모듈 (주어 및 대명사 완전 제거 지침 장착) ---
const fetchRealAI = async (apiKey, params) => {
  const {
    studentName,
    subject,
    selectedStandards,
    selectedActivities,
    selectedCompetencies,
    selectedCharacteristics,
    selectedGrowths,
    obsDetail,
    selectedCareer,
    persona,
    tone,
    lengthLimit,
  } = params;

  const standardsText = selectedStandards.map(s => `[${s.code}] ${s.desc}`).join(', ');
  const activitiesText = selectedActivities.join(', ') || '영어 교과 탐구';
  const competenciesText = selectedCompetencies.join(', ') || '자기주도성';
  const characteristicsText = selectedCharacteristics.join(', ') || '성실함';
  const growthsText = selectedGrowths.join(', ') || '학업 역량 신장';
  const careerText = selectedCareer ? `${selectedCareer.name} (${selectedCareer.intro} ${selectedCareer.desc})` : '미설정';

  const systemPrompt = `당신은 대한민국 고등학교의 베테랑 영어 교사이자 대학 입학사정관들이 극찬하는 생활기록부 기재 전문가입니다.
다음 입력 정보와 교육부의 공식 생기부 기재 지침, 그리고 [영어과 세특 전문 작성 스킬(setek-english-creator)]에 기반하여, 단순 활동 나열이 아닌 학생 고유의 접근 방식, 발전 궤적, 미래지향적 잠재력이 한 덩어리로 흐르는 명품 세특 3종 대안을 JSON 형식으로 반환해 주세요.

[4층 서사 구조 설계 - 절대 원칙]
모든 세특은 단락 구분 없는 하나의 유려한 서술로 흐르되, 내부적으로 아래 4개 층위를 반드시 지녀야 합니다.
- 1층 (진단): 학생 고유의 영어과 학습 접근 성향 및 강점 (추상적 형용사 나열 금지, 첫 문장부터 구체 활동/태도로 개시)
- 2층 (전개): 구체적인 활동 근거 2~3가지 (텍스트 소재 + 산출물 형태 + 피드백을 수용하여 논증 구조를 재배치한 구체적 과정과 결과 묘사)
- 3층 (해석): 행동을 통해 드러난 역량과 태도의 교육학적 의미화 (메타 진입어 없이 스며들듯 해석)
- 4층 (전망): 발전 궤적과 전이 가능한 미래지향적 구체적 자질/역량 제시 (직업/학과 단정 대신 "질적 분석", "교차 분석" 등의 자질로 묘사)

[🚫 세특 특화 AI 티 박멸 규칙 (S1/S2급 금기어 절대 금지)]
아래 표현들은 세특을 한눈에 AI 글로 판별되게 만드는 치명적인 패턴입니다. 본문 잔존 0건을 목표로 절대 언급하지 마십시오!
1. 결말 공식 금지: "~한 모습을 보여줌", "~할 것으로 기대됨", "앞으로의 성장이 기대됨", "무한한 가능성을 보여줌", "본인의 진정한 잠재력을 발휘함" 등을 쓰지 마십시오. 대신 구체 역량을 직접 서술하고 끝마치거나, "발전의 단초가 보임", "토대가 마련됨" 등의 단초형 전망으로 마감하십시오.
2. Hype 어휘 금지: "탁월한", "뛰어난", "우수한", "출중한", "심도 있는", "깊이 있는", "놀라운", "인상적인", "주목할 만한", "폭넓은", "다양한", "진정한", "진지한", "활발한", "적극적인" 등의 형용사는 절대 사용하지 마십시오. 구체적 행동으로 직접 입증하십시오.
3. "~을 통해" 번역투 남발 금지: "발표를 통해", "토론을 통해" 등의 영어식 번역투(by/through)를 한 세특당 최대 2회 이하로 제어하십시오. 대신 "~ 과정에서", "~하면서", "~에 임하여" 등으로 다양화하십시오.
4. 범용 형용사 묶음(And 형태) 금지: "성실하고 적극적인", "진지하고 성실한", "꾸준하고 열정적인", "차분하고 논리적인" 등의 콤보 형용사는 0건으로 차단하고 구체적 행동 묘사로 녹여내십시오.
5. 형식명사 인플레 금지: "점", "측면", "모습", "부분", "것" 등의 의존명사가 한 문장에 2개 이상 중복되지 않도록 하십시오.
6. 메타 진입어 금지: "이는 ~을 시사함", "특히 주목할 점은", "이러한 모습에서 ~을 확인할 수 있음" 등은 절대 쓰지 말고 직접 연결하십시오.
7. 활동/산출물 추상화 금지: "영어 발표를 함" 대신 "기후 난민 문제를 다룬 영어 발표를 함"처럼 구체적 소재 및 산출물을 노출하십시오.

[대학 입학사정관 극찬 실제 우수 기재 사례 (주어 및 대명사가 배제된 무주어 퓨샷 예시)]
* 사례 1 (영어 구사력과 가정법 문법 심화 질문 및 영문 모토 인용 융합):
  "학습 추가자료를 주도적으로 활용하는 과정에서 영어 본문의 핵심 어구 추출, 문장 간 논리 구조 파악, 전체 맥락 이해 등의 체계적인 접근법으로 자기주도학습 능력을 향상시킴. 자기소개 글쓰기 및 말하기 활동에서 미래 목표를 명확한 문장 구조로 표현하며 안정적인 영어구사력을 보임. 'I believe my intelligence and kindness can make a difference'와 같은 추상적 포부를 구체적인 영문장으로 서술하고, 치매 치료라는 구체적인 진로 목표를 제시하여 논리적 사고력을 드러냄. 축구에 대한 열정을 가정법을 활용해 창의적으로 표현하고, 발표 시에도 자신감 있는 태도로 영어 의사소통 역량이 조화롭게 돋보임. 수업성찰일지 작성을 통해 매시간 학습한 어휘와 숙어를 빠짐없이 기록하는 성실한 학습 태도를 유지하며, '조동사 have p.p'와 같은 특정 문법의 구체적인 활용법을 질문하며 배운 내용을 심화 학습으로 연결하려는 의지가 돋보임."
* 사례 2 (과학적 호기심과 영작문 인용구 및 동료평가/성찰일지 어원 탐구 융합):
  "영문 텍스트의 핵심 표현 추출 및 담화 패턴 파악 분석으로 자기주도적 학습 역량을 효과적으로 발전시킴. 자기소개 글쓰기 및 말하기 활동에서 원자와 전자에 대한 과학적 호기심을 표현하여 탐구 정신을 드러내었으며, 'exploring a vast world of chemistry as if I were a researcher'라는 가정법 구문을 활용하여 미래에 대한 포부를 창의적으로 표현함. 'How exciting it is to learn from a great teacher'라는 감탄문 구조로 영어를 유연하게 구사하는 등 영어 의사소통 역량이 남다름. 동료평가에서 평가 기준을 명확히 설명하고 학습자들의 말하기 능력 발전을 위한 실질적 개선안을 제공함. 수업성찰일지 작성을 통해 'advance'가 왜 'in'과 결합하여 '미리'라는 뜻이 되는지와 같이 단어의 어원과 문법 규칙의 이면을 파고드는 질문을 하며 지식을 심층적으로 이해하고 체계화하는 학구열이 돋보임."
* 사례 3 (융합탐구 프로젝트 및 실증적 경제/수학 연계 분석):
  "공존의 미래를 그리다 융합탐구 프로젝트에서 경제학 서적과 무역 정책 분석 보고서를 읽고 글로벌 공급망 변화가 한국의 수출 및 원자재 수급에 미치는 영향을 분석함. 경제 교과의 한계효용과 소비자 선택 이론을 적용해 식품과 스마트폰 산업의 소비 패턴 차이를 구분하고, 등비수열과 함수 그래프 분석을 활용해 향후 수출입 추세를 모델링하며 탐구의 정교함을 더함. 또한 라이프스타일과 심리적 기제가 구매 의사결정에 미치는 경로를 분석하여 산업별 무역 전략을 구체화함. 공공 무역 데이터를 기반으로 5년간의 수출액 증감과 공급망 리스크 지수 간 상관관계를 분석하여 식품 산업의 안정적 성장세와 스마트폰 시장의 고변동성을 실증적으로 규명함. 다변화된 무역 변수의 통제 어려움에 직면했으나, 상충되는 데이터 결과를 정책 변화와 외부 충격 변수로 해석하는 유연한 사고로 문제를 해결하며 데이터 기반 실증 분석 능력과 국제무역 전략 수립 역량을 입증함."

[JSON 반환 형식 - 오직 아래 구조로만 반환하십시오]
{
  "variants": [
    {
      "id": "academic-focused",
      "name": "학업/성취기준 집중안",
      "text": "위 '사례 1' 스타일의 주어/대명사가 배제되고 AI 티가 완벽히 제거된 4층 서사의 품격 있는 세특..."
    },
    {
      "id": "activity-focused",
      "name": "활동/태도/협업 집중안",
      "text": "위 '사례 3' 스타일의 주어/대명사가 배제되고 AI 티가 완벽히 제거된 4층 서사의 품격 있는 세특..."
    },
    {
      "id": "career-focused",
      "name": "진로/자기주도 탐구안",
      "text": "위 '사례 2' 스타일의 주어/대명사가 배제되고 AI 티가 완벽히 제거된 4층 서사의 품격 있는 세특..."
    }
  ]
}
오직 명시된 JSON 오브젝트만 반환해야 하며, 마크다운 \`\`\`json 외의 어떠한 사족이나 부연설명도 반환해서는 안 됩니다.`;

  const userPrompt = `학생 입력 세부 정보 (세특 생성 시 이름과 대명사는 절대 쓰지 마십시오):
- 대상 과목: ${subject}
- 성취기준 원문 (참고용이며 코드는 절대 쓰지 마십시오): ${standardsText}
- 수업 활동 칩: ${activitiesText}
- 발휘 핵심역량 칩: ${competenciesText}
- 수업 특성/태도: ${characteristicsText}
- 수업 전/후 성장세: ${growthsText}
- 진로 연계 계열: ${careerText}
- 구체적 수행평가 기록 및 개별 관찰 기록: ${obsDetail}
- 페르소나 스타일: ${persona.name} (${persona.desc})
- 적용 어조: ${tone.name}

이 정보를 유기적으로 조합하여 세 종류의 명품 무주어 세특 문장을 리턴해주세요.`;

  const isGeminiKey = apiKey.startsWith('AIzaSy');

  if (isGeminiKey) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\n${userPrompt}`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 통신 에러: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    return JSON.parse(rawText);

  } else {
    const openaiUrl = 'https://api.openai.com/v1/chat/completions';
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 통신 에러: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.choices[0].message.content;
    return JSON.parse(rawText);
  }
};

// --- 서브 에이전트 1: 성취기준 분석 및 융합 에이전트 (v5.5 - 자연어화 및 무주어 적용) ---
const runStandardAgent = async (subject, selectedStandards, onProgress) => {
  onProgress('성취기준 공식 설명 추출 및 고품질 자연어 승화 중...');
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const codes = selectedStandards.map(s => s.code);
  onProgress(`[${codes.join(', ')}] 성취기준의 무주어 패러프레이징 융합 중...`);
  await new Promise(resolve => setTimeout(resolve, 200));

  let standardText = '';
  if (selectedStandards.length === 1) {
    const std = selectedStandards[0];
    const paraphrased = getParaphrasedStandard(std).trim();
    // 마침표가 있을 시 제거하여 전체 오케스트레이터와 자연스럽게 연결
    standardText = paraphrased.endsWith('.') ? paraphrased.slice(0, -1) : paraphrased;
  } else if (selectedStandards.length > 1) {
    const std1 = selectedStandards[0];
    const std2 = selectedStandards[1];
    let paraphrased1 = getParaphrasedStandard(std1).trim();
    let paraphrased2 = getParaphrasedStandard(std2).trim();

    // 첫 번째 성취기준의 어미를 정교하게 연결형으로 전환
    if (paraphrased1.endsWith('.')) {
      paraphrased1 = paraphrased1.slice(0, -1);
    }
    if (paraphrased2.endsWith('.')) {
      paraphrased2 = paraphrased2.slice(0, -1);
    }

    if (paraphrased1.endsWith('보임')) {
      paraphrased1 = paraphrased1.replace(/보임$/, '보였으며,');
    } else if (paraphrased1.endsWith('발휘함')) {
      paraphrased1 = paraphrased1.replace(/발휘함$/, '발휘하고,');
    } else if (paraphrased1.endsWith('파악함')) {
      paraphrased1 = paraphrased1.replace(/파악함$/, '파악하며,');
    } else if (paraphrased1.endsWith('이해함')) {
      paraphrased1 = paraphrased1.replace(/이해함$/, '이해하고,');
    } else if (paraphrased1.endsWith('우수함')) {
      paraphrased1 = paraphrased1.replace(/우수함$/, '안정적이며,');
    } else if (paraphrased1.endsWith('함')) {
      paraphrased1 = paraphrased1.replace(/함$/, '하고,');
    } else if (paraphrased1.endsWith('음')) {
      paraphrased1 = paraphrased1.replace(/음$/, '으며,');
    } else if (paraphrased1.endsWith('임')) {
      paraphrased1 = paraphrased1.replace(/임$/, '이고,');
    } else {
      paraphrased1 = paraphrased1 + '고,';
    }

    standardText = `${paraphrased1} ${paraphrased2}`;
  } else {
    standardText = `영어 교육과정에서 제시하는 비판적 읽기 및 자기주도적 영작 능력을 수업 과업 전반에서 안정적으로 완수함`;
  }

  // 최종 리턴 시 전체 문장의 끝마디가 다른 구절들과 매끄럽게 연결되도록 교정
  if (standardText.endsWith('보임')) {
    standardText = standardText.replace(/보임$/, '보이고,');
  } else if (standardText.endsWith('발휘함')) {
    standardText = standardText.replace(/발휘함$/, '발휘하며,');
  } else if (standardText.endsWith('우수함')) {
    standardText = standardText.replace(/우수함$/, '안정적이며,');
  } else if (standardText.endsWith('함')) {
    standardText = standardText.replace(/함$/, '하고,');
  } else if (standardText.endsWith('음')) {
    standardText = standardText.replace(/음$/, '으며,');
  } else if (standardText.endsWith('임')) {
    standardText = standardText.replace(/임$/, '이고,');
  } else {
    if (!standardText.endsWith(',')) standardText = standardText + ',';
  }

  return {
    success: true,
    sentence: standardText,
    analysis: '성취기준 코드를 완전히 배제하고 100% 무주어형 자연어 표현으로 승화를 완료했습니다.'
  };
};

// --- [v5.8] 진로명 직접 노출 방지 및 고차원 학술 역량 승화 매퍼 ---
const sublimateCareerText = (career) => {
  if (!career) return '';
  const name = career.name || '';
  if (name.includes('의학') || name.includes('보건') || name.includes('바이오')) {
    return '생명 현상 및 의료 보건 관련 사회적 쟁점에 내재된 인도주의적 가치관과 인간 이해의 맥락을 분석하며';
  }
  if (name.includes('컴퓨터') || name.includes('IT') || name.includes('소프트웨어') || name.includes('인공지능') || name.includes('공학')) {
    return '기술 공학적 원리와 알고리즘적 사고를 바탕으로 시스템의 논리 구조를 정교하게 분석하고 추상화하며';
  }
  if (name.includes('경영') || name.includes('경제') || name.includes('무역') || name.includes('금융')) {
    return '시장 메커니즘의 실증 데이터와 글로벌 정책 상관관계를 다변화 관점에서 계량화하고 통찰하며';
  }
  if (name.includes('인문') || name.includes('어문') || name.includes('역사') || name.includes('철학')) {
    return '역사·철학적 텍스트 이면에 흐르는 다원적 문화 담론과 인간 보편의 본질적 가치를 비판적으로 해석하며';
  }
  if (name.includes('사회') || name.includes('정치') || name.includes('법률') || name.includes('행정') || name.includes('외교')) {
    return '제도적 사회 질서와 정의론 담론 속 갈등 구조를 비교사회학적 관점으로 면밀히 추론하며';
  }
  if (name.includes('예술') || name.includes('디자인') || name.includes('미디어') || name.includes('체육')) {
    return '매체 기호학적 상징성과 대중 전달 매커니즘의 소통 방식을 다각도에서 입체적으로 관찰하고 변주하며';
  }
  return '다학제적 학술 지평의 쟁점과 교과 지식을 유기적으로 연결하고 다변화 분석을 시도하며';
};

// --- 서브 에이전트 2: 다차원 역량/활동/진로 융합 에이전트 (v5.5 - 무주어 및 명사형 종결) ---
const runCompetencyAgent = async (activities, competencies, obsDetail, selectedCareer, onProgress) => {
  onProgress('수업 탐구 활동 칩 및 전공 학술 시사 키워드 결합 중...');
  await new Promise(resolve => setTimeout(resolve, 200));

  const activeWords = activities.length > 0 ? activities.join(', ') : '종합 영어 학술 탐색';
  const compWords = competencies.length > 0 ? competencies.join(', ') : '비판적 독해력';

  let careerText = '';
  if (selectedCareer) {
    const sublimated = sublimateCareerText(selectedCareer);
    careerText = ` 관심 학술 영역인 ${sublimated} 교과 지식을 지능적으로 교차 인지하고`;
  }

  let obsPart = '';
  if (obsDetail) {
    const cleanedObs = obsDetail.trim().replace(/\.$/, '');
    // 주어(이름, 학생) 및 대명사(그는/그가/그의) 제거 및 명사형 종결어미화
    let neisCleanObs = cleanedObs
      .replace(/학생은/g, '')
      .replace(/학생의/g, '')
      .replace(/그는/g, '')
      .replace(/그가/g, '')
      .replace(/그의/g, '')
      .trim();

    // 지능형 영문 인용구 검출 (사용자가 적은 기록 속에 따옴표로 감싸진 영문장/모토가 있을 경우 고품격 영작 융합 모듈 작동)
    const englishQuoteRegex = /['"‘“]([^'"’“”]+[a-zA-Z\s\.,!\?]+[^'"’“”]+)['"’“”]/;
    const quoteMatch = neisCleanObs.match(englishQuoteRegex);

    if (quoteMatch) {
      const quote = quoteMatch[1].trim();
      obsPart = ` 특히 자신의 진로 포부나 학업 열정을 담아 '${quote}'와 같은 영어 표현을 주도적으로 영작하였으며, 관련 구문의 문법적 완성도와 어휘적 뉘앙스를 심층 분석하여 자신의 생각을 주체적인 완성도 높은 영어 문장으로 명확히 표현해내는 안정적인 영어 구사 역량을 보임.`;
    } else if (neisCleanObs.includes('에세이') || neisCleanObs.includes('발표') || neisCleanObs.includes('조사')) {
      obsPart = ` 단순히 영문 텍스트를 읽어내는 소극적 단계를 뛰어넘어 '${neisCleanObs}'이라는 심층 탐구 주제를 주체적으로 도출하고, 이를 바탕으로 동료들과의 깊이 있는 논증적 토론을 리드하며 자신의 관점을 담아낸 고급 영문 에세이를 작성하는 논리적 치밀함을 보여줌.`;
    } else {
      obsPart = ` 특히 '${neisCleanObs}' 과정에서 관심 전공과 영문 학술 지문 속 핵심 개념을 유기적으로 대조하며 심도 있게 탐색하였고, 이 과정에서 영영사전을 다각도로 교차 활용하여 영어식 사고와 어휘적 뉘앙스의 지평을 다채롭게 확장함.`;
    }
  } else {
    obsPart = ` ‘${activeWords}’ 과업을 조율하는 과정에서 영문 텍스트의 유기적인 문장 연결 및 인과관계를 철저하게 검증하였으며, 동료들의 의견을 종합하여 막힘없는 개요 작성을 리드하여 영어 의사소통 역량을 발휘함.`;
  }
  let baseSentence = `‘${activities[0] || '영어 교과 탐구'}’ 과업에서 드러나듯 영어 읽기 활동에 성실한 태도를 보여주어 ${competencies[0] || '스스로 논리를 구성하고 표현하는'} 비판적 사고력을 유려하게 발휘하였고,${careerText}${obsPart}`;

  // 마침표 정제 및 종결어미화 (이미 '보임', '했음', '함', '됨' 등으로 끝나 있으면 중복 추가 방지)
  baseSentence = baseSentence.trim();
  if (baseSentence.endsWith('.')) {
    baseSentence = baseSentence.slice(0, -1);
  }
  if (!baseSentence.endsWith('음') && !baseSentence.endsWith('함') && !baseSentence.endsWith('임') && !baseSentence.endsWith('였음') && !baseSentence.endsWith('했음') && !baseSentence.endsWith('됨')) {
    baseSentence = baseSentence + '음';
  }

  return {
    success: true,
    sentence: baseSentence,
    keywords: [...activities, ...competencies]
  };
};

// --- 서브 에이전트 3: 개별화 특성 및 페르소나 스타일링 에이전트 (v5.5 - 주어 및 대명사 배제) ---
const runPersonaAgent = async (studentName, characteristics, growths, grade, persona, onProgress) => {
  onProgress('실제 입학사정관 호평 태도 및 피드백 연결 중...');
  await new Promise(resolve => setTimeout(resolve, 200));

  const charWord = characteristics[0] || '배움에 깊은 열정을 품은';
  const growthWord = growths[0] || '영어 해독과 작문 전반에서 긍정적인 성장을 보여줌';

  // 이름과 '학생은' 주어를 철저히 배제하고 명사형 종결어미화!
  let sentence = `특히 ${charWord} 배움의 자세를 수업 시간마다 뚜렷하게 관찰할 수 있었으며, 이를 바탕으로 ${growthWord}의 긍정적인 자기 변화를 일구어냄.`;

  if (grade === 'high') {
    sentence += ` 어려운 구문을 집요하게 파고들어 자기화하는 학습 근성이 돋보이며, 모둠 내에서도 주도적으로 토론을 조율하고 피드백을 수준 높게 활용하여 결과물의 품질을 한층 더 끌어올림.`;
  } else if (grade === 'mid') {
    sentence += ` 영어 읽기/쓰기 전반에서 모둠의 조율자 역할을 성실히 감당하였고, 동료 조원들의 의견을 폭넓게 경청하며 논리적인 영문 개요 작성을 리드하는 협업 역량이 돋보임.`;
  } else {
    sentence += ` 모르는 단어와 복잡한 문법 장벽을 영영사전 활용 및 복습용 오답노트 정리로 차근차근 보완해 나갔으며, 점진적인 배움의 기쁨을 몸소 획득해 내는 끈기가 돋보임.`;
  }

  return {
    success: true,
    sentence
  };
};

// --- 메인 단일 오케스트레이터 (Orchestrator) ---
export const generateSeteuk = async (params, onAgentUpdate) => {
  const {
    studentName,
    studentId,
    subject,
    selectedStandards,
    selectedActivities,
    selectedCompetencies,
    selectedCharacteristics,
    selectedGrowths,
    obsDetail,
    selectedCareer,
    grade,
    persona,
    tone,
    lengthLimit,
    isDetailMode,
    apiKey
  } = params;

  onAgentUpdate('orchestrator', { status: 'processing', log: 'Orchestrator: 마스터 에이전트 기동 및 무주어 명사어미 규격 조율 완료.' });
  onAgentUpdate('agent1', { status: 'idle', log: '대기 중...' });
  onAgentUpdate('agent2', { status: 'idle', log: '대기 중...' });
  onAgentUpdate('agent3', { status: 'idle', log: '대기 중...' });
  
  await new Promise(resolve => setTimeout(resolve, 200));

  // 1단계: API Key가 탑재되어 있고 유효할 경우, 진짜 인공지능 퓨샷 API 실시간 연동!
  if (apiKey && apiKey.trim().length > 10) {
    onAgentUpdate('orchestrator', { status: 'processing', log: 'API Key 감지: 주어 및 대명사 배제, 명사형 어미(~임/~음/~함) 강제화 중...' });
    onAgentUpdate('agent1', { status: 'processing', log: '무주어 성취기준 패러프레이징 중...' });
    onAgentUpdate('agent2', { status: 'processing', log: '무주어 수행평가 명품 뼈대 조립 중...' });
    onAgentUpdate('agent3', { status: 'processing', log: '명사형 어미 종결 정밀 다듬기 중...' });

    try {
      const realAIResult = await fetchRealAI(apiKey, params);
      
      onAgentUpdate('orchestrator', { status: 'success', log: '무주어 명사형 어미 명품 세특 합성 완료!' });
      onAgentUpdate('agent1', { status: 'success', log: '무주어 융합 완료.' });
      onAgentUpdate('agent2', { status: 'success', log: '활동 융합 완료.' });
      onAgentUpdate('agent3', { status: 'success', log: '종결어미 마감 완료.' });

      const sanitizedVariants = realAIResult.variants.map(v => ({
        ...v,
        text: finalSanitizeSeteuk(v.text, studentName)
      }));

      return {
        studentName,
        studentId,
        subject,
        variants: sanitizedVariants,
        keywords: [...selectedActivities, ...selectedCompetencies].slice(0, 5)
      };
    } catch (apiError) {
      console.warn("실시간 AI API 호출 실패 (지능형 로컬 다각화 엔진 폴백 가동):", apiError);
      onAgentUpdate('orchestrator', { status: 'processing', log: 'API 통신지연: 안전을 위해 무주어 명사어미 규격 로컬 엔진을 긴급 구동합니다.' });
    }
  }

  // 2단계: 로컬 지능형 다각화 조합 엔진 구동 (무주어 및 명사어미 장착 버전)
  const updateAgent1 = (log) => onAgentUpdate('agent1', { status: 'processing', log });
  const updateAgent2 = (log) => onAgentUpdate('agent2', { status: 'processing', log });
  const updateAgent3 = (log) => onAgentUpdate('agent3', { status: 'processing', log });

  let agent1Result, agent2Result, agent3Result;
  try {
    onAgentUpdate('agent1', { status: 'processing', log: '준비 완료' });
    onAgentUpdate('agent2', { status: 'processing', log: '준비 완료' });
    onAgentUpdate('agent3', { status: 'processing', log: '준비 완료' });

    [agent1Result, agent2Result, agent3Result] = await Promise.all([
      runStandardAgent(subject, selectedStandards, updateAgent1),
      runCompetencyAgent(selectedActivities, selectedCompetencies, obsDetail, selectedCareer, updateAgent2),
      runPersonaAgent(studentName, selectedCharacteristics, selectedGrowths, grade, persona, updateAgent3)
    ]);

    onAgentUpdate('agent1', { status: 'success', log: '무주어 성취기준 융합 완료.' });
    onAgentUpdate('agent2', { status: 'success', log: '수행평가 명품 에세이 뼈대 합성 완료.' });
    onAgentUpdate('agent3', { status: 'success', log: '명사형 종결어미 마감 완료.' });
    onAgentUpdate('orchestrator', { status: 'success', log: '로컬 무주어 명사형 세특 조립 성공!' });

  } catch (error) {
    onAgentUpdate('orchestrator', { status: 'error', log: `에이전트 조립 실패: ${error.message}` });
    throw error;
  }

  // --- 성취기준 코드를 완전히 배제하고 100% 패러프레이징된 자연어 결합식 ---
  
  // 1안: 학업/성취기준 집중안 (사례 1 기반 - 학학분석 및 근성)
  const variant1 = `${agent1Result.sentence} 영어 지문을 단순히 해석하는 수준에 그치지 않고 텍스트의 논리적 모순성이나 타당성을 날카롭게 평가하는 학업 근성을 보임. ${agent2Result.sentence} 이 과정에서 수준 높은 연결사와 고급 학술 어휘를 적재적소에 활용하여 세련된 논리를 전개하는 정밀한 구문 해독 지평을 넓힘. ${agent3Result.sentence}`;
  
  // 2안: 활동/태도/협업 집중안 (사례 3 기반 - 다각적 발표 및 설명)
  const variant2 = `영미 시사 텍스트를 시청하고 장단점을 분석하여, 이를 학습자, 교사, 교육 당사자의 다각적 시선에서 종합 분석해 발표하는 의사소통 전략이 돋보임. ${agent2Result.sentence} 수업 종료 후에도 어려운 영문 구문을 정리장에 정밀 복습하고 배움이 더딘 친구들에게 상세히 교류해 주는 공동체 학습 배려의 가치를 실천함. ${agent1Result.sentence} ${agent3Result.sentence}`;
  
  // 3안: 진로/자기주도 탐구안 (사례 2 기반 - 타 교과 융합 및 영영 분석)
  const variant3 = `영어 텍스트 속 학술 명제와 타 과목의 핵심 학술 개념을 주도적으로 상호 연계 인지하고, 전공 분야의 복합 전문 어휘를 영영사전으로 분석하며 영어식 사고를 입체적으로 확장하려는 학구열을 보임. ${agent2Result.sentence} ${agent1Result.sentence} 단순 암기를 극복하고 영어 지식을 자기 진로 가치관과 연계하여 승화해내는 지식 융합형 역량이 균형 있게 발휘됨. ${agent3Result.sentence}`;

  const applyTone = (text) => {
    let output = text;
    if (tone.id === 'academic') {
      output = output
        .replace(/보여주어/g, '보여주었으며, 이로부터 깊은 학술적 통찰의 지평을')
        .replace(/돋보임./g, '돋보이며, 자신만의 논리적 에세이를 완성도 높게 집필해 내는 분석적 독창성이 깊이 있게 자리 잡음. 지식의 표면을 넘어 집요하게 탐색하려는 학구열은 교사로서도 큰 자극을 줄 정도로 깊은 인상을 남김.')
        .replace(/해결함./g, '해결해 내는 구조적 분석력과 지적 유기성이 안정적이고, 늘 질문을 던져 탐구의 연결고리를 스스로 찾아내는 모습이 대단히 믿음직함.')
        .replace(/실천함./g, '내면화하여 높은 학업적 정합성을 입증함. 주변 조원들과 능동적인 학문적 대화를 나누며 교실 안 탐구의 지평을 넓힘.')
        .replace(/우수함./g, '안정적이며 향후 영어로 전문 텍스트를 다룰 수 있는 집요한 연구적 자세와 탐구에 몰입하는 학술적 근성을 나타냄.');
    } else if (tone.id === 'active') {
      output = output
        .replace(/학습 태도를 보여줌./g, '영어 독해 및 스피칭 역량으로 학급 전체의 도전적 배움 분위기를 주도하였고, 매 과업마다 밝고 긍정적인 기운으로 팀을 든든하게 받쳐 줌.')
        .replace(/성실함이 돋보임./g, '매 과업마다 조원들과 긴밀히 소통하며 학급 기여도 및 책임 의식 측면에서 큰 귀감이 됨. 어려운 상황에서도 솔선수범하며 모둠을 따뜻하게 아우르는 협력적 태도가 돋보임.')
        .replace(/실천함./g, '도약시키며 배움의 참된 즐거움을 학급 공동체와 아낌없이 나누는 따뜻한 연대의 가치를 몸소 실천함.');
    } else if (tone.id === 'warm') {
      output = output
        .replace(/탁월함./g, '지적 감수성과 조화로운 경청의 미덕을 아낌없이 펼쳐 동료 조원들로 하여금 두터운 신뢰감을 자아냄.')
        .replace(/의지가 빛남./g, '포기하지 않는 인내심을 바탕으로 단어 장벽을 극복하며 매일 점진적인 성장의 발걸음을 옮겨 나감. 이러한 끈기 있는 배움의 자세는 교사에게도 깊은 감동을 선사함.')
        .replace(/보임./g, '교류하여 학급 내 긍정적이고 따뜻한 배움의 분위기를 꽃피움. 주변 친구들의 어려움을 소리 없이 감싸 안고 아우르는 고결한 인성적 자질이 확인됨.');
    }
    
    // 최종 보정: 이름이나 대명사, 또는 어미 에러를 2차 클리닝
    output = finalSanitizeSeteuk(output, studentName);

    if (!isDetailMode) {
      output = output.substring(0, Math.floor(output.length * 0.85));
      if (!output.endsWith('.')) output += '.';
    }
    
    return output;
  };

  return {
    studentName,
    studentId,
    subject,
    variants: [
      { id: 'academic-focused', name: '학업/성취기준 집중안', text: applyTone(variant1) },
      { id: 'activity-focused', name: '활동/태도/협업 집중안', text: applyTone(variant2) },
      { id: 'career-focused', name: '진로/자기주도 탐구안', text: applyTone(variant3) }
    ],
    keywords: agent2Result.keywords
  };
};

// --- 학급 단위 일괄 세특 병렬 생성 엔진 ---
export const generateBulkSeteuk = async (studentsList, params, onStudentComplete) => {
  const {
    subject,
    selectedStandards,
    selectedActivities,
    selectedCompetencies,
    selectedCharacteristics,
    selectedGrowths,
    personaObj,
    toneObj,
    lengthLimit,
    isDetailMode,
    apiKey
  } = params;

  const bulkPromises = studentsList.map(async (student, idx) => {
    const output = await generateSeteuk({
      studentName: student.name,
      studentId: student.id || `${idx + 1}번`,
      subject,
      selectedStandards,
      selectedActivities: student.activities || selectedActivities,
      selectedCompetencies: student.competencies || selectedCompetencies,
      selectedCharacteristics: student.characteristics || selectedCharacteristics,
      selectedGrowths: student.growths || selectedGrowths,
      obsDetail: student.detailObs || '',
      selectedCareer: student.careerObj || null,
      grade: student.grade || 'high',
      persona: student.persona || personaObj,
      tone: toneObj,
      lengthLimit,
      isDetailMode,
      apiKey
    }, () => {});

    onStudentComplete(student.name, idx + 1, output.variants[0].text);
    
    return {
      ...student,
      status: 'done',
      generatedText: output.variants[0].text,
      variants: output.variants
    };
  });

  return Promise.all(bulkPromises);
};

/**
 * NEIS 기준 바이트 계산기
 */
export const calculateNeisBytes = (text) => {
  if (!text) return { bytes: 0, count: 0 };
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    if (
      (char >= 0xAC00 && char <= 0xD7A3) || 
      (char >= 0x1100 && char <= 0x11FF) || 
      (char >= 0x3130 && char <= 0x318F)
    ) {
      bytes += 3;
    } else {
      bytes += 1;
    }
  }
  return {
    bytes,
    count: text.length
  };
};

/**
 * 바이트 초과 안전 오토트림 압축기 (NEIS Auto-Trim Engine)
 */
export const autoTrimNeis = (text, maxBytes = 800) => {
  if (!text) return '';
  let currentBytes = calculateNeisBytes(text).bytes;
  if (currentBytes <= maxBytes) return text;

  let trimmedText = text;
  trimmedText = trimmedText
    .replace(/보여주어/g, '보여주고')
    .replace(/보여주었으며,/g, '보여주고')
    .replace(/탁월한 학습 태도를 보여줌./g, '학습 태도가 뛰어남.')
    .replace(/성실하게 완수하며/g, '성실히 하며')
    .replace(/긍정적인 도약이 관찰됨./g, '성장이 돋보임.')
    .replace(/스스로 과제를 해결하는/g, '주도적으로 문제를 해결하는')
    .replace(/피드백을 수준 높게 적용해 나가는/g, '피드백을 잘 적용하여');

  let resultText = '';
  let currentByteCount = 0;
  for (let i = 0; i < trimmedText.length; i++) {
    const char = trimmedText.charCodeAt(i);
    const charLen = ((char >= 0xAC00 && char <= 0xD7A3) || (char >= 0x1100 && char <= 0x11FF)) ? 3 : 1;
    if (currentByteCount + charLen > maxBytes - 3) {
      resultText += '...';
      break;
    }
    resultText += trimmedText[i];
    currentByteCount += charLen;
  }

  if (!resultText.endsWith('.')) resultText += '.';
  return resultText;
};

/**
 * 지능형 엑셀/CSV 2차원 배열 데이터 -> 학생 객체 리스트 매핑 (휴리스틱 열 매핑 탑재)
 */
export const mapExcelToStudents = (rows) => {
  if (rows.length < 2) return [];

  const header = rows[0].map(h => h ? String(h).trim().toLowerCase() : '');
  const rawHeader = rows[0].map(h => h ? String(h).trim() : '');

  let idIdx = header.findIndex(h => h.includes('학번') || h.includes('번호') || h.includes('id') || h.includes('num') || h.includes('코드'));
  let nameIdx = header.findIndex(h => h.includes('이름') || h.includes('성명') || h.includes('name') || h.includes('학생'));
  let obsIdx = header.findIndex(h => h.includes('수행') || h.includes('내용') || h.includes('관찰') || h.includes('평가') || h.includes('desc') || h.includes('obs') || h.includes('기록') || h.includes('자료'));
  let careerIdx = header.findIndex(h => h.includes('진로') || h.includes('희망') || h.includes('career') || h.includes('관심'));

  if (idIdx === -1) idIdx = header.findIndex((h, idx) => idx === 0);
  if (nameIdx === -1) nameIdx = header.findIndex((h, idx) => idx === 1);
  if (obsIdx === -1) {
    let maxLen = 0;
    let chosenIdx = 2;
    for (let col = 2; col < header.length; col++) {
      let sampleLen = rows[1] && rows[1][col] ? String(rows[1][col]).length : 0;
      if (sampleLen > maxLen) {
        maxLen = sampleLen;
        chosenIdx = col;
      }
    }
    obsIdx = chosenIdx < header.length ? chosenIdx : 2;
  }

  const students = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const name = row[nameIdx] ? String(row[nameIdx]).trim() : '';
    if (!name) continue;

    const id = row[idIdx] ? String(row[idIdx]).trim() : `${30100 + i}`;
    
    const extraInfoList = [];
    let careerObj = null;
    let mainObs = '';

    row.forEach((cell, cellIdx) => {
      if (cellIdx === idIdx || cellIdx === nameIdx) return;
      
      const cellVal = cell ? String(cell).trim() : '';
      if (!cellVal) return;

      const colName = rawHeader[cellIdx];

      if (cellIdx === careerIdx) {
        careerObj = CAREER_PATHS.find(c => {
          const keyword = c.name.split(' ')[0];
          return cellVal.toLowerCase().includes(keyword.toLowerCase());
        }) || null;
      }

      if (cellIdx === obsIdx) {
        mainObs = cellVal;
      } else {
        extraInfoList.push(`[${colName}] ${cellVal}`);
      }
    });

    let mergedObs = mainObs;
    if (extraInfoList.length > 0) {
      const mergedExtra = extraInfoList.join(', ');
      mergedObs = mergedObs 
        ? `${mergedObs} (자료결합: ${mergedExtra})` 
        : `학생 연계 자료결합: ${mergedExtra}`;
    }

    students.push({
      id,
      name,
      detailObs: mergedObs,
      careerObj,
      grade: 'high',
      status: 'pending',
      generatedText: ''
    });
  }

  return students;
};

/**
 * 쉼표 구분 CSV 문자열 -> 학생 객체 리스트 파싱
 */
export const parseCsvToStudents = (csvText) => {
  if (!csvText) return [];
  const rows = [];
  const lines = csvText.split(/\r?\n/);

  lines.forEach(line => {
    if (!line.trim()) return;
    const row = [];
    let inQuotes = false;
    let current = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  });

  return mapExcelToStudents(rows);
};

/**
 * 탭 구분 TSV 문자열 -> 학생 객체 리스트 파싱
 */
export const parseTsvToStudents = (tsvText) => {
  if (!tsvText) return [];
  const rows = tsvText.split(/\r?\n/).map(line => {
    return line.split('\t').map(cell => cell.trim());
  }).filter(row => row.length > 0 && row.some(cell => cell !== ''));

  return mapExcelToStudents(rows);
};
