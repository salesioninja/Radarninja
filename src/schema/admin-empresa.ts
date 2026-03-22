import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório'),
  price: z.number().min(0, 'Preço deve ser positivo'),
  image: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  link: z.string().url('URL inválida').optional().or(z.literal('')),
  buttonText: z.string().optional().or(z.literal('')),
});

export const empresaFormSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  category: z.string().min(2, 'Categoria é obrigatória'),
  shortDescription: z.string().min(5, 'Descrição curta é obrigatória'),
  longDescription: z.string().optional(),
  n8nEndpointUrl: z.string().url('URL do n8n inválida').optional().or(z.literal('')),
  logoUrl: z.string().url('URL do logo inválida').optional().or(z.literal('')),
  coverImageUrl: z.string().url('URL da capa inválida').optional().or(z.literal('')),
  address: z.string().min(5, 'Endereço é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  products: z.array(productSchema).optional(),
  expiresAt: z.string().optional(), // 'YYYY-MM-DD'
});

export type EmpresaFormValues = z.infer<typeof empresaFormSchema>;
