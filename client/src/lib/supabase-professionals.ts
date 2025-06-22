import { supabase } from './supabase';

export interface CAD_Profissional {
  id: number;
  nome: string;
  especialidade: string;
  crm: string;
  descricao?: string;
  experiencia?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export class SupabaseProfessionalsService {
  
  // Buscar todos os profissionais ativos
  async getAllProfessionals(): Promise<CAD_Profissional[]> {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar profissionais:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      throw error;
    }
  }

  // Buscar profissional por ID
  async getProfessionalById(id: number): Promise<CAD_Profissional | null> {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('Erro ao buscar profissional:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      throw error;
    }
  }

  // Buscar profissionais por especialidade
  async getProfessionalsBySpecialty(especialidade: string): Promise<CAD_Profissional[]> {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('*')
        .eq('especialidade', especialidade)
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar profissionais por especialidade:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      throw error;
    }
  }

  // Criar novo profissional
  async createProfessional(professional: Omit<CAD_Profissional, 'id' | 'created_at' | 'updated_at'>): Promise<CAD_Profissional> {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .insert([{
          ...professional,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar profissional:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      throw error;
    }
  }

  // Atualizar profissional
  async updateProfessional(id: number, updates: Partial<CAD_Profissional>): Promise<CAD_Profissional> {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar profissional:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      throw error;
    }
  }

  // Desativar profissional (soft delete)
  async deactivateProfessional(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('CAD_Profissional')
        .update({ 
          ativo: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Erro ao desativar profissional:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      throw error;
    }
  }

  // Buscar especialidades únicas
  async getUniqueSpecialties(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('especialidade')
        .eq('ativo', true)
        .order('especialidade');

      if (error) {
        console.error('Erro ao buscar especialidades:', error);
        throw error;
      }

      // Extrair especialidades únicas
      const specialties = [...new Set(data?.map(item => item.especialidade) || [])];
      return specialties.filter(Boolean);
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      throw error;
    }
  }

  // Buscar estatísticas dos profissionais
  async getProfessionalsStats() {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('especialidade, ativo')
        .eq('ativo', true);

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
      }

      const stats = {
        total: data?.length || 0,
        bySpecialty: {} as Record<string, number>,
        active: data?.filter(p => p.ativo).length || 0
      };

      // Contar por especialidade
      data?.forEach(professional => {
        if (professional.especialidade) {
          stats.bySpecialty[professional.especialidade] = 
            (stats.bySpecialty[professional.especialidade] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      throw error;
    }
  }

  // Testar conexão
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('CAD_Profissional')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Erro na conexão:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return false;
    }
  }
}

export const supabaseProfessionals = new SupabaseProfessionalsService();