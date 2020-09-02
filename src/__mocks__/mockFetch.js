export const mockFetchSuccess = response => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: response })
    })
  );
};

export const mockFetchFailure = response => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.reject(response)
    })
  );
};
