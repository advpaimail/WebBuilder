import { describe, test, expect, vi, beforeEach } from "vitest";

const mockFindAuthenticatedUser = vi.fn();
const mockAuthenticate = vi.fn();
const mockReturnToCookieSerialize = vi.fn().mockResolvedValue("");

vi.mock("~/env/env.server", () => ({
  default: {
    DEV_AUTO_LOGIN: true,
    DEV_LOGIN: "true",
    AUTH_SECRET: "dev-secret",
    GH_CLIENT_ID: "",
    GH_CLIENT_SECRET: "",
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
  },
}));

vi.mock("~/services/auth.server", () => ({
  findAuthenticatedUser: (req: Request) => mockFindAuthenticatedUser(req),
  authenticator: {
    authenticate: (...args: unknown[]) => mockAuthenticate(...args),
  },
}));

vi.mock("~/services/cookie.server", () => ({
  returnToCookie: { serialize: () => mockReturnToCookieSerialize() },
}));

const createRequest = (url = "https://example.com/login") =>
  new Request(url, {
    method: "GET",
    headers: {
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "navigate",
      "sec-fetch-dest": "document",
    },
  });

describe("login loader (auto-login)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReturnToCookieSerialize.mockResolvedValue("");
  });

  test("redirects to dashboard when DEV_AUTO_LOGIN and auth succeeds", async () => {
    mockFindAuthenticatedUser.mockResolvedValue(null);
    mockAuthenticate.mockResolvedValue(
      new Response(null, { status: 302, headers: { Location: "/dashboard" } })
    );

    const { loader } = await import("./_ui.login._index");
    const response = await loader({
      request: createRequest(),
    } as any);

    expect(response).toBeInstanceOf(Response);
    expect((response as Response).status).toBe(302);
    expect((response as Response).headers.get("Location")).toBe("/dashboard");
    expect(mockAuthenticate).toHaveBeenCalledWith(
      "dev",
      expect.any(Request),
      expect.objectContaining({ successRedirect: "/dashboard" })
    );
  });

  test("when authenticate throws Response (redirect), returns it", async () => {
    mockFindAuthenticatedUser.mockResolvedValue(null);
    const redirectResponse = new Response(null, {
      status: 302,
      headers: { Location: "/dashboard" },
    });
    mockAuthenticate.mockRejectedValue(redirectResponse);

    const { loader } = await import("./_ui.login._index");
    const response = await loader({ request: createRequest() } as any);

    expect(response).toBe(redirectResponse);
    expect((response as Response).headers.get("Location")).toBe("/dashboard");
  });
});
