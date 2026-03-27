import { getAdminEmpresas, deleteEmpresaAction } from '@/actions/admin-empresa';
import { Button } from '@/components/ui/button';
import { Store, Plus, Edit2, Trash2, Bell } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function handleDelete(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await deleteEmpresaAction(id);
  revalidatePath('/admin/empresas');
}

export default async function AdminEmpresasListPage() {
  const empresas = await getAdminEmpresas();

  return (
    <div className="min-h-screen mesh-bg text-[#F0F4FF] pt-12 pb-24 font-sans px-4">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-[var(--neon-cyan)]" />
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Gestão de Empresas</h1>
              <p className="text-white/50 text-sm mt-1">Gerencie os estabelecimentos cadastrados no Radar.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            <Link href="/admin/notificacoes">
              <Button variant="outline" className="h-11 px-6 rounded-xl glass-dark border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 font-bold shadow-lg transition-all flex items-center gap-2">
                <Bell className="w-4 h-4" /> Notificações
              </Button>
            </Link>
            <Link href="/admin/empresas/nova">
              <Button className="h-11 px-6 rounded-xl btn-gradient font-bold shadow-lg shadow-[var(--neon-purple)]/20 hover:shadow-[var(--neon-purple)]/40 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Nova Empresa
              </Button>
            </Link>
          </div>
        </div>

        <div className="glass-dark rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          {empresas.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhuma empresa encontrada</h3>
              <p className="text-white/50 mb-6">Você ainda não cadastrou nenhuma empresa no sistema.</p>
              <Link href="/admin/empresas/nova">
                <Button variant="outline" className="glass-dark border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10">
                  <Plus className="w-4 h-4 mr-2" /> Cadastre a Primeira
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {empresas.map((emp) => (
                <div key={emp.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[var(--neon-cyan)] transition-colors">{emp.businessName}</h3>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span className="badge-neon px-2 py-0.5">{emp.category || 'Serviços'}</span>
                      <span>Criado em: {new Date(emp.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end border-t border-white/10 sm:border-0 pt-4 sm:pt-0">
                    <Link href={`/admin/empresas/${emp.id}/editar`}>
                      <Button variant="outline" size="sm" className="h-9 px-4 glass-dark text-white hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]">
                        <Edit2 className="w-3.5 h-3.5 mr-2" /> Editar
                      </Button>
                    </Link>
                    
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={emp.id} />
                      <Button type="submit" variant="outline" size="sm" className="h-9 w-9 p-0 glass-dark text-white/50 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
