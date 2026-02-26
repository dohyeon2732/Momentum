-- 국 생성
INSERT INTO kuk (kuk_id, kuk_name) VALUES (1, '회장단');
INSERT INTO kuk (kuk_id, kuk_name) VALUES (2, '총괄운영국');
INSERT INTO kuk (kuk_id, kuk_name) VALUES (3, '재정사무국');
INSERT INTO kuk (kuk_id, kuk_name) VALUES (4, '행사기획국');
INSERT INTO kuk (kuk_id, kuk_name) VALUES (5, '문화기획국');
INSERT INTO kuk (kuk_id, kuk_name) VALUES (6, '교육정책국');
INSERT INTO kuk (kuk_id, kuk_name) VALUES (7, '인권복지국');
INSERT INTO kuk (kuk_id, kuk_name) VALUES (8, '대외협력국');
INSERT INTO kuk (kuk_id, kuk_name) VALUES (9, '홍보소통국');
INSERT INTO kuk (kuk_id, kuk_name) VALUES (10, '디자인국');


-- 방 생성
INSERT INTO room (room_id, room_name) VALUES (1, '총학생회 회의실 (310호)');
INSERT INTO room (room_id, room_name) VALUES (2, '남학생 휴게실 (304호)');
INSERT INTO room (room_id, room_name) VALUES (3, '여학생 휴게실 (305호)');

-- 사용자 생성
INSERT INTO user (user_id, user_name, password, kuk_id)
VALUES (1, '이륜도', '1234', 1);

INSERT INTO user (user_id, user_name, password, kuk_id)
VALUES (2, '김도현', '1234', 1);