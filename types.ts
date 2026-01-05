
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
}

export interface Equipment {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  serialNumber: string;
  type: string;
}

export interface Budget {
  id: string;
  clientId: string;
  equipmentId: string;
  description: string;
  professionalDescription?: string;
  value: number;
  status: 'Em andamento' | 'Aprovado' | 'Reprovado' | 'Finalizado';
  createdAt: string;
}

export type ViewState = 'dashboard' | 'clients' | 'equipments' | 'budgets' | 'new-budget';
