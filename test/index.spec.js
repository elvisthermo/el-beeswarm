// arquivo de teste: sample.spec.js

describe('Calculadora', () => {
  it('deve somar dois números corretamente', () => {
    const resultado = 2 + 3;
    expect(resultado).toBe(5);
  });

  it('deve subtrair dois números corretamente', () => {
    const resultado = 5 - 3;
    expect(resultado).toBe(2);
  });
});
