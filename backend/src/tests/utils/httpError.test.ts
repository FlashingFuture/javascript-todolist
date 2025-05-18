import { HTTPError } from "@/utils/httpError";
import { StatusCodes } from "http-status-codes";

describe("HTTPError", () => {
  test("기본 메시지 사용 (404)", () => {
    const error = new HTTPError(
      StatusCodes.NOT_FOUND,
      "존재하지 않는 사용자입니다."
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(error.message).toBe("존재하지 않는 사용자입니다.");
    expect(error.name).toBe("NotFound");
  });

  test("기본 메시지 사용 (400)", () => {
    const error = new HTTPError(
      StatusCodes.BAD_REQUEST,
      "모든 필드를 입력해주세요."
    );

    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(error.message).toBe("모든 필드를 입력해주세요.");
    expect(error.name).toBe("BadRequest");
  });

  test("빈 메시지일 경우 기본 reason phrase 사용", () => {
    const error = new HTTPError(StatusCodes.UNAUTHORIZED, "");

    expect(error.message).toBe("Unauthorized");
    expect(error.name).toBe("Unauthorized");
  });

  test("존재하지 않는 statusCode → throw", () => {
    expect(() => new HTTPError(9999, "모든 필드를 입력해주세요.")).toThrow();
  });
});
