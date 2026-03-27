import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { businesses } from './schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });
const poolConnection = mysql.createPool({ uri: process.env.DATABASE_URL });
const db = drizzle(poolConnection);

async function verify() {
  console.log('🔍 Executando Query de Diagnóstico de Coordenadas...');
  
  const result = await db.select().from(businesses).where(eq(businesses.name, "Salão Beleza Pura"));
  
  if (result.length > 0) {
    const alvo = result[0];
    console.log('\n✅ ALVO ENCONTRADO no Banco de Dados (' + process.env.DB_URL + ' / local.db):');
    console.log(`-> Nome: ${alvo.name}`);
    console.log(`-> Latitude Geométrica (Matemática):  ${alvo.latitude}`);
    console.log(`-> Longitude Geométrica (Matemática): ${alvo.longitude}\n`);
    
    if (alvo.latitude === -25.787115 && alvo.longitude === -53.313242) {
      console.log('🚀 ESTADO: PERFEITO. As coordenadas reais da Eloíza/Salão estão gravadas com sucesso!');
    } else {
      console.log('❌ ALERTA: O banco AINDA contém coordenadas antigas/erradas.');
    }
  } else {
    console.log("❌ Alvo não encontrado. Você rodou o seed?");
  }
}

verify().catch(e => { console.error('Erro na query:', e); }).finally(() => process.exit(0));
