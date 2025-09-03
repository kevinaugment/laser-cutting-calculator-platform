// Jest配置验证测试 - Phase 4: 质量保证与测试覆盖

describe('Jest Configuration Test', () => {
  it('should run basic test successfully', () => {
    expect(1 + 1).toBe(2);
  });

  it('should support TypeScript', () => {
    const message: string = 'TypeScript works';
    expect(typeof message).toBe('string');
    expect(message).toBe('TypeScript works');
  });

  it('should support async/await', async () => {
    const promise = Promise.resolve('async works');
    const result = await promise;
    expect(result).toBe('async works');
  });

  it('should support modern JavaScript features', () => {
    const array = [1, 2, 3, 4, 5];
    const doubled = array.map(x => x * 2);
    const filtered = doubled.filter(x => x > 5);
    
    expect(doubled).toEqual([2, 4, 6, 8, 10]);
    expect(filtered).toEqual([6, 8, 10]);
  });
});
