import { getNamehash } from "@ensdomains/ui";
import { emptyAddress } from "../../utils/utils";
import { handleMultipleTransactions, handleSingleTransaction } from "./manager";

jest.mock("@ensdomains/ui", () => ({
  __esModule: true,
  ...jest.requireActual("@ensdomains/ui"),
  getNamehash: jest.fn(),
  encodeContenthash: jest.fn(),
}));

jest.mock("../resolverUtils", () => ({
  __esModule: true,
  ...jest.requireActual("../resolverUtils"),
  sendHelper: jest.fn(),
  sendHelperArray: jest.fn(),
}));

describe("handleMultipleTransactions", () => {
  it("should set contentHash to emptyAddress if value is emptyAddress", () => {
    const mockResolverInstanceFn = jest.fn();
    mockResolverInstanceFn.mockImplementation(() => "contentTx");

    const resolverInstance = {
      setContenthash: mockResolverInstanceFn,
    };

    const mockRecord = {
      contractFn: "setContenthash",
      value: emptyAddress,
    };

    getNamehash.mockImplementation(() => "namehash");
    handleSingleTransaction("name", mockRecord, resolverInstance);

    expect(mockResolverInstanceFn).toBeCalledWith("namehash", emptyAddress);
  });
});

describe("handleMultipleTransactions", () => {
  it("should set contentHash to emptyAddress if value is emptyAddress", () => {
    const mockResolverInstanceFn = jest.fn();
    mockResolverInstanceFn.mockImplementation(() => "contentTx");

    const mockEncodeFunctionData = jest.fn();

    const mockMulticallFn = jest.fn();

    const resolverInstance = {
      setContenthash: mockResolverInstanceFn,
      interface: {
        encodeFunctionData: mockEncodeFunctionData,
        multicall: mockMulticallFn,
      },
    };

    const mockRecord = {
      contractFn: "setContenthash",
      value: emptyAddress,
    };

    getNamehash.mockImplementation(() => "namehash");

    handleMultipleTransactions("name", [mockRecord], resolverInstance);
    expect(mockEncodeFunctionData.mock.calls[0][1]).toEqual([
      "namehash",
      emptyAddress,
    ]);
  });
});