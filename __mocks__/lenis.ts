const Lenis = jest.fn().mockImplementation(() => ({
  raf: jest.fn(),
  destroy: jest.fn(),
  scrollTo: jest.fn(),
}));

export default Lenis;
