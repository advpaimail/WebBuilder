import {
  type LinksFunction,
  type LoaderFunctionArgs,
  type TypedResponse,
  json,
} from "@remix-run/server-runtime";
import { useLoaderData, type MetaFunction } from "@remix-run/react";
import {
  findAuthenticatedUser,
  authenticator,
} from "~/services/auth.server";
import env from "~/env/env.server";
import type { LoginProps } from "~/auth/index.client";
import { useLoginErrorMessage } from "~/shared/session";
import {
  comparePathnames,
  dashboardPath,
  isDashboard,
} from "~/shared/router-utils";
import { returnToCookie } from "~/services/cookie.server";
import { ClientOnly } from "~/shared/client-only";
import { lazy } from "react";
import { preventCrossOriginCookie } from "~/services/no-cross-origin-cookie";
import { redirect } from "~/services/no-store-redirect";
import { allowedDestinations } from "~/services/destinations.server";
export { ErrorBoundary } from "~/shared/error/error-boundary";

export const links: LinksFunction = () => {
  return [
    {
      rel: "canonical",
      href: "https://apps.webstudio.is/login",
    },
  ];
};

export const meta: MetaFunction<typeof loader> = () => {
  const metas: ReturnType<MetaFunction> = [
    {
      name: "title",
      content: "Webstudio Login",
    },
    {
      name: "description",
      content: "Log in to Webstudio to start creating websites.",
    },
    { name: "robots", content: "index, follow" },
  ];

  metas.push({ title: "Webstudio Login" });

  return metas;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<LoginProps>> => {
  if (false === isDashboard(request)) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  preventCrossOriginCookie(request);
  allowedDestinations(request, ["document", "empty"]);
  // CSRF token checks are not necessary for dashboard-only pages.
  // All requests from the builder or canvas app are safeguarded either by preventCrossOriginCookie for fetch requests
  // or by allowedDestinations for iframe requests.

  let user = await findAuthenticatedUser(request);

  const url = new URL(request.url);
  let returnTo = url.searchParams.get("returnTo") ?? dashboardPath();
  if (comparePathnames(returnTo, request.url)) {
    returnTo = dashboardPath();
  }

  // В dev: автоматический вход по AUTH_SECRET без страницы логина
  if (
    !user &&
    env.DEV_AUTO_LOGIN &&
    env.DEV_LOGIN === "true" &&
    env.AUTH_SECRET?.trim()
  ) {
    try {
      const authUrl = new URL("/auth/dev", request.url).toString();
      const formData = new URLSearchParams({
        secret: env.AUTH_SECRET.trim(),
      });
      const postRequest = new Request(authUrl, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const authResponse = await authenticator.authenticate("dev", postRequest, {
        successRedirect: returnTo,
        throwOnError: true,
      });
      return authResponse;
    } catch (error) {
      if (error instanceof Response) return error;
      // при ошибке показываем обычную страницу логина
    }
  }

  if (user) {
    throw redirect(returnTo);
  }

  const headers = new Headers();

  headers.append("Set-Cookie", await returnToCookie.serialize(returnTo));

  return json(
    {
      isSecretLoginEnabled: env.DEV_LOGIN === "true",
      isGithubEnabled: Boolean(env.GH_CLIENT_ID && env.GH_CLIENT_SECRET),
      isGoogleEnabled: Boolean(
        env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ),
    },
    { headers }
  );
};

const Login = lazy(async () => {
  const { Login } = await import("~/auth/index.client");
  return { default: Login };
});

const LoginRoute = () => {
  const errorMessage = useLoginErrorMessage();
  const data = useLoaderData<typeof loader>();
  return (
    <ClientOnly>
      <Login {...data} errorMessage={errorMessage} />
    </ClientOnly>
  );
};

export default LoginRoute;
