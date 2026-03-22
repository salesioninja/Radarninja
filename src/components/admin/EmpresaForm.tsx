'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { empresaFormSchema, EmpresaFormValues } from '@/schema/admin-empresa';
import { createEmpresaAction, updateEmpresaAction } from '@/actions/admin-empresa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Store, Plus, Trash2, MapPin, ExternalLink, Image, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { OfferCard } from '@/components/OfferCard';
import { NearbyOffer } from '@/actions/get-nearby-offers';
import { OfferDetailDialog } from '@/components/OfferDetailDialog';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EmpresaFormProps {
  initialData?: EmpresaFormValues;
  empresaId?: string;
}

export function EmpresaForm({ initialData, empresaId }: EmpresaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaFormSchema),
    defaultValues: initialData || {
      name: '',
      category: 'Serviços',
      shortDescription: '',
      longDescription: '',
      n8nEndpointUrl: '',
      logoUrl: '',
      coverImageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
      address: '',
      phone: '',
      latitude: 0,
      longitude: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      products: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  });

  const formValues = watch();

  // Mapped Live Preview Data
  const previewOffer: NearbyOffer = {
    id: empresaId || 'live-preview-id',
    title: formValues.shortDescription || 'Sua Oferta Aqui',
    description: `${formValues.category || 'Categoria'} | ${formValues.shortDescription || 'Descrição'}`,
    imageUrl: formValues.coverImageUrl || null,
    products: formValues.products?.map((p: any) => ({
      name: p.name || 'Produto Teste',
      price: p.price || 0,
      image: p.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      link: p.link || '',
      buttonText: p.buttonText || 'Comprar'
    })) || null,
    price: 100, // Pontos Padrão
    businessName: formValues.name || 'Nome da Empresa',
    businessAddress: formValues.address || 'Endereço da Empresa',
    businessPhone: formValues.phone || '4699999999',
    businessLat: formValues.latitude || 0,
    businessLng: formValues.longitude || 0,
    distance: 0.1, // Apenas para mostrar o componente
  };

  const onSubmit = async (data: EmpresaFormValues) => {
    setLoading(true);
    try {
      if (empresaId) {
        const res = await updateEmpresaAction(empresaId, data);
        if (res.success) { 
          toast.success('Empresa atualizada com sucesso!'); 
          router.push('/admin/empresas'); 
        } else {
          toast.error(`Erro ao atualizar: ${res.error}`);
        }
      } else {
        const res = await createEmpresaAction(data);
        if (res.success) {
          toast.success('Empresa registrada com sucesso!');
          router.push('/admin/empresas');
        } else {
          toast.error(`Erro: ${res.error}`);
        }
      }
    } catch (e) {
      toast.error('Erro de conexão ao salvar empresa');
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: any) => {
    console.error("Form errors:", errors);
    toast.error('Preencha os campos obrigatórios corretamente.');
  };

  const isEditing = !!empresaId;

  return (
    <div className="min-h-screen mesh-bg text-[#F0F4FF] pt-12 pb-24 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ═══ FORMULÁRIO ═══ */}
        <div className="glass-dark rounded-2xl p-6 lg:p-8 overflow-y-auto max-h-[85vh] custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-[var(--neon-cyan)]" />
              <h1 className="text-2xl font-bold tracking-wide">
                {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
              </h1>
            </div>
            
            <Link href="/admin/empresas">
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/5 h-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            
            {/* INFORMAÇÕES BÁSICAS */}
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input {...register('name')} placeholder="Ex: Salão Beleza Pura" className="input-dark h-11" />
                  {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input {...register('category')} placeholder="Ex: Beleza e Estética" className="input-dark h-11" />
                  {errors.category && <p className="text-red-400 text-xs">{errors.category.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição Curta (Oferta)</Label>
                <Input {...register('shortDescription')} placeholder="Ex: Corte e Hidratação Neon" className="input-dark h-11" />
                {errors.shortDescription && <p className="text-red-400 text-xs">{errors.shortDescription.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Descrição Longa</Label>
                <textarea 
                  {...register('longDescription')} 
                  placeholder="Texto completo sobre a empresa..." 
                  className="w-full min-h-[100px] p-3 rounded-xl input-dark text-sm custom-scrollbar bg-black/40 border border-white/10 focus:border-[var(--neon-cyan)] outline-none transition-colors mb-2" 
                />
              </div>
            </div>

            {/* CONTATO & LOCALIZAÇÃO */}
            <div className="space-y-4 pt-4">
              <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">Contato & Localização</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>WhatsApp / Telefone</Label>
                  <Input {...register('phone')} placeholder="Ex: 4699999999" className="input-dark h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Endereço Físico</Label>
                  <Input {...register('address')} placeholder="Rua, Número, Bairro" className="input-dark h-11" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[var(--neon-purple)]" /> Latitude</Label>
                  <Input {...register('latitude', { valueAsNumber: true })} type="number" step="any" className="input-dark h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[var(--neon-purple)]" /> Longitude</Label>
                  <Input {...register('longitude', { valueAsNumber: true })} type="number" step="any" className="input-dark h-11" />
                </div>
              </div>
            </div>

            {/* MÍDIA & INTEGRAÇÃO */}
            <div className="space-y-4 pt-4">
              <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">Mídia & IA</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Image className="w-3 h-3 text-[var(--neon-cyan)]" /> URL da Imagem de Capa</Label>
                  <Input {...register('coverImageUrl')} placeholder="https://..." className="input-dark h-11" />
                </div>
                <div className="space-y-2">
                  <Label>URL do Logo (Opcional)</Label>
                  <Input {...register('logoUrl')} placeholder="https://..." className="input-dark h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><ExternalLink className="w-3 h-3 text-[#00ff88]" /> Webhook do n8n (Chat IA)</Label>
                  <Input {...register('n8nEndpointUrl')} placeholder="https://n8n.seu-dominio.com/webhook/..." className="input-dark h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Data de Validade da Oferta</Label>
                  <Input {...register('expiresAt')} type="date" className="input-dark h-11" />
                </div>
              </div>
            </div>

            {/* PRODUTOS / SERVIÇOS */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-widest">Produtos / Serviços</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => append({ name: '', price: 0, image: '', link: '', buttonText: 'Comprar' })}
                  className="h-7 text-[10px] gap-1 glass-dark text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30 hover:bg-[var(--neon-cyan)]/10"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </Button>
              </div>

              {fields.map((field: any, index: number) => (
                <div key={field.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3 relative">
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="absolute top-3 right-3 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                    <div className="space-y-1">
                      <Label className="text-[10px]">Nome do Produto</Label>
                      <Input {...register(`products.${index}.name`)} className="input-dark h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Preço (R$)</Label>
                      <Input {...register(`products.${index}.price`, { valueAsNumber: true })} type="number" step="0.01" className="input-dark h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">URL da Foto</Label>
                      <Input {...register(`products.${index}.image`)} className="input-dark h-9 text-xs" />
                      {errors?.products?.[index]?.image && <p className="text-red-400 text-[10px]">{errors.products[index]?.image?.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Link de Checkout / WhatsApp</Label>
                      <Input {...register(`products.${index}.link`)} placeholder="https://..." className="input-dark h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Texto do Botão</Label>
                      <Input {...register(`products.${index}.buttonText`)} placeholder="Ex: Comprar" className="input-dark h-9 text-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 btn-gradient rounded-xl font-bold text-sm tracking-wide mt-8">
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar Empresa' : 'Salvar Empresa')}
            </Button>
          </form>
        </div>

        {/* ═══ LIVE PREVIEW ═══ */}
        <div className="hidden lg:flex flex-col gap-6 sticky top-12 h-[calc(100vh-6rem)]">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--neon-purple)]">Live Preview</h2>
            <span className="text-[10px] text-white/40">Visualização em Tempo Real</span>
          </div>

          <div className="w-full max-w-[320px] mx-auto opacity-90 hover:opacity-100 transition-opacity">
            <OfferCard offer={previewOffer} onClick={() => setPreviewOpen(true)} />
          </div>

          <div className="glass-dark rounded-2xl p-6 text-center mt-4 border border-[var(--neon-cyan)]/20 shadow-[0_0_30px_rgba(0,255,136,0.05)]">
            <p className="text-sm text-white/60 mb-4">Clique no card acima para testar o modal de detalhes (produtos e mapa).</p>
            <Button variant="outline" onClick={() => setPreviewOpen(true)} className="glass-dark border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10">
              Abrir Modal Completo
            </Button>
          </div>
        </div>

      </div>

      {previewOpen && (
        <OfferDetailDialog offer={previewOffer} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
}
