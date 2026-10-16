import { generateSalt, hashPassword } from './crypto.util';

describe('crypto.util', () => {
  it('génère un sel de 32 caractères hexadécimaux', () => {
    const salt = generateSalt();
    expect(salt).toMatch(/^[0-9a-f]{32}$/);
  });

  it('génère deux sels différents', () => {
    expect(generateSalt()).not.toBe(generateSalt());
  });

  it('hashe un mot de passe de façon déterministe', async () => {
    const salt = 'abc123';
    const hash1 = await hashPassword('motdepasse', salt);
    const hash2 = await hashPassword('motdepasse', salt);
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[0-9a-f]{64}$/);
  });

  it('ne produit pas le mot de passe en clair', async () => {
    const hash = await hashPassword('motdepasse', 'sel');
    expect(hash).not.toContain('motdepasse');
  });

  it('produit un hash différent avec un sel différent', async () => {
    const hash1 = await hashPassword('motdepasse', 'sel1');
    const hash2 = await hashPassword('motdepasse', 'sel2');
    expect(hash1).not.toBe(hash2);
  });
});
