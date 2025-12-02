/**
 * 궁합문어 백엔드 서버
 * Node.js + Express + MongoDB
 */

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

// MongoDB 연결
const { connectDatabase } = require('./config/database');

// 모델 import
const User = require('./models/User');
const UserInput = require('./models/UserInput');
const CompatibilityResult = require('./models/CompatibilityResult');
const AIAdviceRequest = require('./models/AIAdviceRequest');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '궁합문어 백엔드 서버가 실행 중입니다.' });
});

// Python 환경 체크 API (배포 환경 디버깅용)
app.get('/api/check-python-env', async (req, res) => {
  try {
    const isWindows = process.platform === 'win32';
    const pythonCommand = isWindows ? 'python' : 'python3';
    const pythonScriptPath = path.join(__dirname, 'calculate.py');
    
    const checks = {
      platform: process.platform,
      pythonCommand: pythonCommand,
      scriptPath: pythonScriptPath,
      workingDirectory: __dirname,
      checks: {},
    };
    
    // Python 버전 확인
    try {
      const { stdout: pythonVersion } = await execAsync(`${pythonCommand} --version`, { shell: true });
      checks.checks.python = { installed: true, version: pythonVersion.trim() };
    } catch (error) {
      checks.checks.python = { installed: false, error: error.message };
    }
    
    // 필수 패키지 확인
    const packages = ['numpy', 'tensorflow'];
    for (const pkg of packages) {
      try {
        const { stdout } = await execAsync(`${pythonCommand} -c "import ${pkg}; print(${pkg}.__version__)"`, { shell: true });
        checks.checks[pkg] = { installed: true, version: stdout.trim() };
      } catch (error) {
        checks.checks[pkg] = { installed: false, error: error.message };
      }
    }
    
    // 모델 파일 확인
    const modelFiles = ['sky3000.h5', 'earth3000.h5', 'cal.csv', 'calculate.py'];
    checks.checks.files = {};
    modelFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      const exists = fs.existsSync(filePath);
      checks.checks.files[file] = exists;
      if (exists) {
        const stats = fs.statSync(filePath);
        checks.checks.files[file] = { exists: true, size: stats.size };
      } else {
        checks.checks.files[file] = { exists: false };
      }
    });
    
    res.json({
      success: true,
      data: checks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Python 환경 체크 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// 궁합 결과 저장 API
app.post('/api/compatibility-result', async (req, res) => {
  try {
    const { userId, userInputId, score, explanation, saju1, saju2, salAnalysis } = req.body;

    // 입력값 검증
    if (score === undefined || !explanation || !saju1 || !saju2) {
      return res.status(400).json({
        success: false,
        message: '필수 데이터가 누락되었습니다.',
      });
    }

    // 궁합 결과 저장
    const compatibilityResult = new CompatibilityResult({
      userId: userId || null, // TODO: JWT 토큰에서 추출
      userInputId: userInputId || null,
      score,
      explanation,
      saju1,
      saju2,
      salAnalysis: salAnalysis || [],
    });

    await compatibilityResult.save();

    res.json({
      success: true,
      data: {
        id: compatibilityResult._id.toString(),
        score: compatibilityResult.score,
        explanation: compatibilityResult.explanation,
        createdAt: compatibilityResult.createdAt,
      },
    });
  } catch (error) {
    console.error('궁합 결과 저장 오류:', error);
    res.status(500).json({
      success: false,
      message: '궁합 결과 저장 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// 사용자 정보 입력 API (두 명의 정보를 백엔드에 저장)
app.post('/api/user-input', async (req, res) => {
  try {
    const { userId, user1, user2 } = req.body;

    // 입력값 검증
    if (!user1 || !user2 || !user1.name || !user1.birthDate || !user1.gender ||
        !user2.name || !user2.birthDate || !user2.gender) {
      return res.status(400).json({
        success: false,
        message: '필수 정보가 누락되었습니다.',
      });
    }

    // 사용자 정보 저장
    const userInput = new UserInput({
      userId: userId || null, // TODO: JWT 토큰에서 추출
      user1: {
        name: user1.name,
        birthDate: user1.birthDate,
        birthTime: user1.birthTime || '',
        gender: user1.gender,
      },
      user2: {
        name: user2.name,
        birthDate: user2.birthDate,
        birthTime: user2.birthTime || '',
        gender: user2.gender,
      },
    });

    await userInput.save();

    res.json({
      success: true,
      data: {
        id: userInput._id.toString(),
        user1: userInput.user1,
        user2: userInput.user2,
        createdAt: userInput.createdAt,
      },
    });
  } catch (error) {
    console.error('사용자 정보 입력 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 정보 저장 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// AI 조언 API
app.post('/api/ai-advice', async (req, res) => {
  try {
    // userId는 헤더 또는 body에서 가져오기
    const userId = req.headers['x-user-id'] || req.body.userId || null;
    const { compatibilityResultId, score, explanation, salAnalysis, user1, user2, saju1, saju2 } = req.body;

    // 입력값 검증
    if (score === undefined || !explanation) {
      return res.status(400).json({
        success: false,
        message: '필수 데이터가 누락되었습니다.',
      });
    }

    // OpenAI API 키 확인
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      // OpenAI API 키가 없으면 기본 조언 반환
      return res.json({
        success: true,
        data: {
          advice: getDefaultAdvice(score, explanation, salAnalysis),
          tips: getDefaultTips(score),
          summary: `궁합 점수 ${score}점입니다.`,
        },
      });
    }

    // OpenAI API 호출
    try {
      const { OpenAI } = require('openai');
      const openai = new OpenAI({ apiKey: openaiApiKey });

      const prompt = generatePrompt({ score, explanation, salAnalysis, user1, user2 });

      console.log('🤖 OpenAI API 호출 시작...');
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '당신은 사주 팔자 전문가입니다. 궁합 결과를 분석하여 실용적이고 긍정적인 조언을 제공합니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const advice = response.choices[0]?.message?.content || '';
      console.log('✅ OpenAI API 호출 성공');

      // 응답 파싱
      const parsedResponse = parseAIResponse(advice);

      // AI 조언 요청 저장
      try {
        const aiAdviceRequest = new AIAdviceRequest({
          userId: userId || null, // TODO: JWT 토큰에서 추출
          compatibilityResultId: compatibilityResultId || null,
          score,
          explanation,
          salAnalysis: salAnalysis || [],
          aiAdvice: parsedResponse,
        });
        await aiAdviceRequest.save();
        console.log('✅ AI 조언 요청이 데이터베이스에 저장되었습니다.');
      } catch (dbError) {
        console.error('AI 조언 요청 저장 오류:', dbError);
        // 저장 실패해도 응답은 반환
      }

      res.json({
        success: true,
        data: parsedResponse,
      });
    } catch (openaiError) {
      console.error('❌ OpenAI API 호출 실패:', openaiError.message);
      console.error('   오류 상세:', openaiError);
      
      // 429 오류 (할당량 초과) 또는 기타 오류 시 기본 조언 반환
      if (openaiError.status === 429) {
        console.error('⚠️ OpenAI API 할당량 초과 또는 결제 정보 확인 필요');
      }
      
      return res.json({
        success: true,
        data: {
          advice: getDefaultAdvice(score, explanation, salAnalysis),
          tips: getDefaultTips(score),
          summary: `궁합 점수 ${score}점입니다.`,
        },
      });
    }
  } catch (error) {
    console.error('AI 조언 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: 'AI 조언 생성 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// 인증 API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 입력값 검증
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일과 비밀번호를 입력해주세요.',
      });
    }

    // 데이터베이스에서 사용자 확인
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '등록되지 않은 이메일입니다.',
      });
    }

    // 비밀번호 확인 (TODO: bcrypt로 해시 비교 필요)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: '비밀번호가 올바르지 않습니다.',
      });
    }

    res.json({
      success: true,
      token: `token-${user._id}`, // TODO: JWT 토큰 생성 필요
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 입력값 검증
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일과 비밀번호를 입력해주세요.',
      });
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '이미 등록된 이메일입니다.',
      });
    }

    // 새 사용자 생성 (비밀번호는 평문 저장 - 실제로는 해시화 필요)
    const newUser = new User({
      email: email.toLowerCase().trim(),
      password, // TODO: bcrypt로 해시화 필요
      name: name || email.split('@')[0],
      profile: {
        name: '',
        birthDate: '',
        birthTime: '',
        gender: '',
      },
    });

    await newUser.save();

    res.json({
      success: true,
      token: `token-${newUser._id}`, // TODO: JWT 토큰 생성 필요
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    console.error('에러 스택:', error.stack);
    res.status(500).json({
      success: false,
      message: '회원가입 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

app.get('/api/auth/profile', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']; // TODO: JWT 토큰에서 추출 필요

    // 임시: userId가 없으면 첫 번째 사용자 사용 (개발용)
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne();
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '프로필 조회 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

app.put('/api/auth/profile', async (req, res) => {
  try {
    const { name, birthDate, birthTime, gender } = req.body;
    const userId = req.headers['x-user-id']; // TODO: JWT 토큰에서 추출 필요

    // 임시: userId가 없으면 첫 번째 사용자 사용 (개발용)
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne();
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    // 프로필 업데이트
    user.profile = {
      name: name || user.profile?.name || '',
      birthDate: birthDate || user.profile?.birthDate || '',
      birthTime: birthTime || user.profile?.birthTime || '',
      gender: gender || user.profile?.gender || '',
    };

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '프로필 업데이트 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// 사주 궁합 계산 API (Python TensorFlow 모델 사용)
app.post('/api/calculate-compatibility', async (req, res) => {
  try {
    const { person0, person1, gender0, gender1 } = req.body;

    // 입력값 검증
    if (!person0 || !person1 || !Array.isArray(person0) || !Array.isArray(person1)) {
      return res.status(400).json({
        success: false,
        message: 'person0와 person1 배열이 필요합니다.',
      });
    }

    if (person0.length !== 6 || person1.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'person0와 person1은 각각 6개의 요소(년간, 년지, 월간, 월지, 일간, 일지)를 가져야 합니다.',
      });
    }

    // Python 스크립트에 전달할 데이터 준비
    const inputData = {
      person0: person0, // [년간, 년지, 월간, 월지, 일간, 일지]
      person1: person1,
      gender0: gender0 === '남자' || gender0 === 'male' || gender0 === 1 ? 1 : 0,
      gender1: gender1 === '남자' || gender1 === 'male' || gender1 === 1 ? 1 : 0,
    };
    
    // 디버깅: 입력 데이터 로그
    console.log('🔍 Python 스크립트 입력 데이터:', JSON.stringify(inputData, null, 2));

    // Python 스크립트 경로
    const pythonScriptPath = path.join(__dirname, 'calculate.py');
    
    // Windows와 Linux/Mac 모두 지원
    const isWindows = process.platform === 'win32';
    const pythonCommand = isWindows ? 'python' : 'python3';
    
    // Python 스크립트 실행
    try {
      // JSON 데이터를 임시 파일로 저장하여 전달 (Windows echo 문제 해결)
      const tmpFilePath = path.join(os.tmpdir(), `calculate-input-${Date.now()}.json`);
      
      // 임시 파일에 JSON 데이터 저장
      fs.writeFileSync(tmpFilePath, JSON.stringify(inputData), 'utf8');
      
      // Python 스크립트 실행 (stdin으로 파일 내용 전달)
      const command = isWindows
        ? `type "${tmpFilePath}" | ${pythonCommand} "${pythonScriptPath}"`
        : `cat "${tmpFilePath}" | ${pythonCommand} "${pythonScriptPath}"`;
      
      const { stdout, stderr } = await execAsync(command, {
        cwd: __dirname, // 백엔드 디렉토리에서 실행 (모델 파일 위치)
        maxBuffer: 10 * 1024 * 1024, // 10MB 버퍼
        shell: true, // Windows에서도 동작하도록
      });
      
      // 임시 파일 삭제
      try {
        fs.unlinkSync(tmpFilePath);
      } catch (unlinkError) {
        // 파일 삭제 실패는 무시
      }

      // stderr에 오류가 있으면 로그 출력 (DEBUG 메시지 포함)
      if (stderr && !stderr.includes('WARNING')) {
        console.error('⚠️ Python 스크립트 경고:', stderr);
      }
      
      // DEBUG 메시지도 로그 출력
      if (stderr && stderr.includes('DEBUG:')) {
        console.log('🔍 Python 디버그 정보:', stderr);
      }
      
      // stdout이 비어있거나 JSON 파싱 실패 시 오류 처리
      if (!stdout || !stdout.trim()) {
        console.error('❌ Python 스크립트 출력이 비어있습니다.');
        console.error('   stderr:', stderr);
        throw new Error('Python 스크립트가 출력을 생성하지 않았습니다.');
      }

      let result;
      try {
        result = JSON.parse(stdout.trim());
      } catch (parseError) {
        console.error('❌ Python 출력 파싱 실패:', stdout);
        throw new Error(`Python 출력 파싱 실패: ${parseError.message}`);
      }

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error || '계산 중 오류가 발생했습니다.',
        });
      }

      // 살 값 확인 및 경고
      const sal0 = result.data?.sal0 || [];
      const sal1 = result.data?.sal1 || [];
      const sal0Sum = sal0.reduce((a, b) => a + b, 0);
      const sal1Sum = sal1.reduce((a, b) => a + b, 0);
      
      if (sal0Sum === 0 && sal1Sum === 0) {
        console.warn('⚠️ 경고: 모든 살 값이 0입니다. 입력 데이터를 확인하세요.');
        console.warn(`   입력 데이터: person0=${JSON.stringify(person0)}, person1=${JSON.stringify(person1)}, gender0=${gender0}, gender1=${gender1}`);
      }

      // 궁합 결과 저장 (추가 정보가 있는 경우)
      // 주의: 이 API는 Python 스크립트 결과만 반환하므로, 
      // 실제 사주 정보와 사용자 정보는 프론트엔드에서 별도로 저장 API를 호출해야 함
      
      // 성공 응답
      res.json({
        success: true,
        data: result.data,
      });
    } catch (execError) {
      console.error('❌ Python 실행 오류:', execError.message);
      console.error('   상세 오류:', execError);
      console.error('   오류 코드:', execError.code);
      console.error('   오류 신호:', execError.signal);
      console.error('   Python 명령어:', pythonCommand);
      console.error('   스크립트 경로:', pythonScriptPath);
      console.error('   작업 디렉토리:', __dirname);
      console.error('   플랫폼:', process.platform);
      
      // Python 환경 체크
      try {
        const { stdout: pythonVersion } = await execAsync(`${pythonCommand} --version`, { shell: true });
        console.error('   Python 버전:', pythonVersion);
      } catch (versionError) {
        console.error('   ⚠️ Python이 설치되어 있지 않거나 PATH에 없습니다.');
      }
      
      // 모델 파일 존재 확인
      const modelFiles = ['sky3000.h5', 'earth3000.h5', 'cal.csv'];
      modelFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        const exists = fs.existsSync(filePath);
        console.error(`   ${file}: ${exists ? '✅ 존재' : '❌ 없음'}`);
      });
      
      // Python이 설치되지 않았거나 모델 파일이 없는 경우 기본값 반환
      // 하지만 오류 정보를 포함하여 반환
      return res.json({
        success: true,
        data: {
          originalScore: 100,
          finalScore: 100,
          sal0: [0, 0, 0, 0, 0, 0, 0, 0],
          sal1: [0, 0, 0, 0, 0, 0, 0, 0],
          fallback: true, // 기본값 사용 표시
          error: execError.message, // 오류 메시지 포함
          errorCode: execError.code,
          errorSignal: execError.signal,
        },
      });
    }
  } catch (error) {
    console.error('궁합 계산 오류:', error);
    res.status(500).json({
      success: false,
      message: '궁합 계산 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// 프롬프트 생성 함수
function generatePrompt({ score, explanation, salAnalysis, user1, user2 }) {
  let prompt = `다음 사주 궁합 결과를 분석하여 조언을 해주세요:\n\n`;
  prompt += `궁합 점수: ${score}점\n`;
  prompt += `설명: ${explanation}\n\n`;

  if (salAnalysis && salAnalysis.length > 0) {
    prompt += `감점 요소 (살):\n`;
    salAnalysis.forEach((sal) => {
      prompt += `- ${sal.type}: ${sal.count}개 (${sal.description})\n`;
    });
    prompt += '\n';
  }

  prompt += `이용자 정보:\n`;
  prompt += `- ${user1?.name || '이용자1'} (${user1?.gender || '성별 불명'})\n`;
  prompt += `- ${user2?.name || '이용자2'} (${user2?.gender || '성별 불명'})\n\n`;

  prompt += `위 정보를 바탕으로 다음과 같은 형식으로 조언을 제공해주세요:\n`;
  prompt += `1. 전체적인 궁합 평가 (2-3문장)\n`;
  prompt += `2. 관계 유지 및 개선을 위한 구체적인 조언 (3-5가지)\n`;
  prompt += `3. 주의해야 할 점 (있다면)\n\n`;
  prompt += `한글로 답변하고, 긍정적이면서도 현실적인 조언을 제공해주세요.`;

  return prompt;
}

// AI 응답 파싱 함수
function parseAIResponse(response) {
  let advice = response.trim();
  const tips = [];
  const lines = response.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[0-9]+\.\s/.test(trimmed) || /^[-•]\s/.test(trimmed)) {
      const tip = trimmed.replace(/^[0-9]+\.\s/, '').replace(/^[-•]\s/, '').trim();
      if (tip.length > 0) {
        tips.push(tip);
      }
    }
  }

  const sentences = advice.split(/[.!?]\s+/);
  const summary = sentences.slice(0, 2).join('. ') + '.';

  return {
    advice,
    tips: tips.length > 0 ? tips : undefined,
    summary: summary.length < advice.length ? summary : undefined,
  };
}

// 기본 조언 함수
function getDefaultAdvice(score, explanation, salAnalysis) {
  if (score >= 80) {
    return '매우 좋은 궁합입니다! 서로를 이해하고 존중하는 마음으로 관계를 발전시켜 나가시기 바랍니다.';
  } else if (score >= 60) {
    return '무난한 궁합입니다. 서로 노력하면 좋은 관계를 유지할 수 있습니다.';
  } else if (score >= 40) {
    return '보통의 궁합입니다. 서로 이해하고 양보하면 관계를 발전시킬 수 있습니다.';
  } else {
    return '주의가 필요한 궁합입니다. 하지만 서로의 차이를 인정하고 소통하면 개선할 수 있습니다.';
  }
}

// 기본 팁 함수
function getDefaultTips(score) {
  if (score >= 80) {
    return [
      '서로의 감정을 공유하고 소통하는 시간을 자주 가지세요.',
      '서로의 취미나 관심사를 존중하고 지지해주세요.',
      '작은 감사 표현도 자주 하시면 관계가 더욱 돈독해집니다.',
    ];
  } else if (score >= 60) {
    return [
      '서로의 차이점을 인정하고 이해하려는 노력을 기울이세요.',
      '갈등이 생겼을 때는 감정보다 사실에 집중하여 대화하세요.',
      '공통 관심사를 찾아 함께 즐기는 시간을 늘려보세요.',
    ];
  } else {
    return [
      '서로의 말을 경청하고 상대방의 입장을 이해하려 노력하세요.',
      '작은 갈등이라도 미루지 말고 바로 해결하려는 자세가 중요합니다.',
      '서로의 시간과 공간을 존중하는 것이 필요합니다.',
    ];
  }
}

// 서버 시작
async function startServer() {
  try {
    // MongoDB 연결
    await connectDatabase();
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
      console.log(`📝 환경 변수 확인:`);
      console.log(`   - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '설정됨' : '설정 안 됨 (기본 조언 사용)'}`);
      console.log(`   - MONGODB_URI: ${process.env.MONGODB_URI ? '설정됨' : '기본값 사용'}`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

startServer();

