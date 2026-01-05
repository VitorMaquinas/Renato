
import { useState, useEffect } from 'react';
import { Client, Equipment, Budget } from './types';

const STORAGE_KEY = 'assistencia_pro_data';

export const useStore = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setClients(parsed.clients || []);
      setEquipments(parsed.equipments || []);
      setBudgets(parsed.budgets || []);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ clients, equipments, budgets }));
    }
  }, [clients, equipments, budgets, isLoaded]);

  const addClient = (client: Client) => setClients(prev => [...prev, client]);
  const addEquipment = (equip: Equipment) => setEquipments(prev => [...prev, equip]);
  const addBudget = (budget: Budget) => setBudgets(prev => [budget, ...prev]);

  const updateBudgetStatus = (id: string, status: Budget['status']) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return {
    clients,
    equipments,
    budgets,
    addClient,
    addEquipment,
    addBudget,
    updateBudgetStatus
  };
};
