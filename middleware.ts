import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // 1. ÁREA DE ADMINISTRAÇÃO MÁXIMA (Apenas ADMIN)
  if (pathname.startsWith('/admin')) {
    const role = req.auth?.user?.role;
    if (!req.auth || role !== 'ADMIN') {
      const loginUrl = new URL('/api/auth/signin', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. ÁREA DE EMPRESAS (BUSINESS ou ADMIN)
  if (pathname.startsWith('/dashboard')) {
    const role = req.auth?.user?.role;
    if (!req.auth || (role !== 'BUSINESS' && role !== 'ADMIN')) {
      const loginUrl = new URL('/api/auth/signin', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon.svg).*)'],
};
