/**
 * MongoDB 데이터베이스 연결 설정
 */
const mongoose = require('mongoose');

// MongoDB 연결 문자열
// 데이터베이스 이름을 포함해야 합니다 (예: /sajumonoo)
// 사용자가 제공한 URL: mongodb+srv://leechangbok:15798042@cluster0.k5wiwco.mongodb.net/?appName=Cluster0
// 데이터베이스 이름 추가 필요: /sajumonoo (또는 원하는 데이터베이스 이름)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://leechangbok:15798042@cluster0.k5wiwco.mongodb.net/sajumonoo?retryWrites=true&w=majority&appName=Cluster0';

/**
 * MongoDB 연결
 */
async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      // MongoDB Atlas 연결 옵션
      // useNewUrlParser와 useUnifiedTopology는 기본적으로 true이므로 생략 가능
    });
    
    console.log('✅ MongoDB 연결 성공');
    console.log(`📊 데이터베이스: ${mongoose.connection.name}`);
    
    // 연결 이벤트 리스너
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB 연결 오류:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB 연결이 끊어졌습니다.');
    });
    
    // 프로세스 종료 시 연결 종료
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB 연결이 종료되었습니다.');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    throw error;
  }
}

module.exports = { connectDatabase };

