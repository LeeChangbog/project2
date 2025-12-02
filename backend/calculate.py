"""
사주 궁합 계산 Python 스크립트
TensorFlow 모델을 사용하여 기본 점수를 계산하고, 살 계산을 수행합니다.
"""

import sys
import json
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.metrics import MeanSquaredError

# 모델 파일 경로
MODEL_SKY_PATH = 'sky3000.h5'
MODEL_EARTH_PATH = 'earth3000.h5'
CALENDAR_FILE = 'cal.csv'

# 천간, 지지 매핑
sky = {'갑':1,'을':2,'병':3,'정':4,'무':5,'기':6,'경':7,'신':8,'임':9,'계':10}
earth = {'자':1,'축':2,'인':3,'묘':4,'진':5,'사':6,'오':7,'미':8,'신':9,'유':10,'술':11,'해':12}

# 살 계산 파라미터
p1=8
p11=9.5
p2=7
p21=8.2
p3=6
p31=7.2
p41 = 10
p42 = 8
p43 = 6
p5=8
p6=8
p7=0
p71=10
p8=0
p81=10
p82=6
p83=4

# 모델 로드 (전역 변수로 한 번만 로드)
model0 = None
model1 = None
calendar_data = None

def load_models():
    """모델을 로드합니다 (한 번만 실행)"""
    global model0, model1
    if model0 is None:
        try:
            model0 = load_model(MODEL_SKY_PATH, custom_objects={'mse': MeanSquaredError})
            model1 = load_model(MODEL_EARTH_PATH, custom_objects={'mse': MeanSquaredError})
        except Exception as e:
            print(f"모델 로드 실패: {e}", file=sys.stderr)
            return False
    return True

def load_calendar_data():
    """절기 데이터를 로드합니다"""
    global calendar_data
    if calendar_data is None:
        try:
            calendar_data = np.loadtxt(CALENDAR_FILE, delimiter=',', skiprows=1, encoding='euc-kr')
        except Exception as e:
            print(f"절기 데이터 로드 실패: {e}", file=sys.stderr)
            return False
    return True

def get_one_hot(target, nb_classes):
    """원-핫 인코딩"""
    t = np.array(target).reshape(-1)
    res = np.eye(nb_classes)[np.array(t).reshape(-1)]
    return res.reshape(list(t.shape)+[nb_classes])

def calculate_sky(i, j):
    """천간 계산 (TensorFlow 모델 사용)"""
    if model0 is None:
        return np.array([[50.0]])  # 기본값
    t0 = np.eye(10)[np.array(i-1).reshape(-1)]
    t0 = t0.flatten()
    t1 = np.eye(10)[np.array(j-1).reshape(-1)]
    t1 = t1.flatten()
    s = np.concatenate((t0, t1))
    s = s.reshape(1, 20)
    pred = model0.predict(s, verbose=0)
    return pred

def calculate_earth(i, j):
    """지지 계산 (TensorFlow 모델 사용)"""
    if model1 is None:
        return np.array([[50.0]])  # 기본값
    t0 = np.eye(12)[np.array(i-1).reshape(-1)]
    t0 = t0.flatten()
    t1 = np.eye(12)[np.array(j-1).reshape(-1)]
    t1 = t1.flatten()
    s = np.concatenate((t0, t1))
    s = s.reshape(1, 24)
    pred = model1.predict(s, verbose=0)
    return pred

