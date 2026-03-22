import { getAdminEmpresaById } from '@/actions/admin-empresa';
import { EmpresaForm } from '@/components/admin/EmpresaForm';
import { notFound } from 'next/navigation';

export default async function EditarEmpresaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const empresaData = await getAdminEmpresaById(resolvedParams.id);

  if (!empresaData) {
    notFound();
  }

  return <EmpresaForm initialData={empresaData} empresaId={resolvedParams.id} />;
}
