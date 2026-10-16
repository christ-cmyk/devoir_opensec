import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

interface Item {
  id: string;
  name: string;
}

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  afterEach(() => localStorage.clear());

  it('retourne un tableau vide pour une clÃ© inconnue', () => {
    expect(service.getAll<Item>('inconnu')).toEqual([]);
  });

  it('crÃ©e puis lit un Ã©lÃ©ment', () => {
    const created = service.create<Item>('pma_items', { id: '', name: 'A' });
    expect(created.id).toBeTruthy();
    expect(service.getAll<Item>('pma_items').length).toBe(1);
    expect(service.getById<Item>('pma_items', created.id)?.name).toBe('A');
  });

  it('met Ã  jour un Ã©lÃ©ment', () => {
    const created = service.create<Item>('pma_items', { id: '', name: 'A' });
    service.update<Item>('pma_items', { ...created, name: 'B' });
    expect(service.getById<Item>('pma_items', created.id)?.name).toBe('B');
  });

  it('supprime un Ã©lÃ©ment', () => {
    const created = service.create<Item>('pma_items', { id: '', name: 'A' });
    service.delete('pma_items', created.id);
    expect(service.getAll<Item>('pma_items')).toEqual([]);
  });

  it('clearAll vide toutes les clÃ©s applicatives', () => {
    service.create<Item>('pma_items', { id: '', name: 'A' });
    service.writeValue('pma_session', { userId: 'x' });
    service.clearAll();
    expect(service.getAll<Item>('pma_items')).toEqual([]);
    expect(service.readValue('pma_session')).toBeNull();
  });
});