def calculate(token0, token1, gender0, gender1, score):
    """살 계산 및 감점"""
    score = float(score)
    a1 = token0[1]  # person0 년지
    a2 = token0[3]  # person0 월지
    a3 = token0[5]  # person0 일지
    b1 = token1[1]  # person1 년지
    b2 = token1[3]  # person1 월지
    b3 = token1[5]  # person1 일지
    
    sal0 = [0,0,0,0,0,0,0,0]
    sal1 = [0,0,0,0,0,0,0,0]

    # 살 0 계산
    if a3==3:
        if a1==6 or a1==9:
            if gender0==1:
                score -= p1
                sal0[0] += p1
            else:
                score -= p11
                sal0[0] += p11
        if a2==6 or a2==9:
            if gender0==1:
                score -= p1
                sal0[0] += p1
            else:
                score -= p11
                sal0[0] += p11
    if a3==7:
        if a1==2 or a1==5 or a1==7:
            if gender0==1:
                score -= p1
                sal0[0] += p1
            else:
                score -= p11
                sal0[0] += p11
        if a2==2 or a2==5 or a2==7:
            if gender0==1:
                score -= p1
                sal0[0] += p1
            else:
                score -= p11
                sal0[0] += p11
    if a3==2:
        if a1==7 or a1==8 or a1==11:
            if gender0==1:
                score -= p1
                sal0[0] += p1
            else:
                score -= p11
                sal0[0] += p11
        if a2==7 or a2==8 or a2==11:
            if gender0==1:
                score -= p1
                sal0[0] += p1
            else:
                score -= p11
                sal0[0] += p11
    if b3==3:
        if b1==6 or b1==9:
            if gender1==1:
                score -= p1
                sal1[0] += p1
            else:
                score -= p11
                sal1[0] += p11
        if b2==6 or b2==9:
            if gender1==1:
                score -= p1
                sal1[0] += p1
            else:
                score -= p11
                sal1[0] += p11
    if b3==7:
        if b1==2 or b1==5 or b1==7:
            if gender1==1:
                score -= p1
                sal1[0] += p1
            else:
                score -= p11
                sal1[0] += p11
        if b2==2 or b2==5 or b2==7:
            if gender1==1:
                score -= p1
                sal1[0] += p1
            else:
                score -= p11
                sal1[0] += p11
    if b3==2:
        if b1==7 or b1==8 or b1==11:
            if gender1==1:
                score -= p1
                sal1[0] += p1
            else:
                score -= p11
                sal1[0] += p11
        if b2==7 or b2==8 or b2==11:
            if gender1==1:
                score -= p1
                sal1[0] += p1
            else:
                score -= p11
                sal1[0] += p11

    # 살 1 계산 (간소화 - 전체 로직은 원본 Python 코드 참조)
    # 여기서는 주요 로직만 포함
    
    # 살 2 계산 (인덱스 2에 저장)
    if (a1==1 and a2==10) or (a1==2 and a2==7) or (a1==3 and a2==8) or (a1==4 and a2==9) or (a1==5 and a2==12) or (a1==6 and a2==11) or (a1==10 and a2==1) or (a1==7 and a2==2) or (a1==8 and a2==3) or (a1==9 and a2==4) or (a1==12 and a2==5) or (a1==11 and a2==6):
        if gender0==1:
            score -= p2
            sal0[2] += p2  # 살 2는 인덱스 2에 저장
        else:
            score -= p21
            sal0[2] += p21  # 살 2는 인덱스 2에 저장
    if (b1==1 and b2==10) or (b1==2 and b2==7) or (b1==3 and b2==8) or (b1==4 and b2==9) or (b1==5 and b2==12) or (b1==6 and b2==11) or (b1==10 and b2==1) or (b1==7 and b2==2) or (b1==8 and b2==3) or (b1==9 and b2==4) or (b1==12 and b2==5) or (b1==11 and b2==6):
        if gender1==1:
            score -= p2
            sal1[2] += p2  # 살 2는 인덱스 2에 저장
        else:
            score -= p21
            sal1[2] += p21  # 살 2는 인덱스 2에 저장

    # 살 3 계산 (간소화)
    # 살 4 계산 (인덱스 4에 저장)
    t = abs(a3-a2)
    if t == 6:
        score -= p41
        sal0[4] += p41  # 살 4는 인덱스 4에 저장
    t = abs(a3-a1)
    if t == 6:
        score -= p42
        sal0[4] += p42  # 살 4는 인덱스 4에 저장
    t = abs(a1-a2)
    if t == 6:
        score -= p43
        sal0[4] += p43  # 살 4는 인덱스 4에 저장
    t = abs(b3-b2)
    if t == 6:
        score -= p41
        sal1[4] += p41  # 살 4는 인덱스 4에 저장
    t = abs(b3-b1)
    if t == 6:
        score -= p42
        sal1[4] += p42  # 살 4는 인덱스 4에 저장
    t = abs(b1-b2)
    if t == 6:
        score -= p43
        sal1[4] += p43  # 살 4는 인덱스 4에 저장

    # 나머지 살 계산은 원본 Python 코드의 전체 로직을 포함해야 함
    # 여기서는 간소화된 버전만 포함
    
    return score, sal0, sal1

def main():
    """메인 함수: JSON 입력을 받아 계산 결과를 반환"""
    try:
        # 입력 JSON 읽기
        input_data = json.loads(sys.stdin.read())
        
        # 입력값 검증
        person0 = input_data.get('person0')  # [년간, 년지, 월간, 월지, 일간, 일지]
        person1 = input_data.get('person1')
        gender0 = input_data.get('gender0', 0)  # 1=남자, 0=여자
        gender1 = input_data.get('gender1', 0)
        
        if not person0 or not person1:
            print(json.dumps({
                'success': False,
                'error': 'person0 또는 person1이 없습니다.'
            }))
            return
        
        # 모델 및 데이터 로드
        if not load_models():
            print(json.dumps({
                'success': False,
                'error': '모델 로드 실패'
            }))
            return
        
        # TensorFlow 모델로 기본 점수 계산
        ys = calculate_sky(person0[0], person1[0])  # 년간
        ms = calculate_sky(person0[2], person1[2])  # 월간
        ds = calculate_sky(person0[4], person1[4])  # 일간
        ye = calculate_earth(person0[1], person1[1])  # 년지
        me = calculate_earth(person0[3], person1[3])  # 월지
        de = calculate_earth(person0[5], person1[5])  # 일지
        
        # 기본 점수 계산
        score = (0.6*ys.item()) + (4.5*ds.item()) + (1.0*ye.item()) + (1.5*me.item()) + (4.5*de.item())
        org_score = float(score)
        
        # 살 계산 및 감점
        final_score, sal0, sal1 = calculate(person0, person1, gender0, gender1, score)
        
        # 결과 반환
        result = {
            'success': True,
            'data': {
                'originalScore': org_score,
                'finalScore': float(final_score),
                'sal0': [float(x) for x in sal0],
                'sal1': [float(x) for x in sal1],
            }
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }), file=sys.stderr)

if __name__ == '__main__':
    main()

