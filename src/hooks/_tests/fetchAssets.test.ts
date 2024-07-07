import fetchAssets from '../fetchAssets';
import axios from 'axios';
import { AxiosResponse } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchAssets', () => {
  it('fetches successfully data from an API', async () => {
    const data = { /* örnek veri */ };
    mockedAxios.get.mockResolvedValue({ data } as AxiosResponse);

    const result = await fetchAssets(1,false); // `page` parametresini ekleyin
    expect(result).toEqual(data);
  });

  it('fetches erroneously data from an API', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    await expect(fetchAssets(1,false)).rejects.toThrow(errorMessage); // `page` parametresini ekleyin
  });
});
