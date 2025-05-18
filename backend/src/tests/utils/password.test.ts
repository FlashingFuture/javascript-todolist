import { hashPassword, verifyPassword } from "@/utils/password";

describe("비밀번호 해시 유틸 함수", () => {
  const password = "securePassword123";

  test("같은 비밀번호라도 salt가 다르면 해시가 달라야 한다", () => {
    const result1 = hashPassword(password);
    const result2 = hashPassword(password);

    expect(result1.passwordHash).not.toEqual(result2.passwordHash);
    expect(result1.salt).not.toEqual(result2.salt);
  });

  test("올바른 비밀번호는 검증에 성공해야 한다", () => {
    const { passwordHash, salt } = hashPassword(password);

    const isValid = verifyPassword(password, salt, passwordHash);
    expect(isValid).toBe(true);
  });

  test("틀린 비밀번호는 검증에 실패해야 한다", () => {
    const { passwordHash, salt } = hashPassword(password);

    const isValid = verifyPassword("wrongPassword", salt, passwordHash);
    expect(isValid).toBe(false);
  });
});
