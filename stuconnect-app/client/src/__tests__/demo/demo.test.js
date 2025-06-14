it('equality', () => {
    expect(1).toBe(1);
    expect(1).toEqual(1);
    expect(()=> {throw new Error('Error!')}).toThrow('Error!');
});

it('match', () => {
  expect("Hello World").toMatch(/hello/i);
});

it('falsy', () => {
  expect("Hello World").toBeTruthy();
  expect(" ").toBeTruthy();
  expect("").toBeFalsy();
  expect(0).toBeFalsy();
  expect(null).toBeFalsy();
  expect(undefined).toBeFalsy();

  expect(0).toBeDefined();
  expect(null).toBeDefined();
  expect(undefined).not.toBeDefined();
  
  expect(null).toBeNull();
  expect(0).not.toBeNull();
  expect(undefined).not.toBeNull();
});