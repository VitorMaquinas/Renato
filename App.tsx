
import React, { useState } from 'react';
import { useStore } from './store';
import { ViewState, Client, Equipment, Budget } from './types';
import { professionalizeDescription } from './services/geminiService';

// Icons as simple SVG components
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Tool: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  FileText: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Print: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
};

const BudgetPrintView: React.FC<{ budget: Budget; client: Client; equipment: Equipment }> = ({ budget, client, equipment }) => {
  const Copy = ({ title }: { title: string }) => (
    <div className="p-8 border-b-2 border-dashed border-gray-300 mb-12 last:border-0 last:mb-0">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ASSISTÊNCIA PRO</h1>
          <p className="text-sm text-gray-500">Soluções Técnicas de Alta Performance</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg uppercase">{title}</p>
          <p className="text-sm text-gray-600">Orçamento #{budget.id.split('-')[0]}</p>
          <p className="text-sm text-gray-600">Data: {new Date(budget.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-1">DADOS DO CLIENTE</h3>
          <p><span className="font-medium">Nome:</span> {client.name}</p>
          <p><span className="font-medium">Telefone:</span> {client.phone}</p>
          <p><span className="font-medium">E-mail:</span> {client.email}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-1">EQUIPAMENTO</h3>
          <p><span className="font-medium">Modelo:</span> {equipment.brand} {equipment.model}</p>
          <p><span className="font-medium">S/N:</span> {equipment.serialNumber}</p>
          <p><span className="font-medium">Tipo:</span> {equipment.type}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-1 mb-2">DESCRIÇÃO DO SERVIÇO</h3>
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {budget.professionalDescription || budget.description}
        </p>
      </div>

      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-600 uppercase">Status</p>
          <p className="font-bold text-blue-700">{budget.status}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 uppercase">Valor Total</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budget.value)}
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 gap-16 text-center text-xs text-gray-500">
        <div className="border-t border-gray-400 mt-8 pt-2">Assinatura do Responsável</div>
        <div className="border-t border-gray-400 mt-8 pt-2">Assinatura do Cliente</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <Copy title="Cópia do Cliente" />
      <div className="my-8" />
      <Copy title="Cópia da Assistência" />
    </div>
  );
};

export default function App() {
  const { clients, equipments, budgets, addClient, addEquipment, addBudget, updateBudgetStatus } = useStore();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [printingBudget, setPrintingBudget] = useState<Budget | null>(null);
  
  // New Budget Form State
  const [newBudget, setNewBudget] = useState({
    clientId: '',
    equipmentId: '',
    description: '',
    value: 0
  });
  const [isProfessionalizing, setIsProfessionalizing] = useState(false);

  const handleCreateBudget = async () => {
    if (!newBudget.clientId || !newBudget.equipmentId || !newBudget.description) {
      alert("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    setIsProfessionalizing(true);
    const profDesc = await professionalizeDescription(newBudget.description);
    
    const budget: Budget = {
      id: crypto.randomUUID(),
      clientId: newBudget.clientId,
      equipmentId: newBudget.equipmentId,
      description: newBudget.description,
      professionalDescription: profDesc,
      value: newBudget.value,
      status: 'Em andamento',
      createdAt: new Date().toISOString()
    };

    addBudget(budget);
    setIsProfessionalizing(false);
    setCurrentView('budgets');
    setNewBudget({ clientId: '', equipmentId: '', description: '', value: 0 });
  };

  const handlePrint = (budget: Budget) => {
    setPrintingBudget(budget);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Orçamentos Ativos', value: budgets.filter(b => b.status === 'Em andamento').length, color: 'bg-blue-500' },
                { label: 'Total Clientes', value: clients.length, color: 'bg-green-500' },
                { label: 'Aguardando Aprovação', value: budgets.filter(b => b.status === 'Em andamento').length, color: 'bg-yellow-500' },
                { label: 'Finalizados', value: budgets.filter(b => b.status === 'Finalizado').length, color: 'bg-purple-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                  <span className="text-sm text-gray-500 uppercase font-semibold">{stat.label}</span>
                  <span className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Icons.FileText /> Últimos Orçamentos
                </h3>
                <div className="divide-y divide-gray-100">
                  {budgets.slice(0, 5).map(b => (
                    <div key={b.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{clients.find(c => c.id === b.clientId)?.name || 'Cliente Desconhecido'}</p>
                        <p className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' :
                        b.status === 'Aprovado' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                  {budgets.length === 0 && <p className="text-sm text-gray-400 py-4 italic">Nenhum orçamento cadastrado.</p>}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <Icons.Plus /> Ações Rápidas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setCurrentView('new-budget')} className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex flex-col items-center gap-2">
                    <Icons.Plus /> <span>Novo Orçamento</span>
                  </button>
                  <button onClick={() => setCurrentView('clients')} className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex flex-col items-center gap-2">
                    <Icons.Users /> <span>Novo Cliente</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
              <button onClick={() => {
                const name = prompt("Nome do Cliente:");
                if (name) {
                  addClient({
                    id: crypto.randomUUID(),
                    name,
                    email: prompt("Email:") || '',
                    phone: prompt("Telefone:") || '',
                    document: prompt("Documento (CPF/CNPJ):") || ''
                  });
                }
              }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Icons.Plus /> Novo Cliente
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map(c => (
                    <tr key={c.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.document}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{c.email}</div>
                        <div className="text-xs">{c.phone}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length === 0 && <div className="p-12 text-center text-gray-400">Nenhum cliente cadastrado.</div>}
            </div>
          </div>
        );

      case 'equipments':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Equipamentos</h2>
              <button onClick={() => {
                const ownerId = clients[0]?.id || '';
                if (!ownerId) {
                  alert("Cadastre um cliente primeiro!");
                  return;
                }
                const brand = prompt("Marca:");
                if (brand) {
                  addEquipment({
                    id: crypto.randomUUID(),
                    ownerId: prompt("ID do Cliente (vazio para primeiro da lista):") || ownerId,
                    brand,
                    model: prompt("Modelo:") || '',
                    serialNumber: prompt("S/N:") || '',
                    type: prompt("Tipo (ex: Notebook, Celular):") || ''
                  });
                }
              }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Icons.Plus /> Novo Equipamento
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proprietário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N/S</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {equipments.map(e => (
                    <tr key={e.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.brand} {e.model} ({e.type})</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clients.find(cl => cl.id === e.ownerId)?.name || 'Desconhecido'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.serialNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {equipments.length === 0 && <div className="p-12 text-center text-gray-400">Nenhum equipamento cadastrado.</div>}
            </div>
          </div>
        );

      case 'budgets':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Orçamentos</h2>
              <button onClick={() => setCurrentView('new-budget')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Icons.Plus /> Novo Orçamento
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente / Equip.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgets.map(b => {
                    const client = clients.find(c => c.id === b.clientId);
                    const equipment = equipments.find(e => e.id === b.equipmentId);
                    return (
                      <tr key={b.id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{client?.name}</div>
                          <div className="text-xs text-gray-500">{equipment?.brand} {equipment?.model}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select 
                            value={b.status} 
                            onChange={(e) => updateBudgetStatus(b.id, e.target.value as any)}
                            className="text-xs font-bold uppercase rounded p-1 border-gray-300"
                          >
                            <option value="Em andamento">Em andamento</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Reprovado">Reprovado</option>
                            <option value="Finalizado">Finalizado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(b.value)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handlePrint(b)} className="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto">
                            <Icons.Print /> Imprimir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {budgets.length === 0 && <div className="p-12 text-center text-gray-400">Nenhum orçamento emitido.</div>}
            </div>
          </div>
        );

      case 'new-budget':
        return (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Orçamento</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select 
                  className="w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white border"
                  value={newBudget.clientId}
                  onChange={(e) => setNewBudget({...newBudget, clientId: e.target.value})}
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipamento</label>
                <select 
                  className="w-full border-gray-300 rounded-lg shadow-sm p-2 bg-white border"
                  value={newBudget.equipmentId}
                  onChange={(e) => setNewBudget({...newBudget, equipmentId: e.target.value})}
                >
                  <option value="">Selecione o equipamento...</option>
                  {equipments
                    .filter(e => !newBudget.clientId || e.ownerId === newBudget.clientId)
                    .map(e => <option key={e.id} value={e.id}>{e.brand} {e.model} ({e.type})</option>)
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Problema / Serviço</label>
                <textarea 
                  rows={4}
                  className="w-full border-gray-300 rounded-lg shadow-sm p-2 border"
                  placeholder="Descreva o problema ou o serviço que será realizado..."
                  value={newBudget.description}
                  onChange={(e) => setNewBudget({...newBudget, description: e.target.value})}
                />
                <p className="text-[10px] text-gray-400 mt-1 italic">
                  * Nossa IA irá gerar uma descrição técnica profissional baseada no que você escrever aqui.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado (R$)</label>
                <input 
                  type="number"
                  className="w-full border-gray-300 rounded-lg shadow-sm p-2 border"
                  value={newBudget.value}
                  onChange={(e) => setNewBudget({...newBudget, value: parseFloat(e.target.value)})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setCurrentView('budgets')}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCreateBudget}
                  disabled={isProfessionalizing}
                  className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${
                    isProfessionalizing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isProfessionalizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processando IA...
                    </>
                  ) : (
                    <>Gerar Orçamento</>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Painel', icon: <Icons.Dashboard /> },
    { id: 'clients', label: 'Clientes', icon: <Icons.Users /> },
    { id: 'equipments', label: 'Equipamentos', icon: <Icons.Tool /> },
    { id: 'budgets', label: 'Orçamentos', icon: <Icons.FileText /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Hidden during print */}
      <aside className={`no-print bg-slate-900 text-white w-full md:w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden md:block md:w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className={`font-bold text-xl tracking-tight transition-all ${!isSidebarOpen && 'md:opacity-0'}`}>
            Assistência<span className="text-blue-400">Pro</span>
          </h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded hidden md:block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                currentView === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className={`${!isSidebarOpen && 'md:hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 no-print">
        {renderContent()}
      </main>

      {/* Print-only View */}
      {printingBudget && (
        <div className="print-only fixed inset-0 bg-white z-[9999]">
          <BudgetPrintView 
            budget={printingBudget} 
            client={clients.find(c => c.id === printingBudget.clientId)!} 
            equipment={equipments.find(e => e.id === printingBudget.equipmentId)!}
          />
        </div>
      )}
    </div>
  );
}
