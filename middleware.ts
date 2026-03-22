import { NextResponse } from 'next/server';
import { auth } from './auth';

// Pilar 1 (Alfabetização Lógica):
// O Middleware atua na Edge Network do Next.js ANTES de a página ser renderizada ou checar banco de dados.
// Ele intercepta requests, decodifica o JWT guardado estritamente por cookie da web,
// e valida se esse ninja tem a permissão de "BUSINESS" antes de permitir o acesso ao "/dashboard".
// Fazer isso na edge previne vulnerabilidades como o vazamento de tela temporária (FOUC),
// e economiza tráfego de máquina, afinal usuários negados não gastam nosso banco de dados da Vercel.
export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    const role = req.auth?.user?.role;
    // Administradores ou Business podem acessar o /admin
    if (!req.auth || role !== 'BUSINESS') {
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
