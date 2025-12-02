/**
 * OpenAI API 테스트 스크립트
 * - API 키가 올바르게 설정되어 있는지 확인
 * - gpt-4o-mini 모델이 정상 작동하는지 테스트
 */

require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runTest() {
  try {
    console.log('🧪 OpenAI API 테스트 시작...');
    console.log(`📝 API 키: ${process.env.OPENAI_API_KEY ? '설정됨' : '❌ 설정 안 됨'}`);
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
      console.error('   backend/.env 파일에 OPENAI_API_KEY=your-api-key 를 추가하세요.');
      process.exit(1);
    }

    console.log('📤 API 호출 중...');
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: '타입스크립트에서도 되지?' }
      ],
    });

    console.log('✅ API 호출 성공!');
    console.log('📥 응답:', res.choices[0]?.message?.content);
    console.log('\n✅ OpenAI API가 정상적으로 작동합니다!');
  } catch (error) {
    console.error('❌ OpenAI API 호출 실패:', error.message);
    if (error.status === 401) {
      console.error('   API 키가 올바르지 않습니다. OPENAI_API_KEY를 확인하세요.');
    } else if (error.status === 429) {
      console.error('   API 할당량이 초과되었거나 결제 정보를 확인해야 합니다.');
    } else {
      console.error('   오류 상세:', error);
    }
    process.exit(1);
  }
}

runTest();

